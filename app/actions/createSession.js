'use server';
import { createAdminClient } from "../../config/appwrite";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

async function createSession(previousState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if(!email || !password) {
        return { 
            error: 'Please fill in all fields' 
        };
    }

    // Get both account and databases instances
    const { account, databases } = await createAdminClient();

    try {
        // First create the session to get the user's ID
        const session = await account.createEmailPasswordSession(email, password);
        
        // Check if user exists in employers collection with matching email
        const employers = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            [
                Query.equal('email', email)
            ]
        );

        if (employers.total === 0) {
            // If no matching employer found, delete the session and return error
            await account.deleteSession(session.$id);
            return { 
                error: 'Account not authorized as employer' 
            };
        }

        // If employer verified, set the session cookie
        cookies().set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(session.expire),
            path: '/'
        });

        return {
            success: true,
            employer: employers.documents[0]
        };
    } catch (error) {
        console.error('Authentication Error:', error);
        return { 
            error: 'Invalid credentials' 
        };
    }
}

export default createSession;