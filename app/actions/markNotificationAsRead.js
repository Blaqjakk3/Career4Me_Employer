"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';

async function markNotificationAsRead(notificationId) {
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();

        if (!user) {
            return {
                error: 'You must be logged in to mark notifications as read'
            }
        }

        // Get the notification to verify ownership
        const notification = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYER_NOTIFICATIONS,
            notificationId
        );

        // Verify that the notification belongs to the current employer
        if (notification.employerId !== user.id) {
            return {
                error: 'You can only mark your own notifications as read'
            }
        }

        // Update the notification to mark as read
        const updatedNotification = await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EMPLOYER_NOTIFICATIONS,
            notificationId,
            {
                isRead: true
            }
        );

        return {
            success: true,
            notification: updatedNotification
        };

    } catch (error) {
        console.log('Error marking notification as read:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to mark notification as read';
        return {
            error: errorMessage
        }
    }
}

export default markNotificationAsRead;
