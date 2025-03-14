"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { AppBar } from "./app-bar";
import { UserIcon } from "lucide-react";
import { Landmark } from "lucide-react";
export default function NavBar() {
  return (
    <>
      <div className="w-full fixed top-0 left-0 right-0">
        <div className="justify-between px-4 py-1 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">

          {/* Left Section (CERTIFY and Logo) */}
          <div className="flex items-center">
            <Link href="/">
            <h2 className="text-2xl text-slate-0 font-semibold font-mono mr-2 ml-10">Certify</h2>
            </Link>
            {/* <Image
              src="/gold.png"
              width={30}
              height={30}
              alt="logo"
              className="focus:border-none active:border-none"
            /> */}
          </div>

          {/* Center Section (Menu Buttons) */}
          <div className="flex flex-grow justify-center items-center">
            <Link href="/" passHref>
              <Button className="gap-x-3" variant="outline">
                <span className="font-semibold">Home</span>
              </Button>
            </Link>

            <Link href="/user-profile" passHref>
              <Button className="ml-4 gap-x-3" variant="outline">
                <UserIcon />
                <span className="font-semibold">Student Portal</span>
              </Button>
            </Link>

            <Link href="/admin-dashboard" passHref>
              <Button className="ml-4 gap-x-3" variant="outline">
                <Landmark />
                <span className="font-semibold">Institution Portal</span>
              </Button>
            </Link>
          </div>

          {/* Right Section (AppBar) */}
          <div className="ml-4">
            <AppBar />
          </div>

        </div>
      </div>
    </>
  );
}
