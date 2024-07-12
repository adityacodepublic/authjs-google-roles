import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { getLoggedInStatus } from "@/lib/get-signin-status";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orders",
  description: "See orders",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log({loggedin: await getLoggedInStatus()});
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
