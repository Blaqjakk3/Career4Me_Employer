'use server';
import { createAdminClient } from "../../config/appwrite";

async function completePasswordReset(previousState, formData) {
    const userId = formData.get('userId');
    const secret = formData.get('secret');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (!userId || !secret || !password || !confirmPassword) {
        return { 
            error: 'Please fill in all required fields' 
        };
    }

    if (password !== confirmPassword) {
        return { 
            error: 'Passwords do not match' 
        };
    }

    if (password.length < 8) {
        return { 
            error: 'Password must be at least 8 characters long' 
        };
    }

    const { account } = await createAdminClient();

    try {
        // Complete the password recovery using the userId, secret, and new password
        await account.updateRecovery(
            userId,
            secret,
            password,
            password
        );

        return {
            success: true,
            message: 'Password reset successfully'
        };

    } catch (error) {
        console.error('Password Reset Error:', error);
        
        // Handle specific Appwrite errors
        if (error.code === 401) {
            return { 
                error: 'Invalid or expired reset link. Please request a new one.' 
            };
        }
        
        if (error.code === 400) {
            return { 
                error: 'Invalid reset link format' 
            };
        }

        return { 
            error: 'Password reset failed. Please try again or request a new reset link.' 
        };
    }
}

export default completePasswordReset;