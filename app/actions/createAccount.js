'use server';
import { createAdminClient } from "../../config/appwrite";
import { ID } from "node-appwrite"; 

async function createEmployer(previousState, formData) {
    const name = formData.get('name');
    const rawEmail = formData.get('email');
    const field = formData.get('field');
    const password = formData.get('password');

    // Basic input validation
    if (!name || !rawEmail || !field || !password) {
        return {
            error: 'Please fill in all fields'
        };
    }

    // Email validation and normalization
    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            error: 'Please provide a valid email address'
        };
    }

    if (password.length < 8) {
        return {
            error: 'Password must be at least 8 characters long'
        };
    }

    // Get all services from createAdminClient
    const { account, databases } = await createAdminClient();

    try {
        const userId = ID.unique();
        
        // Debug logging
        console.log('Creating account with:', { userId, email, name });
        
        // Create account
        const newAccount = await account.create(
            userId,
            email,
            password,
            name
        );
        
        if (!newAccount) throw new Error('Account creation failed');
       
        // Create the employer document
        const newEmployer = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYERS,
            ID.unique(),
            {
                employerId: userId,
                name,
                email,
                field,
            }
        );

        return {
            success: true,
            employer: newEmployer // Changed from newEmployer to employer for consistency
        };
    } catch (error) {
        console.error('Registration Error:', error);
        // Enhanced error logging
        if (error.response) {
            console.error('Appwrite Response:', error.response);
        }
        return {
            error: error.message || 'Error creating employer account'
        };
    }
}

export default createEmployer;