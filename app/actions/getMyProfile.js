'use server';

import { createSessionClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

async function getMyProfile() {
    // Fix: await the cookies() function before calling get()
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('appwrite-session');
    
    if (!sessionCookie) {
        redirect('/login');
    }
    
    try {
        const { account, databases } = await createSessionClient(sessionCookie.value);

        // Get employer's id
        const user = await account.get();
        const employerId = user.$id;

        // Fetch the employer's profile information
        const { documents } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            [Query.equal('employerId', employerId)]
        );

        // Return the first document (should be only one matching the employerId)
        if (documents.length > 0) {
            return {
                success: true,
                profile: documents[0]
            };
        } else {
            return {
                success: false,
                error: 'Profile not found'
            };
        }
    } catch (error) {
        console.error('Failed to get profile', error);
        return {
            success: false,
            error: error.message || 'Error fetching profile'
        };
    }
}

export default getMyProfile;