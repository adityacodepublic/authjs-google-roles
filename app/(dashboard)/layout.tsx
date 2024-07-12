import { getCurrentRole } from '@/lib/get-current-role';
import { SessionProvider } from 'next-auth/react';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const role = await getCurrentRole();
  //if(role == "null") redirect ("/");
  return (
    <>
    <SessionProvider>
      {children}
    </SessionProvider>
    </>
  );
};
