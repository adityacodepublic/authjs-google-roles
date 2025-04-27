import { getSignInStatus } from "@/lib/auth/get-signin-status";

interface SignedInProps {
  children: React.ReactNode;
};

export const SignedIn = async({
  children,
}: SignedInProps) => {
  const status = await getSignInStatus();
  return (
    <>
      {status ? children : null}
    </>
  );
};