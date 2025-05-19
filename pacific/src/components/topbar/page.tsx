"use client";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import React from "react";
import { useInstitution } from "@/hooks/useInstitution";
import { useRouter } from "next/navigation";
import BackButton from "../back-button";

function DashboardTopBar() {
  const router = useRouter();
  const { institution, loading } = useInstitution();

  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-between w-11/12 border-b-[1px] border-b-neutral-50 rounded-lg  px-4 py-3 bg-black text-white mt-16 mb-2",
      )}
    >
      <BackButton />
      <div className="ml-16 flex flex-row items-center justify-start w-full space-x-2">
        <span className="text-xl decoration-4 font-bold font-mono">
          {loading ? (
            <p>Loading...</p>
          ) : institution ? (
            <p>Welcome, {institution.name}</p>
          ) : (
            <p>Welcome to Certify</p>
          )}
        </span>
      </div>

      <div className="flex flex-row items-center justify-center cursor-pointer hover:bg-neutral-400 group p-2 rounded-full">
        <LogOut
          className="group-hover:text-neutral-100"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}

export default DashboardTopBar;
