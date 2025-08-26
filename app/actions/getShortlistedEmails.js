"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { Query } from "node-appwrite";
import getTalentByTalentId from "./getTalentByTalentId";

async function getShortlistedEmails(jobId) {
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to get shortlisted emails'
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
                error: 'You can only get emails for your own jobs'
            }
        }

        // Get all shortlisted applications for this job
        const { documents: applications } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_APPLICATIONS,
            [
                Query.equal('jobId', jobId),
                Query.equal('status', 'shortlisted')
            ]
        );

        // Get talent details for each shortlisted application
        const shortlistedTalents = await Promise.all(
            applications.map(async (application) => {
                const talent = await getTalentByTalentId(application.talentId);
                console.log('Shortlisted talent search - talentId:', application.talentId, 'Found:', talent ? talent.fullname : 'No talent found');

                return talent ? {
                    email: talent.email,
                    fullname: talent.fullname,
                    applicationId: application.$id
                } : null;
            })
        );

        // Filter out null values
        const validTalents = shortlistedTalents.filter(talent => talent !== null);

        return {
            success: true,
            shortlistedTalents: validTalents,
            jobTitle: job.name
        };

    } catch (error) {
        console.log('Error fetching shortlisted emails:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to fetch shortlisted emails';
        return {
            error: errorMessage
        }
    }
}

export default getShortlistedEmails;
