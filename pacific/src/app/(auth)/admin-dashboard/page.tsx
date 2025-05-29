"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import DashboardTopBar from "@/components/topbar/page";
import { searchForCertificate } from "@/db/getions";
import {toast} from "sonner";
import CertificateDetails from "@/components/certificate-details";
import { useInstitution } from "@/hooks/useInstitution";
import { Certificate } from "@/types/certificate";

function AdminPage() {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const { institution } = useInstitution();

  const handleSearch = () => {
    setSearchLoading(true);
    if (search === undefined) {
      toast.error("Please insert serial number");
    }
    setSearchLoading(true);
    loadStoreData(search);
  };

  const loadStoreData = async (serial_number: string) => {
    try {
      const certificate = await searchForCertificate(serial_number, institution?.name);
      console.log(certificate);
      setCertificate(certificate);
      setSearch("");
    } catch (e) {
      // ignore
    }
    finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col w-11/12 items-center pt-5 gap-y-4">
      {/* <div>
      <Link href="/admin-dashboard/students" legacyBehavior>
          <Button className="mr-4">Manage Students</Button>
        </Link>
      <Link href="./send-nft" legacyBehavior>
          <Button className="mr-4">Send NFT</Button>
        </Link>
        <Link href="./create-course" legacyBehavior>
          <Button>Manage Courses</Button>
        </Link>
      </div> */}

      <h3 className="font-semibold text-xl w-full">
                Certificates issued by {institution?.name}
              </h3>
        <div className="flex flex-row w-full items-center justify-between gap-x-4">
          <div className="flex flex-row items-center justify-center gap-x-3 w-4/5 ">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your certificates by serial number"
            />
            <Button
              onClick={handleSearch}
              variant={"outline"}
            >
              <Search />
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full items-center gap-y-5">
          {certificate && <CertificateDetails certificate={certificate} />}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
