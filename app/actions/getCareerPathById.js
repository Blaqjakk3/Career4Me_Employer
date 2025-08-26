"use server";

import { createAdminClient } from "../../config/appwrite";

const getCareerPathById = async (careerPathId) => {
  if (!careerPathId) {
    return null;
  }

  try {
    const { databases } = await createAdminClient();
    const careerPath = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      "careerPaths", // Assuming "careerPaths" is the collection ID
      careerPathId
    );
    return careerPath;
  } catch (error) {
    console.error(`Error fetching career path by ID ${careerPathId}:`, error);
    return null;
  }
};

export default getCareerPathById;
