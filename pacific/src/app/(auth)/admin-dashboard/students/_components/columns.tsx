// src/app/(auth)/admin-dashboard/students/_components/columns.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { StudentAccount } from "@/types/student";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<StudentAccount>[] = [
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          {student.image_url ? (
            <Image
              src={student.image_url}
              alt={student.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
      );
    },
  },
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