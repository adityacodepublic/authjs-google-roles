"use client"
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SettingsPage = async() => {
    const router = useRouter();

    return (
    <div className="w-full h-full flex items-center justify-center">
      <CardWrapper headerLabel="Users" headerDescription="view users, edit user roles...">
        <div className="flex justify-center items-center space-y-4 py-4">
          <Button onClick={()=>{router.push("/settings/users")}} className="self-center">Users</Button>
        </div>
      </CardWrapper>
    </div>
    )
}

export default SettingsPage;
