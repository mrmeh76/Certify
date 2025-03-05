"use client";
import { useEffect, useState } from "react";
import { UserContext } from "./user-context";
import { getUserDataFromLogin } from "@/db/getions";
import { useWallet } from "@txnlab/use-wallet";
import { StudentAccount } from "@/types/student";
import { TeachingInstitution } from "@/types/teaching-institution";
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<StudentAccount | TeachingInstitution>();
  const { activeAddress } = useWallet();
  useEffect(() => {
    const getData = async () => {
      const userData = await getUserDataFromLogin(activeAddress!);
      setData(userData);
    };
    getData();
  }, [activeAddress]);

  return (
    <UserContext.Provider
      value={{
        data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
