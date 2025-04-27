import Image from "next/image";
import logo from "@/public/logo.svg";
import Menu from "./nav-menu";
import { SignedIn } from "@/components/auth/auth-control/signed-in";

const Navbar = async () => {
  return (
    <div className="border-b z-20 fixed w-full glass">
      <div className="flex h-12 items-center justify-between p-1 px-3">
        <div className="ml-0 mt-2 aspect-square">
          <Image
            src={logo}
            alt="logo"
            width={50}
            height={50}
            className="w-8 h-8"
          />
        </div>
        <SignedIn>
          <Menu />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
