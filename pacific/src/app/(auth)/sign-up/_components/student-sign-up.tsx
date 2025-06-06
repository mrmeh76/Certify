"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { createStudentAccount } from "@/server-actions/creations";
import { createStudentSchema } from "@/validation/students";
import { useWallet } from "@txnlab/use-wallet";
import React, { useState, useEffect } from "react";
import algosdk from "algosdk";
import { createNft } from "../../../../../nft/create_certificate";
import { UploadButton } from "@/components/uploadthing/uploadthing";
import { universityCourses } from "@/constants/courses";
import { useInstitution } from "@/hooks/useInstitution";
import { useRouter } from "next/navigation";
import { Check, Eye, X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

const StudentSignUpForm = () => {
  const { activeAddress, signTransactions, sendTransactions } = useWallet();
  const { institution, loading } = useInstitution();
  const [fileURL, setFileURL] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof createStudentSchema>>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      email: "",
      name: "",
      registrationNumber: "",
      universityName: institution?.name || "",
      courseName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createStudentSchema>) => {
    try {
      if (!activeAddress) {
        toast.error("Please connect your wallet");
        return;
      }

      if (fileURL === "") {
        toast.error("Please upload image");
        return;
      }

      // Create NFT
      const txn = await createNft({
        creator_address: activeAddress,
        name: values.registrationNumber,
        asset_url: fileURL,
      });
      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
      const signedTxn = await signTransactions([encodedTransaction]);
      const waitRoundsToConfirm = 4;
      const result = await sendTransactions(signedTxn, waitRoundsToConfirm);

      //@ts-ignore
      const asset_index = result["asset-index"] ?? 1;
      const transaction_hash = result.txId;

        // Improved error handling for transaction
      if (!result.txId) {
        throw new Error("NFT creation transaction failed");
      }

      let data = {
        email: values.email,
        name: values.name,
        registrationNumber: values.registrationNumber,
        universityName: values.universityName,
        courseName: values.courseName,
        asset_index,
        transaction_hash,
        image_url: fileURL,
      };

      await createStudentAccount(data);

      toast.success("Student account has been created successfully");
      router.push("/admin-dashboard/students");
      form.reset({
        email: "",
        name: "",
        registrationNumber: "",
        courseName: "",
        universityName: "",
      });
    } catch (error: any) {
      console.log("Account creation failed", error);
      // Handle specific error messages
    const errorMessage = typeof error === 'string' 
      ? error 
      : error?.message || "Unable to create the account";
      
    toast.error(errorMessage);
    }
  };

  const handleRemoveImage = () => {
    setFileURL("");
    setFileName("");
    setUploadProgress(0);
    setIsUploading(false);
    toast.success("Image removed successfully");
  };

  // Simulate upload progress 
  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  useEffect(() => {
    if (institution?.name) {
      form.setValue("universityName", institution.name);
    }
  }, [institution, form]);

  return (
    <div className="max-w-4xl mx-auto p-6  rounded-xl shadow-md border border-blue-200">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Student Account</h2>
        <p className="text-sm text-gray-600">Fill in the details to register a new student</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Row - Email and Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student email address"
                      className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter student full name" 
                      className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Second Row - University Name and Registration Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="universityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">University Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={institution?.name}
                      readOnly
                      className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-medium border-2 border-gray-300 cursor-not-allowed rounded-md h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">Registration Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter registration number"
                      className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-amber-600 text-xs">
                    Don&apos;t include any slashes / in the registration number
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Third Row - Course Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">Course Name</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {universityCourses.map((course, index) => (
                        <SelectItem key={index} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload Section */}
          <div className="mt-4">
            <h3 className="text-gray-700 font-medium text-sm mb-2">Certificate Image</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200">
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                {/* Upload Button or Progress */}
                <div className="flex-shrink-0">
                  {fileURL ? (
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-md border border-green-300">
                      <Check className="w-4 h-4" />
                      <span className="font-medium text-sm">Uploaded Successfully</span>
                    </div>
                  ) : isUploading ? (
                    <div className="flex flex-col items-center gap-2 bg-blue-50 text-blue-800 px-4 py-3 rounded-md border border-blue-300 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 animate-pulse" />
                        <span className="font-medium text-sm">Uploading...</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{uploadProgress}%</span>
                    </div>
                  ) : (
                    <UploadButton
                      className="ut-allowed-content:hidden ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:transition-all"
                      endpoint="imageUploader"
                      onUploadBegin={() => {
                        setIsUploading(true);
                        setUploadProgress(0);
                      }}
                      onUploadProgress={(progress) => {
                        setUploadProgress(progress);
                      }}
                      onClientUploadComplete={(res) => {
                        setFileURL(res[0].url);
                        setFileName(res[0].name);
                        setIsUploading(false);
                        toast.success("Image uploaded successfully!");
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        setUploadProgress(0);
                        toast.error(error.message);
                      }}
                      
                    />
                  )}
                </div>

                {/* Image Preview */}
                {fileURL && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-200 flex-grow">
                    <div 
                      className="relative w-14 h-14 border-2 border-gray-300 rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Image
                        src={fileURL}
                        alt="Uploaded certificate"
                        width={64}
                        height={64}
                        className="object-cover"
                        priority
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
                      <p className="text-xs text-gray-500">Click to view full size</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Create Student Account"}
          </Button>
        </form>
      </Form>

      {/* Image Modal */}
      {isImageModalOpen && fileURL && (
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
                src={fileURL}
                alt="Certificate - Full View"
                width={1200}
                height={900}
                quality={85} // Reduce quality for faster loading
                priority // Preload important images
                className="object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { StudentSignUpForm };