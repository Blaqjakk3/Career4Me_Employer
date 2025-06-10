"use server";

import { createSessionClient } from "../../config/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getTalents() {
  const sessionCookie = cookies().get('appwrite-session');
  if (!sessionCookie) {
    redirect('/login');
  }
  
  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Fetch all talents from the talents collection
    const { documents: talents } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TALENTS, // You'll need to add this env variable
      []
    );

    return talents;
  } catch (error) {
    console.log('Failed to get talents', error);
    return []; // Return empty array instead of redirecting to avoid breaking the analytics
  }
}

export default getTalents;