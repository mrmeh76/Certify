import { UserProfile } from "./_components/user-profile";
import DashboardTopBar from "@/components/topbar/page";
import OptInButton from "./optin";

async function ProfilePage() {
  return (
    <>
      <DashboardTopBar />
      <div className="flex flex-col items-center justify-centet space-y-10 px-2 pb-[100px] w-11/12">
        <div className="flex flex-row items-center  w-full">
          <OptInButton /> <p>If you already have an account</p> 
          {/* <p>Or you can <link href="/user-profile">create a student account</link> if you don't have one</p> */}

        </div>
        {/* Profile */}
        <UserProfile />
      </div>
    </>
  );
}

export default ProfilePage;
