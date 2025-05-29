import BackButton from "@/components/back-button";
import { StudentSignUpForm } from "./_components/student-sign-up";
import { CardForm } from "@/components/card-form";
import DashboardTopBar from "@/components/topbar/page";
export default function StudentSignUpPage() {
  return (
    <>
    <DashboardTopBar />
    <div className="mb-5">
        <StudentSignUpForm />
    </div>
    </>
  );
}
