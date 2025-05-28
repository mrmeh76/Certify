import { UserProfile } from "./_components/user-profile";
import DashboardTopBar from "@/components/topbar/page";
import OptInButton from "./optin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function ProfilePage() {
  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col items-center justify-centet space-y-10 px-2 pb-[100px] w-11/12">
        <div className="flex flex-row items-center  w-full">
          <Link href="/student-wallet">
          <Button className="ml-4 gap-x-5 bg-blue-900 hover:bg-blue-950 mr-2" >
            <span className="font-semibold">Claim student account</span>
          </Button>
        </Link>
        <p className="mr-2">Or</p>
          <OptInButton /> <p className="ml-2 text-sm">If you already claimed an account</p> 
        </div>
        {/* Profile */}
        <UserProfile />
      </div>
    </>
  );
}

export default ProfilePage;
