  "use server";

  import { createSessionClient } from "../../config/appwrite";
  import { redirect } from "next/navigation";
  import { cookies } from "next/headers";
  import { Query } from "node-appwrite";
  import { isJobExpired } from '../../lib/util';
  import deleteJobs from './deleteJob';

  async function getMyJobs() {
    const sessionCookie = cookies().get('appwrite-session');
    if (!sessionCookie){
        redirect('/login');
    }
    try {
        const {account, databases} = await createSessionClient(sessionCookie.value);

        //Get employer's id
        const user = await account.get();
        const employerId = user.$id;

        //Fet employer's posted Jobs
        const {documents: jobs} = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_JOBS,
            [Query.equal('employer', employerId)] 
        );

        const activeJobs = [];
        for (const job of jobs) {
            if (isJobExpired(job.expiryDate)) {
                await deleteJobs(job.$id);
            } else {
                activeJobs.push(job);
            }
        }

        return activeJobs;
    } catch (error) {
        console.log('Failed to get your jobs', error);
        redirect('/error');
        
    }
    
  }
  export default getMyJobs;

