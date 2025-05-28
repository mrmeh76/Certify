"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";
import DashboardTopBar from "@/components/topbar/page";
import CertificateDetails from "@/components/certificate-details";
import { searchForCertificate } from "@/db/getions";
import { toast } from "sonner";
import { Certificate } from "@/types/certificate";

function VerifyCertificate() {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    serialNumber: "",
    universityName: ""
   });

  const handleSearch = async () => {
    if (!search.serialNumber) {
      toast.error("Please enter a serial number");
      return;
    }

  setLoading(true);
    try {
      const cert = await searchForCertificate(
        search.serialNumber,
        search.universityName
      );
      if (cert) {
        setCertificate(cert);
      } else {
        toast.error("Certificate not found");
        setCertificate(null);
      }
    } catch (error) {
      toast.error("Failed to verify certificate");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardTopBar />
      <div className="w-11/12 max-w-4xl mx-auto p-6 rounded-lg border shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            value={search.serialNumber}
            onChange={(e) =>
              setSearch({ ...search, serialNumber: e.target.value })
            }
            placeholder="Certificate serial number"
            className="flex-1"
          />
          <Input
            value={search.universityName}
            onChange={(e) =>
              setSearch({ ...search, universityName: e.target.value })
            }
            placeholder="University name (optional)"
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : <Search className="mr-2" />}
            Verify
          </Button>
        </div>

        {certificate && (
          <div className="mt-4">
            <CertificateDetails certificate={certificate} />
          </div>
        )}
      </div>
    </>
  );
}

export default VerifyCertificate;
