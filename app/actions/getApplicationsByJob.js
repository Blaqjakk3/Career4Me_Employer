"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { Query } from "node-appwrite";
import getTalentByTalentId from "./getTalentByTalentId";

async function getApplicationsByJob(jobId) {
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to view applications'
            }
        }

        // First verify that the job belongs to the current employer
        const job = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
            jobId
        );

        if (job.employer !== user.id) {
            return {
                error: 'You can only view applications for your own jobs'
            }
        }

        // Get all applications for this job
        const { documents: applications } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_APPLICATIONS,
            [Query.equal('jobId', jobId)]
        );

        // Get talent details for each application
        const applicationsWithTalents = await Promise.all(
            applications.map(async (application) => {
                const talent = await getTalentByTalentId(application.talentId);
                return {
                    ...application,
                    talent: talent
                };
            })
        );

        return {
            success: true,
            applications: applicationsWithTalents,
            job: job
        };

    } catch (error) {
        console.log('Error fetching applications:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to fetch applications';
        return {
            error: errorMessage
        }
    }
}

export default getApplicationsByJob;
