// src/app/(auth)/admin-dashboard/students/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import DashboardTopBar from "@/components/topbar/page";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useInstitution } from "@/hooks/useInstitution";
import { getStudentsForAUniversity } from "@/db/getions";
import { useEffect, useState } from "react";
import { StudentAccount } from "@/types/student";
import { toast } from "sonner";

export default function StudentsPage() {
  const { institution } = useInstitution();
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!institution?.name) return;
      
      try {
        setLoading(true);
        const data = await getStudentsForAUniversity(institution.name);
        setStudents(data);
      } catch (error) {
        toast.error("Failed to fetch students");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [institution?.name]);

  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col w-11/12 items-center pt-5 gap-y-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">Student Management</h1>
          <Link href="/sign-up">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Student
            </Button>
          </Link>
        </div>

        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading students...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={students} />
          )}
        </div>
      </div>
    </>
  );
}