"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../../config/appwrite";
import getCareerPathById from "./getCareerPathById";

const getTalentByTalentId = async (talentId) => {
  if (!talentId) return null;
  
  try {
    const { databases } = await createAdminClient();
    let talent = null;

    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TALENTS,
      [Query.equal("talentId", talentId)]
    );

    if (response.documents.length > 0) {
      talent = response.documents[0];
    } else {
      try {
        talent = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
          process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_TALENTS,
          talentId
        );
      } catch (e) {
        // Talent not found by talentId field or as document ID
        return null;
      }
    }

    if (talent && talent.selectedPath) {
      const careerPath = await getCareerPathById(talent.selectedPath);
      if (careerPath) {
        talent.selectedPathTitle = careerPath.title;
      }
    }

    return talent;

  } catch (error) {
    console.error(`Error fetching talent for talentId ${talentId}:`, error);
    return null;
  }
};

export default getTalentByTalentId;
