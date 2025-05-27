// src/app/(auth)/admin-dashboard/students/_components/columns.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { StudentAccount } from "@/types/student";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const columns: ColumnDef<StudentAccount>[] = [
  {
    accessorKey: "reg_number",
    header: "Registration Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "course_name",
    header: "Course",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="flex gap-2">
          <Link href={`/admin-dashboard/students/${student.reg_number}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
          <Link href={`/assign-certificate?student=${student.reg_number}`}>
            <Button size="sm">Assign Certificate</Button>
          </Link>
        </div>
      );
    },
  },
];