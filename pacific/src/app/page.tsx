"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="flex flex-col w-full items-center justify-center gap-y-3">
        <h2 className="font-semibold text- font-mono ">Welcome to Certify</h2>
        <p className="text-green-600 font-"><i>Built to verify with transparency</i></p>
      </div>
      <div className="flex flex-row items-center justify-center space-x-10">
        <div className="flex flex-row items-center justify-center rounded-lg ring-1 ring-amber overflow-hidden transform rotate-12 ">
          <Image src="/gold.png" width={200} height={200} alt="over-network" />
        </div>
        <div className="flex flex-row items-end h-full">
          <XIcon />
        </div>
        <div className="flex flex-row items-center justify-center rounded-lg ring-1 ring-amber overflow-hidden transform -rotate-6">
          <Image src="/cert.jpg" width={300} height={200} alt="denv" />
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <p className="text-center font-mono mt-5">
          {"Verify academic certificates in a click. "}
        </p>
      </div>

      <div className=" w-full items-center justify-center gap-x-3">
      </div>
      <Link href="./verify-certificate">
        <Button className="gap-x-5 bg-black hover:bg-blue-950">
          <span className="font-semibold">
            Verify certificate
          </span>
        </Button>
      </Link>
    </main>
  );
}
