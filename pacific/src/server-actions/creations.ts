"use server";
import { collection, addDoc, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { isWalletUnique } from "./wallet-validation";
import { getStudentsForAUniversity } from "@/db/getions";

interface CreateTeachingInstitution {
  name: string;
  walletAddress: string;
  asset_index: number;
  transaction_hash: string;
  image_url: string;
}

export async function createTeachingInstitution(
  values: CreateTeachingInstitution
): Promise<void> {

  const isUnique = await isWalletUnique(values.walletAddress);
  if (!isUnique) {
    throw new Error("Wallet already registered");
  }

  const { name, walletAddress, asset_index, transaction_hash } = values;
  
  try {
    await setDoc(doc(db, "teaching-institution", name), {
      name,
      walletAddress,
      asset_index,
      transaction_hash,
      image_url: values.image_url
    });
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Create Teaching Institution";
  }
}

export async function createCourse(
  name: string,
  university: string
): Promise<void> {
  try {
    await addDoc(collection(db, "course"), {
      university,
      name,
    });
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Create Course";
  }
}

interface CreateStudentAccount {
  email: string;
  name: string;
  registrationNumber: string;
  universityName: string;
  courseName: string;
  asset_index: number;
  transaction_hash: string;
  image_url: string;
}

export async function createStudentAccount(
  values: CreateStudentAccount
): Promise<void> {

  try {
    const {
      email,
      name,
      registrationNumber,
      universityName,
      courseName,
      asset_index,
      transaction_hash,
      image_url
    } = values;
    const password = "someRandomBS";
    await setDoc(doc(db, "students", registrationNumber), {
      email,
      name,
      walletAddress: "",
      password,
      universityName,
      courseName,
      asset_index,
      transaction_hash,
      image_url
    });

    // Send user email with password
  } catch (err) {
    console.log("Error in creating student account",err);
    throw "Could Not Create Student Account";
  }
}

interface AssignCertificate {
  course_name: string,
  university_name: string,
  student_reg_number: string,
  certificate_serial_number: string,
  certificate_image_url: string,
  asset_index: number,
  transaction_hash: string,
}

export async function assignCertificate(
  values: AssignCertificate
): Promise<void> {
  try {
    const {
      course_name,
      university_name,
      student_reg_number,
      certificate_serial_number,
      certificate_image_url,
      asset_index,
      transaction_hash,
    } = values

    // First get student details
    const studentDoc = await getDoc(doc(db, "students", student_reg_number));
    const studentData = studentDoc.exists() ? studentDoc.data() : null;

    await addDoc(collection(db, "certificate"), {
      course_name,
      university_name,
      student_reg_number,
      certificate_serial_number,
      certificate_image_url,
      asset_index,
      transaction_hash,
      issue_date: new Date().toISOString(), // Add current timestamp
      student_name: studentData?.name || "Unknown",
    });
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Assign Certificate";
  }
}

interface AddStudentWalletToDB {
    registrationNumber: string;
    universityName: string;
    walletAddress: string;
}

export async function addStudentWalletToDB(
  values: AddStudentWalletToDB
): Promise<void> {
  const { walletAddress, registrationNumber, universityName } = values;

  const isUnique = await isWalletUnique(values.walletAddress);
  if (!isUnique) {
    throw new Error("Wallet already registered");
  }
  
  // 2. Verify student exists in the university
  const students = await getStudentsForAUniversity(universityName);
  const studentExists = students.some(
    student => student.reg_number === registrationNumber
  );
  
  if (!studentExists) {
    throw new Error("Student not found in the specified university");
  }
  
  try {
    await updateDoc(doc(db, "students", registrationNumber), {
      walletAddress,
    });
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not Add Student's Wallet";
  }
}
export async function myCertificates(
  receiver_address: string,
  assetIndex: number
) {
  try {
    await updateDoc(doc(db, "myCertificates", receiver_address), {
      assetIndex,
    });
  } catch (err) {
    console.log(err, "OOps");
    throw "Could Not insert transfered certificate";
  }
}
