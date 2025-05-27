"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardTopBar from "@/components/topbar/page";
import { getStudentByRegNumber } from "@/db/getions";
import { StudentAccount } from "@/types/student";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentDetailsPage({
  params,
}: {
  params: { regNumber: string };
}) {
  const [student, setStudent] = useState<StudentAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        // You'll need to implement getStudentByRegNumber in getions.ts
        const data = await getStudentByRegNumber(params.regNumber);
        setStudent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [params.regNumber]);

  if (!student && !loading) {
    return notFound();
  }

  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col w-11/12 items-center pt-5 gap-y-4">
        <div className="flex justify-between items-center w-full">
          <Link href="/admin-dashboard/students">
            <Button variant="outline">Back to Students</Button>
          </Link>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : student ? (
          <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-semibold">Registration Number</h2>
                <p>{student.reg_number}</p>
              </div>
              <div>
                <h2 className="font-semibold">Course</h2>
                <p>{student.course_name}</p>
              </div>
              <div>
                <h2 className="font-semibold">University</h2>
                <p>{student.university_name}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}