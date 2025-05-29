// Update the NavBar component
"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { AppBar } from "./app-bar";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useInstitution } from "@/hooks/useInstitution";
import { UserIcon } from "lucide-react";
import { Landmark } from "lucide-react";
import { useWallet } from "@txnlab/use-wallet";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const { data: userData } = useUser();
  const { institution, loading } = useInstitution();
  const { activeAddress } = useWallet();
  const [isMounted, setIsMounted] = useState(false);
  
  const isDashboard = pathname.includes("/admin-dashboard") || 
                      pathname.includes("/user-profile");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="justify-between px-4 py-1 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        {/* Left Section - Only Certify Logo */}
        <div className="flex items-center">
          <Link href="/">
            <h2 className="text-2xl text-slate-800 font-semibold font-mono mr-2 ml-2">Certify</h2>
          </Link>
        </div>

        {/* Center Section - Only visible outside dashboard */}
        {!isDashboard && (
          <div className="flex flex-grow justify-center items-center">
            <Link href="/institution" passHref>
              <Button className="ml-4 gap-x-3" variant="outline">
                <Landmark />
                <span className="font-semibold">Institution Portal</span>
              </Button>
            </Link>
            <Link href="/user-profile" passHref>
              <Button className="ml-4 gap-x-3" variant="outline">
                <UserIcon />
                <span className="font-semibold">Student Portal</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Right Section - Institution Info & AppBar */}
        <div className="flex items-center space-x-4">
          {isDashboard && isMounted && !loading && (
            <div className={cn(
              "flex items-center space-x-3 px-3 py-1 rounded-full transition-all",
              institution ? "bg-blue-50" : "bg-gray-50"
            )}>
              {institution ? (
                <>
                  {institution.image_url && (
                    <div className="relative w-10 h-10">
                      <Image 
                        src={institution.image_url}
                        alt={institution.name}
                        fill
                        className="rounded-full object-cover border"
                      />
                    </div>
                  )}
                  <span className="font-medium">{institution.name}</span>
                  <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></div>
                </>
              ) : userData ? (
                <>
                  <span className="font-medium">{userData.name}</span>
                  <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse"></div>
                </>
              ) : null}
            </div>
          )}
          
          <AppBar />
        </div>
      </div>
    </div>
  );
}