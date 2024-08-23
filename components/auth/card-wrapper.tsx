import logo from "@/public/logo.svg"
import Image from "next/image";

import { 
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from "../ui/card";
import { signOut } from "next-auth/react";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerDescription: string;
  ImageLabel?: string;
};

export const CardWrapper = ({
  children,
  headerLabel,
  ImageLabel,
  headerDescription
}: CardWrapperProps) => {

  const SignOut = async() => {
    await signOut();
  }
  return (
    <Card className=" p-8 w-[400px] shadow-md rounded-2xl">
      <div className="flex items-center flex-col justify-center w-full mt-1">
        <div className="pb-5 border-slate-400">
          <Image src={logo} alt="logo" width={50} height={50} className="w-24"/>
        </div>
        <span className="p-2">
          <h1 className="text-2xl font-extrabold pb-1 text-zinc-800">{headerLabel}</h1>
          <p className="text-sm font-medium text-slate-500">{headerDescription}</p>
        </span>
      </div>
      {children}
    </Card>
  );
};