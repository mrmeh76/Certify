// pacific/src/app/(platform)/institution/page.tsx
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateInstitutionForm } from "./_components/institution-form";
import { InstitutionLoginForm } from "./_components/institution-login-form";
import DashboardTopBar from "@/components/topbar/page";
import { useWallet } from "@txnlab/use-wallet";

export default function InstitutionPortalPage() {
  const { activeAddress } = useWallet();

  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 pb-10 w-full">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="create">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your Institution</CardTitle>
              </CardHeader>
              <CardContent>
                <InstitutionLoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create a new Institution</CardTitle>
              </CardHeader>
              <CardContent>
                {activeAddress ? (
                  <CreateInstitutionForm />
                ) : (
                  <div className="text-center space-y-4">
                    <p>Please connect your wallet to create an institution</p>
                    <Button variant="outline" onClick={() => {/* Open wallet connect modal */}}>
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}