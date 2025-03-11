import { CardForm } from "@/components/card-form";
import { CreateInstitutionForm } from "./_components/institution-form";
import DashboardTopBar from "@/components/topbar/page";

export default function CreateInstitutionPage() {
  return (
    <>
    <DashboardTopBar />
    <div className="flex flex-col items-center justify-centet space-y-1 px-2 pb-[100px] w-11/12">
      <CardForm title="Create Institution"
        description="Enter the name of the institution and connect your wallet">
        <CreateInstitutionForm />
      </CardForm>
    </div>
    </>
  );
}
