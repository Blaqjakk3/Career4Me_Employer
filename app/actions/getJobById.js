"use server";

import { createSessionClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getJobById(jobId) {
    const sessionCookie = cookies().get('appwrite-session');
    if (!sessionCookie) {
        redirect('/login');
    }

    try {
        const { account, databases } = await createSessionClient(sessionCookie.value);

        // Get current user
        const user = await account.get();
        const employerId = user.$id;

        // Fetch the specific job
        const job = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
            jobId
        );

        // Check if the current user is the owner of this job
        if (job.employer !== employerId) {
            redirect('/unauthorized');
        }

        return job;
    } catch (error) {
        console.log('Failed to get job', error);
        redirect('/error');
    }
}

export default getJobById;