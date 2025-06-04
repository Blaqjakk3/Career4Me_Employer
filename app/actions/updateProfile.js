'use server';

import { createSessionClient, createAdminClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";

// The updated function accepts formData parameter or a serialized object
async function updateProfile(formData) {
    // Fix: await the cookies() function before calling get()
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    
    if (!sessionCookie) {
        return {
            success: false,
            error: 'Not authenticated'
        };
    }
    
    try {
        // Get user session info
        const { account, databases } = await createSessionClient(sessionCookie.value);
        const user = await account.get();
        const employerId = user.$id;

        // Get current profile document
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            [Query.equal('employerId', employerId)]
        );

        if (documents.length === 0) {
            return {
                success: false,
                error: 'Profile not found'
            };
        }

        const profileId = documents[0].$id;
        const currentProfile = documents[0];
        
        // Build update object with only provided fields
        const updateData = {};
        
        // Check if formData is a FormData object or a regular object
        const isFormDataObject = typeof formData.get === 'function';
        
        // Handle both FormData and regular objects
        if (isFormDataObject) {
            // Process as FormData
            if (formData.get('name')) updateData.name = formData.get('name');
            if (formData.get('field')) updateData.field = formData.get('field');
            if (formData.get('about')) updateData.about = formData.get('about');
            if (formData.get('location')) updateData.location = formData.get('location');
            if (formData.get('website')) updateData.website = formData.get('website');
            if (formData.get('email')) updateData.email = formData.get('email');
            
            // Handle avatar update
            const newAvatarUrl = formData.get('avatar');
            if (newAvatarUrl) handleAvatarUpdate(newAvatarUrl, currentProfile, updateData);
        } else {
            // Process as regular object
            if (formData.name) updateData.name = formData.name;
            if (formData.field) updateData.field = formData.field;
            if (formData.about) updateData.about = formData.about;
            if (formData.location) updateData.location = formData.location;
            if (formData.website) updateData.website = formData.website;
            if (formData.email) updateData.email = formData.email;
            
            // Handle avatar update
            if (formData.avatar) handleAvatarUpdate(formData.avatar, currentProfile, updateData);
        }
        
        // Get admin client for document updates
        const { databases: adminDb } = await createAdminClient();

        // Update the document
        const updatedProfile = await adminDb.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            profileId,
            updateData
        );

        return {
            success: true,
            profile: updatedProfile
        };
    } catch (error) {
        console.error('Failed to update profile', error);
        return {
            success: false,
            error: error.message || 'Error updating profile'
        };
    }
}

// Helper function to handle avatar update logic
async function handleAvatarUpdate(newAvatarUrl, currentProfile, updateData) {
    // Only process if avatar was changed
    if (newAvatarUrl !== currentProfile.avatar) {
        updateData.avatar = newAvatarUrl;
        
        // Clean up the old avatar file if it exists
        if (currentProfile.avatar) {
            try {
                // Extract file ID from the old avatar URL
                const oldAvatarUrl = currentProfile.avatar;
                const urlParts = oldAvatarUrl.split('/');
                const fileIdIndex = urlParts.findIndex(part => part === 'files') + 1;
                
                if (fileIdIndex > 0 && fileIdIndex < urlParts.length) {
                    const fileId = urlParts[fileIdIndex].split('?')[0]; // Remove query parameters
                    
                    // Get admin client for storage operations
                    const { storage } = await createAdminClient();
                    
                    // Delete the old file
                    await storage.deleteFile(
                        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_AVATARS,
                        fileId
                    );
                    
                    console.log('Old avatar file deleted successfully');
                }
            } catch (deleteError) {
                // Just log the error, don't fail the update if cleanup fails
                console.error('Failed to delete old avatar file:', deleteError);
            }
        }
    }
}

export default updateProfile;