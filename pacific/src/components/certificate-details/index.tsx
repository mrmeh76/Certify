"use client";
import Image from "next/image";
import { Certificate } from "@/types/certificate";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, X } from "lucide-react";
import { useState } from "react";

function CertificateDetails({ certificate }: { certificate: Certificate
}) {
  console.log("Full certificate object:", certificate);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
      {/* Centered Header */}
      <h2 className="text-2xl font-semibold text-center mb-4">Certificate Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Certificate Image with Blockchain Button */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] border rounded-md overflow-hidden group cursor-pointer">
            <Image
              src={certificate.certificate_image_url}
              alt="Certificate"
              fill
              className="object-cover"
            />
            {/* Eye Icon Overlay */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8" />
            </div>
          </div>
          
          {certificate.tx_hash && (
            <Button asChild variant="outline" className="w-full">
              <Link
                href={`https://algo.surf/transaction/${certificate.tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Blockchain Transaction
              </Link>
            </Button>
          )}
        </div>

        {/* Certificate Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Holder Name</h3>
              <p className="text-lg">{certificate.student_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
              <p className="text-lg">{certificate.student_reg_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Course</h3>
              <p className="text-lg">{certificate.course_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Institution</h3>
              <p className="text-lg">{certificate.university_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
              <p className="text-lg">{certificate.certificate_serial_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date Issued</h3>
              <p className="text-lg">
                {certificate.issue_date
                  ? format(new Date(certificate.issue_date), 'MMMM dd, yyyy')
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Full Resolution Image */}
            <div className="relative w-full h-full">
              <Image
                src={certificate.certificate_image_url}
                alt="Certificate - Full View"
                width={1200}
                height={900}
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateDetails;
