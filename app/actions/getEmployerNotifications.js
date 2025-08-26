"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { Query } from "node-appwrite";

async function getEmployerNotifications() {
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to view notifications'
            }
        }

        // Get all notifications for the current employer, ordered by creation date (newest first)
        const { documents: notifications } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYER_NOTIFICATIONS,
            [
                Query.equal('employerId', user.id),
                Query.orderDesc('createdAt'),
                Query.limit(50) // Limit to last 50 notifications
            ]
        );

        return {
            success: true,
            notifications: notifications
        };

    } catch (error) {
        console.log('Error fetching employer notifications:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to fetch notifications';
        return {
            error: errorMessage
        }
    }
}

export default getEmployerNotifications;
