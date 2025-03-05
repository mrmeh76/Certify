
"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import DashboardTopBar from '@/components/topbar/page'
import { useWallet } from "@txnlab/use-wallet";
import algosdk from "algosdk";
import { toast } from "sonner";
import { assignCertificate } from "@/server-actions/creations";
import { transferNft } from '../../../../nft/transfer_certificate'
import { myCertificates } from '@/server-actions/creations'
const formSchema = z.object({
    wallet_address: z.string(),
})

type Schema = z.infer<typeof formSchema>;

function CreateStore() {
    const { activeAddress, signTransactions, sendTransactions } = useWallet();
    const [loading, setLoading] = useState(false)
    //const { toast } = useToast()
    //const session = useSession();
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema)
    })

    
console.log("this compoent")
    const onSubmit = async (values: Schema) => {
        setLoading(true)
        try {
            if (!activeAddress) {
                toast.error("please connect your wallet");
                return;
            }

            // send NFT
            const txn = await transferNft(activeAddress, values.wallet_address);
            const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
            const signedTxn = await signTransactions([encodedTransaction]);
            const waitRoundsToConfirm = 4;
            const result = await sendTransactions(signedTxn, waitRoundsToConfirm);
            console.log("result", result)
            //@ts-ignore
            //TODO: fix this LATER
            const asset_index = result["asset-index"] ?? 1;
            console.log(asset_index);
            const transaction_hash = result.txId;

            await myCertificates(values.wallet_address, asset_index);
            toast.success("NFT has been sent successfully");
            form.reset({
                wallet_address: "",
            });
        }
        catch (e) {
            toast.error("could not send NFT")
        }
        finally {
            setLoading(false)
        }

    }


    return (
        <>
            <DashboardTopBar />
            <div className="flex flex-col w-full h-full items-center  justify-center ">
                <div className="flex flex-row items-center justify-start w-full">
                </div>
                <div className="flex flex-col w-4/5  h-full items-center justify-center px-5 ">
                    <h3 className='text-xl font-semibold ' >
                        Send Certificate NFT to student
                    </h3>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full space-y-4' >
                            {/* wallet-address */}
                            <FormField
                                control={form.control}
                                name='wallet_address'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>
                                                Student&apos;s Wallet Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Wallet Address' type=" number" />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                            <FormControl    >
                                <Button type="submit" className=" my-2">
                                    Send NFT
                                </Button>
                            </FormControl>
                        </form>
                    </Form>
                </div>
            </div></>
    )

}

export default CreateStore;
