"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem ,SelectValue} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createNft } from "../../../../nft/create_certificate";
import { z } from 'zod'
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


const formSchema = z.object({
    registrationNo: z.string(),
    coursename: z.string(),
    serial_number: z.string(),
    university_name: z.string(),
    student_name: z.string()
})

type Schema = z.infer<typeof formSchema>;

function CreateStore() {
    const { activeAddress, signTransactions, sendTransactions } = useWallet();
    const [fileURL, setFileURL] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState<StudentAccount | null>(null);
    const searchParams = useSearchParams();
    const { institution } = useInstitution();
    //const { toast } = useToast()
    //const session = useSession();
    
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

    const onSubmit = async (values: Schema) => {
        console.log("Values", values)
        setLoading(true)
        try {
            if (!activeAddress) {
                toast.error("please connect your wallet");
                return;
            }

            if (fileURL === "") {
                toast.error("please upload image");
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
            toast.success("certificate has been issued successfully");
            form.reset({
                registrationNo: "",
                coursename: "",
                serial_number: "",
                university_name: ""
            });
        }
        catch (e) {
            toast.error("could not assing certificate")
        }
        finally {
            setLoading(false)
        }

    }


    return (
        <>
            <DashboardTopBar />
            <div className="flex flex-col w-full h-full items-center  justify-center ">
                <div className="flex flex-col w-4/5  h-full items-center justify-center px-5 ">
                    <h3 className='text-xl font-semibold ' >
                        Assign Certificate
                    </h3>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full space-y-4' >
                            {/* Student Name */}
                            <FormField
                                control={form.control}
                                name='student_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                readOnly 
                                                className="text-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* University Name */}
                            <FormField
                                control={form.control}
                                name='university_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>University Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                readOnly 
                                                className="text-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Registration Number */}
                            <FormField
                                control={form.control}
                                name='registrationNo'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registration Number</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                readOnly 
                                                className="text-gray-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Course Name */}
                            <FormField
                                control={form.control}
                                name="coursename"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Name</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
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

                            {/* Serial number */}
                            <FormField
                                control={form.control}
                                name='serial_number'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Certificate&apos;s Serial Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Serial Number' type=" number" />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            {/* certificate pdf upload
                         <FormField
                            control={form.control}
                            name='certificate_url'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            The Certificate PDF/Image <i>(file should not exceed 4MB)</i>
                                        </FormLabel>
                                        <FormControl>

                                            <UploadDropzone
                             endpoint='imageUploader'
                                                onClientUploadComplete={(uploads) => {
                                                    const upload = uploads?.at(-1)

                                                    if (upload) {
                                                        field.onChange(upload.url)
                                                        toast({
                                                            title: "Success!",
                                                            description: "Successfully uploaded the file"
                                                        })
                                                    }
                                                }}
                                                onUploadError={(e) => {
                                                    toast({
                                                        variant: "destructive",
                                                        title: "!Oops",
                                                        description: "File should not exceed 4MB"
                                                    })
                                                }}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        /> */}

                            <div className="flex items-center gap-4">
                                <div>
                                    <p>Image:</p>
                                    <UploadButton
                                        className="ut-button:bg-primary"
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            setFileURL(res[0].url);
                                            toast.success("file uploaded");
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast.error(error.message);
                                        }}
                                    />
                                </div>
                                {fileURL && (
                                    <div className="mt-6">
                                        <div className="relative w-10 h-10 overflow-hidden border">
                                            <Image
                                                src={fileURL}
                                                alt="Uploaded preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-gray-400 mt-1">Preview</p>
                                    </div>
                                )}
                            </div>

                            <FormControl>
                                <Button type="submit" className="my-2" disabled={loading}>
                                    {loading ? "Processing..." : "Create"}
                                </Button>
                            </FormControl>
                        </form>
                    </Form>
                </div>
            </div></>
    )

}

export default CreateStore;
