  "use server";

  import { createSessionClient } from "../../config/appwrite";
  import { redirect } from "next/navigation";
  import { cookies } from "next/headers";
  import { Query } from "node-appwrite";
  import { revalidatePath } from "next/cache";

  async function deleteJobs(jobId) {
    const sessionCookie = cookies().get('appwrite-session');
    if (!sessionCookie){
        redirect('/login');
    }
    try {
        const {account, databases} = await createSessionClient(sessionCookie.value);

        //Get employer's id
        const user = await account.get();
        const employerId = user.$id;

        //Get employer's posted Jobs
        const {documents: jobs} = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
            [Query.equal('employer', employerId)] 
        );

        //Find the job to delete
        const jobToDelete = jobs.find(job => job.$id === jobId);

        //Delete the job
        if (jobToDelete) {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
                jobId
            );

            revalidatePath('/jobs');
            
        return {
            success: true,
            message: 'Job deleted successfully',
        };
        } else {
            return {
                error: 'Job not found'
            }
        } 
    } catch (error) {
        console.log('Failed to delete your job', error);
        return {
            error: 'Failed to delete your job',
        }
        
    }
    
  }
  export default deleteJobs;

