'use server';

import { createSessionClient, createAdminClient } from "../../config/appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";

async function uploadAvatar(formData) {
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
        // Get the avatar file from form data
        const file = formData.get('avatar');
        
        if (!file) {
            return {
                success: false,
                error: 'No file provided'
            };
        }
        
        // Get session info to identify the user
        const { account } = await createSessionClient(sessionCookie.value);
        const user = await account.get();
        const employerId = user.$id;
        
        // Get admin client for storage operations
        const { storage } = await createAdminClient();
        
        // Upload the file
        const fileId = ID.unique();
        const fileUpload = await storage.createFile(
            process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_AVATARS, // Use the proper bucket ID
            fileId,
            file
        );
        
        // Generate the correct file URL
        // FIXED: Use the correct bucket ID in the URL and ensure all parameters are properly defined
        const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_AVATARS}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
        
        // Log for debugging
        console.log("Generated avatar URL:", fileUrl);
        
        return {
            success: true,
            fileUrl: fileUrl,
            fileId: fileId
        };
    } catch (error) {
        console.error('Failed to upload avatar', error);
        return {
            success: false,
            error: error.message || 'Error uploading avatar'
        };
    }
}

export default uploadAvatar;