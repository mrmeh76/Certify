"use client";
import React from "react";
import {
  WalletProvider,
  useInitializeProviders,
  PROVIDER_ID,
} from "@txnlab/use-wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import { DaffiWalletConnect } from "@daffiwallet/connect";

const queryclient = new QueryClient();

export default function CustomProvider({ children }: { children: React.ReactNode }) {
  const providers = useInitializeProviders({
    providers: [
      { 
        id: PROVIDER_ID.PERA, 
        clientStatic: PeraWalletConnect,
        clientOptions: { chainId: 416002 } // Testnet config
      },
      { 
        id: PROVIDER_ID.DEFLY, 
        clientStatic: DeflyWalletConnect 
      },
      { 
        id: PROVIDER_ID.DAFFI, 
        clientStatic: DaffiWalletConnect 
      },
    ],
  });

  return (
    <WalletProvider value={providers}>
      <QueryClientProvider client={queryclient}>
        {children}
      </QueryClientProvider>
    </WalletProvider>
  );
}