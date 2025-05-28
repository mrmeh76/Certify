import { DocumentData } from "firebase/firestore";

export class StudentAccount {
    reg_number: string;
    university_name: string;
    course_name: string;
    name: string;
    email: string;
    image_url: string;
    walletAddress?: string;

    constructor(
        reg_number: string,
        university_name: string,
        course_name: string,
        name: string,
        email: string,
        image_url: string,
        walletAddress?: string
    ) {
        this.reg_number = reg_number;
        this.university_name = university_name;
        this.course_name = course_name;
        this.name = name;
        this.email = email;
        this.image_url = image_url;
        this.walletAddress = walletAddress;
    }

    static fromFirebaseDocument(doc: DocumentData): StudentAccount {
        const studentData = doc.data();
        return new StudentAccount(
            doc.id, 
            studentData.universityName,
            studentData.courseName,
            studentData.name,
            studentData.email,
            studentData.image_url,
            studentData.walletAddress
        );
    }
}