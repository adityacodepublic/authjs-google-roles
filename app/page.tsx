import SignOutButton from "@/components/auth/signout-button";
import { Button } from "@/components/ui/button"
import { getCurrentRole } from "@/lib/get-current-role";
import { getSignInStatus } from "@/lib/get-signin-status";
import { redirect } from "next/navigation";


export const StartPage = async() => {
  const loggedin = await getSignInStatus();
  const role = await getCurrentRole();
  if(loggedin && (role?.toLowerCase() != "null")) redirect("/orders");
  return (
    <div className="relative flex items-center justify-center h-full w-full bg-slate-800">
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
      </div>
      <SignOutButton className="absolute top-5 right-6 rounded-2xl opacity-80 text-white text-opacity-100 hover:opacity-100">Sign Out</SignOutButton>
      <Button className='relative inline-flex h-12 overflow-hidden rounded-full p-[1.6px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4F84FF_0%,#F9FF8B_50%,#C08DFF_100%)]' />
        <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full px-8 py-1 text-lg font-semibold bg-[#ffffff55] text-gray-800 backdrop-blur-2xl'>
          Please wait while we assign you a role!
        </span>
      </Button>
    </div>
  )
}

export default StartPage;