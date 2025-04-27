import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SignOutButton from "./auth/auth-control/signout-button";
import { getSignInStatus } from "@/lib/auth/get-signin-status";

export const Menu = async () => {
  const session = await getSignInStatus();
  return (
    <div>
      {session && (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-2xl" variant="ghost">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="px-5">
              <SignOutButton
                variant={"secondary"}
                className="mt-14 rounded-2xl p-2 md:p-5 w-full text-md font-semibold"
              >
                Sign Out
              </SignOutButton>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Menu;
