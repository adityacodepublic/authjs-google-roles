import { getSignInStatus } from "@/lib/get-signin-status";

interface SignedInProps {
  children: React.ReactNode;
};

export const SignedIn = async({
  children,
}: SignedInProps) => {
  const status = await getSignInStatus();
  return (
    <div>
      {status ? children : null}
    </div>
  );
};