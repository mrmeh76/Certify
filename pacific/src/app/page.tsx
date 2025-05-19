"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowUp, Wallet, XIcon } from "lucide-react";
//import { signIn } from 'next-auth/react'
import Link from "next/link";
//import MyAlgoConnect from '@randlabs/myalgo-connect'
import { useState } from "react";
import { useRouter } from "next/navigation";
//import { LocalStorageKeys } from './helpers/local_storage_keys'
// import {AppContext} from './app-context'

import PageAssist from "./page_assist";
import Test from "./test";

export default function Home() {
  const router = useRouter();

  // let appContext = useContext(AppContext)

  async function connectWallet() {
    // const connector = new MyAlgoConnect;
    /* try {
      const accounts = await connector.connect();
      // appContext.set_user_address(accounts[0].address);
      const address = accounts[0].address;
      console.log(`Address is ${address}`);
      localStorage.setItem(LocalStorageKeys.USER_ADDRESS, address);
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }*/
  }
  const handleSignIn = async () => { };

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
          {/* <Link href={"https://github.com/poseidons-navy"} legacyBehavior>
            <strong className="cursor-pointer hover:underline">
              poseidon&apos;s navy
            </strong>
          </Link> */}
        </p>
      </div>

      <div className=" w-full items-center justify-center gap-x-3">
        {/* <Link href="/institution">
          <Button className="gap-x-3 bg-blue-900 hover:bg-blue-950">
            <span className="font-semibold">Create an institution account</span>
          </Button>
        </Link> */}

        {/* <Link href="/student-wallet">
          <Button className="ml-4 gap-x-5 bg-blue-900 hover:bg-blue-950" >
            <span className="font-semibold">Create a student account</span>
          </Button>
        </Link> */}
      </div>
      <Link href="./verify-certificate">
        <Button className="gap-x-5 bg-black hover:bg-blue-950" onClick={connectWallet}>
          <span className="font-semibold">
            Verify certificate
          </span>
        </Button>
      </Link>
    </main>
  );
}
