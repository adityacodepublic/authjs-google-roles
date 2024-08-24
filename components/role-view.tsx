import { getCurrentRole } from "@/lib/auth/get-current-role";

interface SignedInProps {
  children: React.ReactNode;
  role:string
};

export const View = async({
  children,
  role
}: SignedInProps) => {
  const currentRole = await getCurrentRole();
  return (
    <div>
      {currentRole === role ? children : null}
    </div>
  );
};