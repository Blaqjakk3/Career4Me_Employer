"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";


async function createJob(previousState, formData){
    //Get databases instances 
    const { databases } = await createAdminClient();

    try {
        const {user} = await checkAuth();

        if (!user){
            return{
              error: 'You must be logged in to create a job'
            }
        }

        // Get industry value - provide a default if not present
        const industry = formData.get('industry') || "Technology";
        
        // Handle expiry date - convert to ISO string if provided
        let expiryDate = null;
        const expiryDateInput = formData.get('expiryDate');
        if (expiryDateInput) {
            const expiry = new Date(expiryDateInput);
            // Validate that the expiry date is in the future
            if (expiry > new Date()) {
                expiryDate = expiry.toISOString();
            }
        }

        // Handle Quick Apply feature
        const allowCareer4MeApplications = formData.get('allowCareer4MeApplications') === 'on';
        const applylink = formData.get('applylink');

        // Validate application link requirement
        if (!allowCareer4MeApplications && !applylink) {
            return {
                error: 'Application link is required when Quick Apply is not enabled'
            }
        }

        // Create job
       const newJob = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
        ID.unique(),
        {
            employer: user.id,
            name: formData.get('name'),
            description: formData.get('description'),
            relatedpaths: formData.getAll('relatedpaths'), // Array of strings
            location: formData.get('location'), // String
            applylink: applylink || "", // URL - can be empty if Quick Apply is enabled
            jobtype: formData.get('jobtype'), // String
            workenvironment: formData.get('workenvironment'), // String
            skills: formData.getAll('skills'), // Array of strings
            requiredDegrees: formData.getAll('requiredDegrees'), // Array of strings
            suggestedCertifications: formData.getAll('suggestedCertifications'), // Array of strings
            seniorityLevel: formData.get('seniorityLevel'), // String
            industry: industry, // String - ensure it's not empty
            responsibilities: formData.getAll('responsibilities'), // Array of strings
            qualities: formData.getAll('qualities'), // Array of strings
            dateofUpload: new Date().toISOString(), // Automatically added date
            expiryDate: expiryDate, // Optional expiry date
            allowCareer4MeApplications: allowCareer4MeApplications // Quick Apply feature
        }
       );
       revalidatePath('/', 'layout');

       return{
        success: true
       }
    } catch (error) {
        console.log(error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'An unexpected error has occurred';
        return{
            error: errorMessage
        }
    }
}
export default createJob;