"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardTopBar from "@/components/topbar/page";
import { getStudentByRegNumber } from "@/db/getions";
import { StudentAccount } from "@/types/student";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Student Image */}
              <div className="flex-shrink-0">
                {student.image_url ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                    <Image
                      src={student.image_url}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-48 h-48 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Student Details */}
              <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-4">{student.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="font-semibold text-gray-600">Registration Number</h2>
                    <p className="text-lg">{student.reg_number}</p>
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-600">Email</h2>
                    <p className="text-lg">{student.email}</p>
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-600">Course</h2>
                    <p className="text-lg">{student.course_name}</p>
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-gray-600">University</h2>
                    <p className="text-lg">{student.university_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}