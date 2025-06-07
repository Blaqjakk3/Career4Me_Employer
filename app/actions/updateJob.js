"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { revalidatePath } from "next/cache";

async function updateJob(previousState, formData) {
    // Get databases instance
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to update a job'
            }
        }

        const jobId = formData.get('jobId');
        if (!jobId) {
            return {
                error: 'Job ID is required'
            }
        }

        // Get industry value - provide a default if not present
        const industry = formData.get('industry') || "Technology";

        // Update job
        const updatedJob = await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
            jobId,
            {
                name: formData.get('name'),
                description: formData.get('description'),
                relatedpaths: formData.getAll('relatedpaths'), // Array of strings
                location: formData.get('location'), // String
                applylink: formData.get('applylink'), // URL
                jobtype: formData.get('jobtype'), // String
                workenvironment: formData.get('workenvironment'), // String
                skills: formData.getAll('skills'), // Array of strings
                requiredDegrees: formData.getAll('requiredDegrees'), // Array of strings
                suggestedCertifications: formData.getAll('suggestedCertifications'), // Array of strings
                seniorityLevel: formData.get('seniorityLevel'), // String
                industry: industry, // String - ensure it's not empty
                responsibilities: formData.getAll('responsibilities'), // Array of strings
                // Note: We don't update dateofUpload, employer, numViews, or numClicks
            }
        );

        revalidatePath('/', 'layout');

        return {
            success: true
        }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'An unexpected error has occurred';
        return {
            error: errorMessage
        }
    }
}

export default updateJob;