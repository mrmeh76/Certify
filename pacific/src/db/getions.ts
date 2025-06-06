import { StudentAccount } from "@/types/student";
import { db } from "./firebase";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { TeachingInstitution } from "@/types/teaching-institution";
import { Certificate } from "@/types/certificate";

// Add to src/db/getions.ts
export async function getStudentByRegNumber(
  regNumber: string
): Promise<StudentAccount> {
  try {
    const docRef = doc(db, "students", regNumber);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Student not found");
    }

    return StudentAccount.fromFirebaseDocument(docSnap);
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Get Student Data";
  }
}

export async function getInstitutionByWallet(
  wallet_address: string
): Promise<TeachingInstitution | null> {
  try {
    const q = query(
      collection(db, "teaching-institution"),
      where("walletAddress", "==", wallet_address)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      console.log("No institution found with this wallet address");
      return null;
    } else {
      const institutionDoc = querySnapshot.docs[0];
      const institutionData = institutionDoc.data();

      return new TeachingInstitution(
        institutionDoc.id,
        institutionData.name,
        institutionData.image_url
      );
    }
  } catch (err) {
    console.error("Error fetching institution:", err);
    throw "Could not get institution data";
  }
}

export async function getUserDataFromLogin(
  wallet_address: string
): Promise<StudentAccount | TeachingInstitution> {
  try {
    const q = query(
      collection(db, "teaching-institution"),
      where("walletAddress", "==", wallet_address)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      console.log("Not In Teaching Institutions");
      const q2 = query(
        collection(db, "students"),
        where("walletAddress", "==", wallet_address)
      );
      const querySnapshot2 = await getDocs(q2);

      if (querySnapshot2.size === 0) {
        console.log("Not In Student Accounts");
        throw "Account With Wallet Does Not Exist";
      } else {
        return StudentAccount.fromFirebaseDocument(querySnapshot2.docs[0]);
      }
    } else {
      const institutionDoc = querySnapshot.docs[0];
      const institutionData = institutionDoc.data();

      return new TeachingInstitution(
        institutionDoc.id,
        institutionData.walletAddress,
        institutionData.image_url
      );
    }
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Get Student's Data";
  }
}

export async function getUniversityCertificates(
  university_name: string,
): Promise<Certificate[]> {
  try {
    const q = query(
      collection(db, "certificate"),
      where("university_name", "==", university_name),
    );
    const querySnapshot = await getDocs(q);

    let certificates: Certificate[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      certificates.push(
        new Certificate(
          data.course_name,
          data.university_name,
          data.student_name,
          data.student_reg_number,
          data.certificate_serial_number,
          data.certificate_image_url,
          data.issue_date,
          data.transaction_hash
        ),
      );
    });

    return certificates;
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Get University's Certificate";
  }
}

export async function getStudentCertificates(
  student_reg_number: string
): Promise<Certificate[]> {
  try {
    const q = query(
      collection(db, "certificate"),
      where("student_reg_number", "==", student_reg_number)
    );
    const querySnapshot = await getDocs(q);

    let certificates: Certificate[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      certificates.push(
        new Certificate(
          data.course_name,
          data.university_name,
          data.student_name,
          data.student_reg_number,
          data.certificate_serial_number,
          data.certificate_image_url,
          data.issue_date,
          data.transaction_hash
        )
      );
    });

    return certificates;
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Get Student's Certificate";
  }
}

export async function searchForCertificate(
  serial_number: string,
  university_name: string = ""
): Promise<Certificate | null> {
  try {
    // Debug: Log what we're searching for
    console.log(`Searching for cert: ${serial_number} from ${university_name}`);
    
    let q;
    if (university_name) {
      q = query(
        collection(db, "certificate"),
        where("certificate_serial_number", "==", serial_number),
        where("university_name", "==", university_name)
      );
    } else {
      q = query(
        collection(db, "certificate"),
        where("certificate_serial_number", "==", serial_number)
      );
    }

    const querySnapshot = await getDocs(q);
    
    // Debug: Log how many documents were found
    console.log(`Found ${querySnapshot.size} matching certificates`);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // Debug: Log the found certificate data
    console.log("Certificate data:", data);
    
    return new Certificate(
      data.course_name,
      data.university_name,
      data.student_name || "Unknown",
      data.student_reg_number,
      data.certificate_serial_number,
      data.certificate_image_url,
      data.issue_date,
      data.transaction_hash
    );
  } catch (err) {
    console.error("Certificate search error:", err);
    throw "Could not search for certificate";
  }
}

export async function getCourseNamesForUniversity(
  university_name: string
): Promise<string[]> {
  try {
    const q = query(
      collection(db, "course"),
      where("university", "==", university_name)
    );
    const querySnapshot = await getDocs(q);
    let course_names: string[] = [];

    querySnapshot.forEach((doc) => {
      course_names.push(doc.data().name);
    });

    return course_names;
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Get Courses";
  }
}

export async function getStudentsForAUniversity(
  university_name: string
): Promise<StudentAccount[]> {
  try {
    const q = query(
      collection(db, "students"),
      where("universityName", "==", university_name)
    );
    const querySnapshot = await getDocs(q);

    let students: StudentAccount[] = [];
    querySnapshot.forEach((doc) => {
      students.push(StudentAccount.fromFirebaseDocument(doc));
    });

    return students;
  } catch (err) {
    console.log(err, "OOps");
    throw `Could Not Get Students Of  institution${university_name}`;
  }
}
/**
 * Gets the asset index from firebase
 * @param serial_no number
 */
export async function getIndexFromDb(
  serial_no: string
): Promise<number | void> {
  if (!serial_no) {
    throw new Error("Serial number not provided");
  }
  try {
    console.log(
      "Get Index From DB: Serial Number",
      serial_no,
      typeof serial_no
    );
    const assetIndexQuery = query(
      collection(db, "certificate"),
      where("certificate_serial_number", "==", serial_no)
    );
    const assetSnapshot = await getDocs(assetIndexQuery);
    // const assetData = assetSnapshot.docs.map((doc) => doc.data());

    if (assetSnapshot.size === 0) {
      console.log("Result Empty");
      return;
    }

    let assetData: any[] = [];
    assetSnapshot.forEach((doc) => {
      assetData.push(doc.data());
    });
    console.log("Get Index From DB: Asset Data", assetData);
    return assetData[0].asset_index;
  } catch (e: any) {
    console.log(e, "OOps");
    throw new Error("Error occured during retrieving asset_index", e);
  }
}

/**
 * Get index from a registration number
 * @param reg_no string
 * @returns asset_index(number)
 */
export async function getIndexFromReg(reg_no: string): Promise<number | null> {
  if (!reg_no) {
    throw new Error("Serial number not provided");
  }
  try {
    const assetIndexQuery = query(
      collection(db, "certificate"),
      where("student_reg_number", "==", reg_no)
    );
    const assetSnapshot = await getDocs(assetIndexQuery);

    if (assetSnapshot.size === 0) {
      console.log("Student Does Not Have Account");
      return null;
    }

    const assetData = assetSnapshot.docs.map((doc) => doc.data());
    console.log(assetData, "Get Asset Index");
    return assetData[0].asset_index;
  } catch (e: any) {
    throw new Error("Error occured during retrieving asset_index", e);
  }
}
/**
 * Retrieves the registration number from the public key
 * @param active_address string
 * @returns reg_no(string)
 */
export async function getRegFromPubkey(
  active_address: string
): Promise<string | undefined> {
  if (!active_address) {
    throw new Error("Public key not provided");
  }
  try {
    console.log("Get Reg FROM PUBKEY", active_address);
    const assetIndexQuery = query(
      collection(db, "students"),
      where("walletAddress", "==", active_address)
    );
    const assetSnapshot = await getDocs(assetIndexQuery);

    if (assetSnapshot.size === 0) {
      return;
    }

    console.log(assetSnapshot.docs[0].id, "Student Reg Number");
    return assetSnapshot.docs[0].id;
  } catch (e: any) {
    throw new Error("Error occured during retrieving reg_no", e);
  }
}

export async function getIndexFromPubkey(
  receiver_address: string
): Promise<number> {
  try {
    const assetIndexQuery = query(
      collection(db, "myCertificates"),
      where("receiver_address", "==", receiver_address)
    );
    const assetSnapshot = await getDocs(assetIndexQuery);
    const assetData = assetSnapshot.docs.map((doc) => doc.data());
    console.log(assetData);
    return assetData[0].assetIndex;
  } catch (e: any) {
    throw new Error("Error occured during retrieving reg_no", e);
  }
}

export async function getTxIdFromSerial(serial_no: string): Promise<string>{
  try {
    const assetIndexQuery = query(
      collection(db, "certificate"),
      where("certificate_serial_number", "==", serial_no)
    );
    const assetSnapshot = await getDocs(assetIndexQuery);
    const assetData = assetSnapshot.docs.map((doc) => doc.data());
    if (assetData.length === 0) {
      throw new Error("No data found");
    }
    console.log(assetData);
    return assetData[0].transaction_hash;
  } catch (e: any) {
    throw new Error("Error occured during retrieving reg_no", e);
  }
}
