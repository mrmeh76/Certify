"use client"
import { Button } from "@/components/ui/button";
import { useWallet } from "@txnlab/use-wallet";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getInstitutionByWallet } from "@/db/getions";

export const InstitutionLoginForm = () => {
  const { activeAddress } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!activeAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      const institution = await getInstitutionByWallet(activeAddress);
      if (institution) {
        router.push(`/admin-dashboard`);
      } else {
        toast.error("No institution found with this wallet address");
      }
    } catch (error) {
      toast.error("Failed to verify institution");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect the wallet associated with your institution account to login.
      </p>
      
      <Button 
        className="w-full" 
        onClick={handleLogin}
        disabled={!activeAddress || loading}
      >
        {loading ? "Verifying..." : "Login with Wallet"}
      </Button>
      
      {!activeAddress && (
        <p className="text-sm text-red-500 text-center">
          Please connect your wallet first
        </p>
      )}
    </div>
  );
};