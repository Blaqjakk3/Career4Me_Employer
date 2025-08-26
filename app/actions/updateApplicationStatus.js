"use server"
import { createAdminClient } from "../../config/appwrite";
import checkAuth from './checkAuth';
import { ID } from "node-appwrite";

async function updateApplicationStatus(previousState, formData) {
    const { databases } = await createAdminClient();

    try {
        const { user } = await checkAuth();
        console.log('updateApplicationStatus: User authenticated:', user ? user.id : 'No user');

        if (!user) {
            return {
                error: 'You must be logged in to update application status'
            }
        }

        const applicationId = formData.get('applicationId');
        const newStatus = formData.get('status'); // 'shortlisted' or 'rejected'
        console.log('updateApplicationStatus: applicationId:', applicationId, 'newStatus:', newStatus);

        if (!applicationId || !newStatus) {
            return {
                error: 'Application ID and status are required'
            }
        }

        if (!['shortlisted', 'rejected'].includes(newStatus)) {
            return {
                error: 'Invalid status. Must be "shortlisted" or "rejected"'
            }
        }

        // Get the application to verify ownership and get details
        console.log('updateApplicationStatus: Fetching application:', applicationId);
        const application = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_APPLICATIONS,
            applicationId
        );
        console.log('updateApplicationStatus: Fetched application:', application.$id, 'employerId:', application.employerId);

        // Verify that the application belongs to a job owned by the current employer
        if (application.employerId !== user.id) {
            console.log('updateApplicationStatus: Ownership mismatch. Application employerId:', application.employerId, 'User ID:', user.id);
            return {
                error: 'You can only update applications for your own jobs'
            }
        }

        // Update the application status
        console.log('updateApplicationStatus: Updating document:', applicationId, 'with status:', newStatus);
        const updatedApplication = await databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_APPLICATIONS,
            applicationId,
            {
                status: newStatus,
                viewedByEmployer: true
            }
        );
        console.log('updateApplicationStatus: Document updated successfully:', updatedApplication.$id);

        // Create notification for the talent
        console.log('updateApplicationStatus: Creating talent notification...');
        await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TALENT_NOTIFICATIONS,
            ID.unique(),
            {
                talentId: application.talentId,
                type: 'application_status',
                title: newStatus === 'shortlisted' ? 'Application Shortlisted!' : 'Application Update',
                message: newStatus === 'shortlisted' 
                    ? 'Congratulations! You have been shortlisted for a position. The employer may contact you soon.'
                    : 'Thank you for your application. Unfortunately, you were not selected for this position.',
                isRead: false,
                relatedJobId: application.jobId,
                relatedApplicationId: applicationId,
                createdAt: new Date().toISOString()
            }
        );
        console.log('updateApplicationStatus: Talent notification created.');

        return {
            success: true,
            message: `Application ${newStatus} successfully`,
            application: updatedApplication
        };

    } catch (error) {
        console.log('Error updating application status:', error);
        const errorMessage = error.response && error.response.message ? error.response.message : 'Failed to update application status';
        return {
            error: errorMessage
        }
    }
}

export default updateApplicationStatus;
