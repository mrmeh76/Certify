"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import { createTeachingInstitution } from "@/server-actions/creations";
import { createInstitutionSchema } from "@/validation/institution";
import { useWallet } from "@txnlab/use-wallet";
import { UploadButton } from "@/components/uploadthing/uploadthing";
import algosdk from "algosdk";
import { useFormStatus } from "react-dom";
import React, { useState } from "react";
import { createNft } from "../../../../../nft/create_certificate";
import { useRouter } from "next/navigation";
import { isWalletUnique } from "@/server-actions/wallet-validation";
import { Check, Eye, X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

const CreateInstitutionForm = () => {
  const form = useForm<z.infer<typeof createInstitutionSchema>>({
    resolver: zodResolver(createInstitutionSchema),
    defaultValues: {
      name: "",
      walletAddress: "",
    },
  });
  
  const { activeAddress, signTransactions, sendTransactions } = useWallet();
  const { pending } = useFormStatus();
  const [fileURL, setFileURL] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof createInstitutionSchema>) => {
    try {
      if (!activeAddress) {
        toast.error("Please connect your wallet");
        return;
      }

      const isUnique = await isWalletUnique(activeAddress);
      if (!isUnique) {
        toast.error("This wallet is already registered as a student or institution");
        return;
      }

      if (fileURL === "") {
        toast.error("Please upload institution logo");
        return;
      }

      // Create NFT
      const txn = await createNft({
        creator_address: activeAddress,
        name: values.name,
        asset_url: fileURL,
      });
      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
      const signedTxn = await signTransactions([encodedTransaction]);
      const waitRoundsToConfirm = 4;
      const result = await sendTransactions(signedTxn, waitRoundsToConfirm);

      //@ts-ignore
      const asset_index = result.assetIndex || Number(result["asset-index"]) || 0;
      if (!asset_index) throw new Error("Missing asset index");
      
      const transaction_hash = result.txId;
      if (!transaction_hash) throw new Error("Missing transaction hash");

      const data = {
        name: values.name,
        walletAddress: activeAddress,
        asset_index,
        transaction_hash,
        image_url: fileURL
      };
      
      await createTeachingInstitution(data);
      toast.success("Institution has been created successfully");
      router.push("/admin-dashboard");
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to create institution"
      );
    }
  };

  const handleRemoveImage = () => {
    setFileURL("");
    setFileName("");
    setUploadProgress(0);
    setIsUploading(false);
    toast.success("Logo removed successfully");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-md border border-blue-200">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Institution Account</h2>
        <p className="text-sm text-gray-600">Fill in the details to register your institution</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Institution Name */}
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-sm">Institution Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Institution Name"
                      className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Logo Upload Section */}
          <div className="mt-4">
            <h3 className="text-gray-700 font-medium text-sm mb-2">Institution Logo</h3>
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
                      className="ut-button:bg-blue-800 ut-button:hover:bg-blue-600"
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
                        toast.success("Logo uploaded successfully!");
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        setUploadProgress(0);
                        toast.error(error.message);
                      }}
                    />
                  )}
                </div>

                {/* Logo Preview */}
                {fileURL && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-200 flex-grow">
                     <div 
                      className="relative w-14 h-14 border-2 border-gray-300 rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group flex-shrink-0"
                      onClick={() => setIsImageModalOpen(true)}
                    >
                      <Image
                        src={fileURL}
                        alt="Institution logo"
                        fill
                        className="object-contain p-1" // Added padding and contain
                        priority
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
                      <p className="text-xs text-gray-500 truncate">Click to view full size</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200 flex-shrink-0"
                      title="Remove logo"
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
            disabled={pending || isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Creating..." : isUploading ? "Uploading..." : "Create Institution"}
          </Button>
        </form>
      </Form>

      {/* Logo Modal */}
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
            
            {/* Full Resolution Logo */}
            <div className="relative w-full h-full">
              <Image
                src={fileURL}
                alt="Institution Logo - Full View"
                width={1200}
                height={900}
                quality={85}
                priority
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

export { CreateInstitutionForm };