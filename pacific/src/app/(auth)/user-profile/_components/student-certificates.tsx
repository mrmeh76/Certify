"use client";

import { getStudentCertificates } from "@/db/getions";
import { Certificate } from "@/types/certificate";
import Image from "next/image";
import { useEffect, useState } from "react";

export const StudentCertificates = ({ reg_no }: { reg_no: string }) => {
  const [certificates, setCertificates] = useState<Certificate[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentCertificates(reg_no);
      setCertificates(data);
    };
    fetchData();
  }, [reg_no]);

  return (
    <div>
      <h2>Certificates</h2>
      {certificates.length === 0 ? (
        <div className="text-xs text-center my-4  text-muted-foreground">
          No certificates to display
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-2">
          {
            certificates.map((certificate, index) => (<Image key={index} src={certificate.certificate_image_url} alt="certificate" ></Image>))
          }
        </div>
      )}
    </div>
  );
};
