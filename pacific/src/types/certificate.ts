// src/types/certificate.ts
export class Certificate {
  constructor(
    public course_name: string,
    public university_name: string,
    public student_name: string,
    public student_reg_number: string,
    public certificate_serial_number: string,
    public certificate_image_url: string,
    public issue_date: string, // Add this field
    public transaction_hash?: string
  ) {}
}