import { getCurrentRole } from '@/lib/get-current-role';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getCurrentRole();
  if (role?.toLowerCase() !== "admin" && role?.toLowerCase() !== "stock") {redirect("/orders");}  
  return (
    <>
      <SessionProvider>
        {children}
      </SessionProvider>
    </>
  );
};
