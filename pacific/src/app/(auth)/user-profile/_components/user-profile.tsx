"use client";

import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getStudentCertificates } from "@/db/getions";
import { Certificate } from "@/types/certificate";
import { format } from "date-fns";

export const UserProfile = () => {
  const { data: userData } = useUser();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (userData && "reg_number" in userData) {
        try {
          setLoading(true);
          const certs = await getStudentCertificates(userData.reg_number);
          setCertificates(certs);
        } catch (error) {
          console.error("Failed to fetch certificates:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCertificates();
  }, [userData]);

  if (!userData || !("reg_number" in userData)) {
    return (
       <div className="text-center py-10">
        <p className="text-muted-foreground">
          No student account found. Claim your student account to view your profile.
        </p>
      </div>
    );
  }

  const student = userData;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              {student.image_url ? (
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200">
                  <Image
                    src={student.image_url}
                    alt={`${student.name}'s profile`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            
            {/* Student Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    type="text"
                    disabled
                    id="name"
                    value={student.name}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    disabled
                    id="email"
                    value={student.email}
                  />
                </div>
                
                <div>
                  <Label htmlFor="reg_number">Registration Number</Label>
                  <Input
                    type="text"
                    disabled
                    id="reg_number"
                    value={student.reg_number}
                  />
                </div>
                
                <div>
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    type="text"
                    disabled
                    id="walletAddress"
                    value={student.walletAddress || "Not connected"}
                  />
                </div>
                
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    type="text"
                    disabled
                    id="university"
                    value={student.university_name}
                  />
                </div>
                
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input
                    type="text"
                    disabled
                    id="course"
                    value={student.course_name}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">
              <p>Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                No certificates found. You haven&apos;t been issued any certificates yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div key={certificate.certificate_serial_number} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={certificate.certificate_image_url}
                      alt={`Certificate ${certificate.certificate_serial_number}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg">{certificate.course_name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Issued:</span>{" "}
                        {certificate.issue_date ? format(new Date(certificate.issue_date), 'MMM dd, yyyy') : 'Unknown date'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Serial:</span> {certificate.certificate_serial_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">University:</span> {certificate.university_name}
                      </p>
                    </div>
                    <Button size="sm" className="mt-3" asChild>
                      <a 
                        href={`https://algo.surf/transaction/${certificate.transaction_hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Verify on Blockchain
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
