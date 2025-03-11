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
  const onSubmit = async (values: z.infer<typeof createInstitutionSchema>) => {
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
        name: values.name,
        asset_url: fileURL,
      });
      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
      const signedTxn = await signTransactions([encodedTransaction]);
      const waitRoundsToConfirm = 4;
      const result = await sendTransactions(signedTxn, waitRoundsToConfirm);

      //@ts-ignore
      const asset_index = result.assetIndex || Number(result["asset-index"]) || 0;
      // console.log(`Asset ID created: ${assetIndex}`);
      if (!asset_index) throw new Error("Missing asset index");
      
      const transaction_hash = result.txId;
      if (!transaction_hash) throw new Error("Missing transaction hash");

      const data = {
        name: values.name,
        walletAddress: activeAddress,
        asset_index,
        transaction_hash,
      };
      await createTeachingInstitution(data);
      toast.success("the institution has been created successfully");
      form.reset({
        name: "",
        walletAddress: "",
      });
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to create institution"
      );
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Institution Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="flex  items-center">
            <Button type="submit" className=" my-2" disabled={pending}>
            {pending ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export { CreateInstitutionForm };
