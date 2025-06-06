"use client";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import React from "react";
import { useInstitution } from "@/hooks/useInstitution";
import { useRouter } from "next/navigation";
import BackButton from "../back-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function DashboardTopBar() {
  const router = useRouter();
  const { institution, loading } = useInstitution();
  const pathname = usePathname();

  // Menu items for institution dashboard
  const menuItems = [
    { name: "Manage Students", href: "/admin-dashboard/students" },
    { name: "Send NFT", href: "/send-nft" },
    { name: "Manage Courses", href: "/create-course" },
  ];

  return (
    <div
      className={clsx(
        "flex flex-row items-center justify-between w-11/12 border-b-[1px] border-b-neutral-50 rounded-lg  px-4 py-3 bg-black text-white mt-16 mb-2",
      )}
    >
      <BackButton />

      {/* Navigation Menu */}
      <div className="flex items-center space-x-6">
        {institution && menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-green-300",
              pathname === item.href ? "text-white" : ""
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      {/* <div className="ml-16 flex flex-row items-center justify-start w-full space-x-2">
        <span className="text-xl decoration-4 font-bold font-mono">
          {loading ? (
            <p>Loading...</p>
          ) : institution ? (
            <p>Welcome, {institution.name}</p>
          ) : (
            <p>Welcome to Certify</p>
          )}
        </span>
      </div> */}

      <div className="flex flex-row items-center justify-center cursor-pointer hover:bg-gray-100 group p-2 rounded-full">
        <LogOut
          className="group-hover:text-gray-800 text-gray-400"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}

export default DashboardTopBar;
