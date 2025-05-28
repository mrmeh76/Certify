import { CardForm } from "@/components/card-form";
import { ConnectWalletForm } from "./_components/wallet-form";
import DashboardTopBar from "@/components/topbar/page";

export default function ConnectWalletPage() {
  return (
    <>
    <DashboardTopBar />
    <div className="flex justify-center  h-full ">
      <CardForm
        title="Claim Student Account"
        description="Input your registration number and wallet address"
      >
        <ConnectWalletForm />
      </CardForm>
    </div>
    </>
  );
}
