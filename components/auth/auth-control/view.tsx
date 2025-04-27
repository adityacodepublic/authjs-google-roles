import verifyUser from "@/lib/auth/get-auth";
import { signOutUser } from "@/actions/user-form-actions";
import { redirect } from "next/navigation";

interface SignedInProps {
  children: React.ReactNode;
  role: string[];
};

export const View = async({
  children,
  role
}: SignedInProps) => {
  const auth = await verifyUser();
  
  // Signout Invalid User;
  if(auth.user.role === 'invalid') {
    await signOutUser();
    return null;
  };

  // Page Access
  if(role.includes(auth.user.role)) {
    return (
      <>
        {children}
      </>
    );
  }
  else redirect('/orders');  // Data for all users
  
};