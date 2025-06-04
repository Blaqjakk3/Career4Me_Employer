'use client';
import { useRouter } from "next/navigation";
import destroySession from "../actions/destroySession";
import { toast } from "react-toastify";
import SettingsLayout from "./_layout";
const Settings = () => {
    return (
        
       <SettingsLayout>
        <div className="space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Settings</h1>
        </div>
       </SettingsLayout>
      
      );
}
 
export default Settings;