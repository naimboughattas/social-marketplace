import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

import * as Facebook from "./oauth/facebook";
import * as Instagram from "./oauth/instagram";
import * as Linkedin from "./oauth/linkedin";
import * as Tiktok from "./oauth/tiktok";
import * as X from "./oauth/x";
import * as Youtube from "./oauth/youtube";
import { getCachedData, setCachedData } from "../lib/redis";

const providers = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  tiktok: Tiktok,
  x: X,
  youtube: Youtube,
};

export const getAccounts = async (filters: any): Promise<any> => {
  let q = query(
    collection(db, "socialAccounts"),
    where("isActive", "==", true)
  );

  if (filters.platform) {
    q = query(q, where("platform", "==", filters.platform));
  }
  if (filters.category) {
    q = query(q, where("category", "==", filters.category));
  }
  if (filters.country) {
    q = query(q, where("country", "==", filters.country));
  }
  if (filters.language) {
    q = query(q, where("language", "==", filters.language));
  }
  if (filters.isVerified !== undefined) {
    q = query(q, where("isVerified", "==", filters.isVerified));
  }
  if (filters.services && filters.services.length > 0) {
    q = query(
      q,
      where("availableServices", "array-contains-any", filters.services)
    );
  }

  const snapshot = await getDocs(q);
  let influencers = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const accountData = getAccountById(doc.id);
      return {
        id: doc.id,
        ...doc.data(),
        ...accountData,
      };
    })
  );

  // Apply follower filters after fetching
  if (filters.minFollowers !== undefined) {
    influencers = influencers.filter(
      (inf) => inf.followers >= filters.minFollowers
    );
  }
  if (filters.maxFollowers !== undefined) {
    influencers = influencers.filter(
      (inf) => inf.followers <= filters.maxFollowers
    );
  }
  return influencers;
};

export const getAccountById = async (docId: string): Promise<any> => {
  try {
    // Créer une référence au document
    const docRef = await doc(db, "socialAccounts", docId);
    // Récupérer le document
    const docSnap = await getDoc(docRef);
    // Vérifier si le document existe
    if (docSnap.exists()) {
      const docData = await docSnap.data();
      // console.log("docData.id", docId);
      // const cachedData = await getCachedData(docId);
      // console.log("Cached Account:", cachedData);
      // if (cachedData && cachedData.expiresAt > Date.now())
      //   return cachedData.account;
      const platform = docData.platform as keyof typeof providers;
      const token = await providers[platform].refreshAccessToken(
        {
          id: docId,
          ...docData,
        },
        updateAccount
      );
      if (platform === "x") {
        // // Récupérer les informations du compte et les posts de manière asynchrone
        // const [accountInfo, accountPosts] = await X.getUserPage(token);

        // const account = {
        //   id: docSnap.id,
        //   ...docData,
        //   ...accountInfo,
        //   posts: accountPosts,
        // };

        // await setCachedData(docId, {
        //   account,
        //   expiresAt: Date.now() + 3600 * 1000, // 1 hour
        // });

        // // Retourner les données du document
        // return account;
        return {};
      } else {
        // Récupérer les informations du compte et les posts de manière asynchrone
        const [accountInfo, accountPosts] = await Promise.all([
          providers[platform].getUserInfo(token),
          providers[platform].getUserPosts(token),
        ]);

        const account = {
          id: docSnap.id,
          ...docData,
          ...accountInfo,
          posts: accountPosts,
        };

        await setCachedData(docId, {
          account,
          expiresAt: Date.now() + 3600 * 1000, // 1 hour
        });
        // Retourner les données du document
        return account;
      }
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

// update account
export const updateAccount = async (
  docId: string,
  updates: any
): Promise<any> => {
  try {
    const accountRef = await updateDoc(
      doc(db, "socialAccounts", docId),
      updates
    );
    return accountRef;
  } catch (error) {
    console.error("Error during update:", error);
    throw error;
  }
};
