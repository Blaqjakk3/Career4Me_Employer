"use client"
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import deleteJobs from "../app/actions/deleteJob";

const DeleteJobButton = ({jobId}) => {
    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this job?");
        if(confirmed){
            try {
                const response = await deleteJobs(jobId);
                toast.success('Room deleted successfully');
            } catch (error) {
                console.log('Failed to delete job', error);
                toast.error('Failed to delete job');
            }
        }
    };
    return (  
        <button onClick={handleDelete} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
               <Trash2 className="mr-2 h-4 w-4 text-white" />Delete
            </button>
    );
}
 
export default DeleteJobButton;