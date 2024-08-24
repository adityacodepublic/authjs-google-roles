import Navbar from '@/components/navbar';
import { getCurrentRole } from '@/lib/auth/get-current-role';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getCurrentRole();
  if(role?.toLowerCase() == "null") redirect ("/");
  return (
    <>
      <SessionProvider>
        <Navbar/>
        {children}
      </SessionProvider>
    </>
  );
};
