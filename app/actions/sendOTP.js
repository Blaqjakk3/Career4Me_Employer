'use server';
import { createAdminClient } from "../../config/appwrite";
import { Query } from "node-appwrite";

async function sendOTP(previousState, formData) {
    const email = formData.get('email');

    if (!email) {
        return { 
            error: 'Please provide an email address' 
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { 
            error: 'Please provide a valid email address' 
        };
    }

    const { account, databases } = await createAdminClient();

    try {
        // First, check if email exists in employers collection
        const employers = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            [
                Query.equal('email', email)
            ]
        );

        if (employers.total === 0) {
            return { 
                error: 'No employer account found with this email address' 
            };
        }

        // Create password recovery (this sends OTP via email)
        await account.createRecovery(
            email,
            `${process.env.NEXT_PUBLIC_URL}/reset-password` // This URL won't be used since we handle OTP verification ourselves
        );

        return {
            success: true,
            message: 'OTP sent successfully'
        };

    } catch (error) {
        console.error('Send OTP Error:', error);
        
        // Handle specific Appwrite errors
        if (error.code === 429) {
            return { 
                error: 'Too many requests. Please wait before requesting another code.' 
            };
        }
        
        return { 
            error: 'Failed to send OTP. Please try again.' 
        };
    }
}

export default sendOTP;