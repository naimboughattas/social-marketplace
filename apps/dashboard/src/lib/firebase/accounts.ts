import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { SocialAccount } from "../types";

export async function createAccount(
  data: Omit<SocialAccount, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const accountRef = await addDoc(collection(db, "socialAccounts"), {
    ...data,
    userId,
    createdAt: Timestamp.now(),
  });

  return accountRef.id;
}

export async function getAccounts(userId: string): Promise<SocialAccount[]> {
  const accounts = await fetch(
    `https://usable-fowl-engaged.ngrok-free.app/user/${userId}/accounts`,
    {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );
  return accounts.json();
}

export async function getAccount(accountId: string): Promise<SocialAccount[]> {
  const accounts = await fetch(
    `https://usable-fowl-engaged.ngrok-free.app/account/${accountId}`,
    {
      method: "get",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );
  return accounts.json();
}

export async function updateAccount(
  accountId: string,
  updates: Partial<SocialAccount>
): Promise<void> {
  await updateDoc(doc(db, "socialAccounts", accountId), updates);
}

export async function deleteAccount(accountId: string): Promise<void> {
  await deleteDoc(doc(db, "socialAccounts", accountId));
}

export async function startVerification(
  accountId: string,
  verificationCode: string
): Promise<void> {
  await updateDoc(doc(db, "socialAccounts", accountId), {
    verificationCode,
    verificationSent: true,
    verificationSentAt: Timestamp.now(),
  });
}

export async function confirmVerification(accountId: string): Promise<void> {
  await updateDoc(doc(db, "socialAccounts", accountId), {
    isVerified: true,
    verifiedAt: Timestamp.now(),
  });
}
