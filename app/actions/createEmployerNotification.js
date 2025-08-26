"use server"
import { createAdminClient } from "../../config/appwrite";
import { ID } from "node-appwrite";

async function createEmployerNotification(employerId, jobId, applicationId, jobTitle, talentName) {
    const { databases } = await createAdminClient();

    try {
        // Create notification for the employer
        const notification = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYER_NOTIFICATIONS,
            ID.unique(),
            {
                employerId: employerId,
                type: 'new_application',
                title: 'New Application Received',
                message: `${talentName} has applied for the position "${jobTitle}". Review their application and decide whether to shortlist or reject.`,
                isRead: false,
                relatedJobId: jobId,
                relatedApplicationId: applicationId,
                createdAt: new Date().toISOString()
            }
        );

        return {
            success: true,
            notification: notification
        };

    } catch (error) {
        console.log('Error creating employer notification:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to create notification';
        return {
            error: errorMessage
        }
    }
}

export default createEmployerNotification;
