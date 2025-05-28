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
  FormDescription,
} from "@/components/ui/form";
import { addStudentWalletToDB } from "@/server-actions/creations";
import { connectWalletSchema } from "@/validation/students";
import { useWallet } from "@txnlab/use-wallet";
import { getStudentsForAUniversity } from "@/db/getions";
import { isWalletUnique } from "@/server-actions/wallet-validation";
import { useRouter } from "next/navigation";

const ConnectWalletForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof connectWalletSchema>>({
    resolver: zodResolver(connectWalletSchema),
    defaultValues: {
      registrationNumber: "",
      universityName: "",
    },
  });
  const { activeAddress } = useWallet();

  const onSubmit = async (values: z.infer<typeof connectWalletSchema>) => {
    try {
      if (!activeAddress) {
        toast.error("Please connect your wallet");
        return;
      }

      const isUnique = await isWalletUnique(activeAddress);
      if (!isUnique) {
        toast.error("This wallet is already registered");
        return;
      }

      // Verify student exists in the specified university
      const students = await getStudentsForAUniversity(values.universityName);
      const studentExists = students.some(
        student => student.reg_number === values.registrationNumber
      );

      if (!studentExists) {
        toast.error("No student found with this registration number in the specified university");
        return;
      }

      const data = {
        registrationNumber: values.registrationNumber,
        universityName: values.universityName,
        walletAddress: activeAddress,
      };
      await addStudentWalletToDB(data);
      
      toast.success(" You have successfully claimed your account");
      router.push("/user-profile");
      form.reset({
        registrationNumber: "",
        universityName: "",
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your registration Number"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Don&apos;t put any slashes \</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your insitution name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export { ConnectWalletForm };
