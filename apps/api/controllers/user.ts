import dotenv from "dotenv";
import { collection, where, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SocialAccount } from "../types";

dotenv.config();

export const getAccounts = async (userId: string): Promise<SocialAccount[]> => {
  try {
    const socialAccountsRef = collection(db, "socialAccounts");

    // Rechercher les documents où `userId` correspond
    const querySnapshot = await getDocs(
      query(socialAccountsRef, where("userId", "==", userId))
    );

    // Traiter chaque document de manière asynchrone
    const accounts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const docData = await doc.data();
        return {
          id: doc.id, // Inclure la ref du document
          ...docData,
        };
      })
    );
    return accounts;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};
