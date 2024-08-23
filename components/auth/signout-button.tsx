"use client";
import React from 'react';
import { Button } from '../ui/button';
import { signOut } from 'next-auth/react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  className?:string;
}
const LogOut = async() => {
  await signOut();
}

const SignOutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Button
        variant={variant}
        className={className}
        ref={ref}
        {...props}
        onClick={() => LogOut()}
      />
    )
  }
)
SignOutButton.displayName = "SignOutButton"

export default SignOutButton;