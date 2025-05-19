// src/server-actions/validations.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/db/firebase";

export async function isWalletUnique(walletAddress: string): Promise<boolean> {
  try {
    // Check institutions
    const instQuery = query(
      collection(db, "teaching-institution"),
      where("walletAddress", "==", walletAddress)
    );
    const instSnapshot = await getDocs(instQuery);

    // Check students
    const studentQuery = query(
      collection(db, "students"),
      where("walletAddress", "==", walletAddress)
    );
    const studentSnapshot = await getDocs(studentQuery);

    return instSnapshot.empty && studentSnapshot.empty;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}