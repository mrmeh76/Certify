"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createNft } from "../../../../nft/create_certificate";
import { z } from 'zod'
import { Suspense } from 'react'
import DashboardTopBar from '@/components/topbar/page'
import { useWallet } from "@txnlab/use-wallet";
import { UploadButton } from "@/components/uploadthing/uploadthing";
import algosdk from "algosdk";
import { toast } from "sonner";
import { assignCertificate } from "@/server-actions/creations";
import { universityCourses } from '@/constants/courses';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getStudentByRegNumber } from '@/db/getions';
import { StudentAccount } from '@/types/student';
import { useInstitution } from '@/hooks/useInstitution';
import { Check, Eye, X, Upload, Trash2, Router } from "lucide-react";
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    registrationNo: z.string(),
    coursename: z.string(),
    serial_number: z.string(),
    university_name: z.string(),
    student_name: z.string()
})

type Schema = z.infer<typeof formSchema>;

function AssignCertificateWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>}>
      <CreateStore />
    </Suspense>
  )
}

function CreateStore() {
    const { activeAddress, signTransactions, sendTransactions } = useWallet();
    const [fileURL, setFileURL] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState<StudentAccount | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const { institution } = useInstitution();
    const router = useRouter();
    
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            registrationNo: searchParams.get('student') || '',
            university_name: institution?.name || '',
            student_name: '',
            coursename: '',
            serial_number: ''
        }
    })

    useEffect(() => {
        const fetchStudent = async () => {
            const regNumber = searchParams.get('student');
            if (regNumber) {
                try {
                    const studentData = await getStudentByRegNumber(regNumber);
                    setStudent(studentData);
                    form.setValue('registrationNo', studentData.reg_number);
                    form.setValue('student_name', studentData.name);
                    form.setValue('coursename', studentData.course_name);
                    form.setValue('university_name', institution?.name || '');
                } catch (error) {
                    toast.error('Failed to load student data');
                }
            }
        };
        
        if (institution?.name) {
            form.setValue('university_name', institution.name);
        }

        fetchStudent();
    }, [searchParams, institution, form]);

    const handleRemoveImage = () => {
        setFileURL("");
        setFileName("");
        setUploadProgress(0);
        setIsUploading(false);
        toast.success("Image removed successfully");
    };

    const onSubmit = async (values: Schema) => {
        console.log("Values", values)
        setLoading(true)
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
                name: values.serial_number,
                asset_url: fileURL,
            });
            const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
            const signedTxn = await signTransactions([encodedTransaction]);
            const waitRoundsToConfirm = 4;
            const result = await sendTransactions(signedTxn, waitRoundsToConfirm);

            //@ts-ignore
            const asset_index = result["asset-index"] ?? 1;
            const transaction_hash = result.txId;

            const data = {
                course_name: values.coursename,
                university_name: values.university_name,
                student_reg_number: values.registrationNo,
                certificate_serial_number: values.serial_number,
                certificate_image_url: fileURL,
                asset_index,
                transaction_hash,
            };
            await assignCertificate(data);
            toast.success("Certificate has been issued successfully");
            form.reset({
                registrationNo: "",
                coursename: "",
                serial_number: "",
                university_name: "",
                student_name: ""
            });
            setFileURL("");
            setFileName("");
            router.push('/admin-dashboard/students');
            
        }
        catch (e) {
            toast.error("Could not assign certificate")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DashboardTopBar />
            <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="max-w-4xl mx-auto p-6 rounded-xl shadow-md border border-blue-200 w-4/5 mb-5">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Assign Certificate</h2>
                        <p className="text-sm text-gray-600">Issue a certificate to the selected student</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* First Row - Student Name and University Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name='student_name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Student Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
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
                                    name='university_name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">University Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    readOnly 
                                                    className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-medium border-2 border-gray-300 cursor-not-allowed rounded-md h-9"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            {/* Second Row - Registration Number and Course Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name='registrationNo'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Registration Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
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
                                    name="coursename"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Course Name</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
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

                            {/* Third Row - Serial Number */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name='serial_number'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-medium text-sm">Certificate Serial Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="Enter serial number" 
                                                    type="text"
                                                    className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md transition-all duration-200 h-9"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-amber-600 text-xs">
                                                Enter a unique serial number for this certificate
                                            </FormDescription>
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
                                disabled={loading || isUploading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : isUploading ? "Uploading..." : "Assign Certificate"}
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
            </div>
        </>
    )
}

export default AssignCertificateWrapper;