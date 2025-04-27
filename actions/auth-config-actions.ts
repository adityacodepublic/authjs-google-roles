import "server-only";

import prismadb from "@/lib/prismadb";
import getAuth from "@/lib/auth/get-auth";

import { signOutUser } from "./user-form-actions";

export const verifyApi = async (role?: string[]) => {
  const auth = await getAuth();

  // Invalid User
  if (auth.user.role === "invalid") {
    await signOutUser();
    return false;
  }

  // API Access
  if (role) {
    if (role.includes(auth.user.role)) {
      return true;
    } else return false;
  }

  return true;
};

export const getUsers = async () => {
  try {
    const user = await prismadb.user.findMany();
    if (user === null) return false;
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });
    if (user === null) return false;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });
    if (user === null) return false;
    return user;
  } catch (error) {
    //console.log(error);
    return null;
  }
};

export async function fetchIpBlocklist(): Promise<string[]> {
  const url = `${process.env.BLOCKLIST_API_URL}/rpc/get_ip_blocklist`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apiKey: process.env.BLOCKLIST_API_KEY as string,
        "Accept-Profile": "blocklist",
      },
      next: {
        tags: ["blocklist", "ipBlocklist"],
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function SubmitIpData(ipData: string): Promise<number> {
  const url = `${process.env.BLOCKLIST_API_URL}/ipBlocklist`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: process.env.BLOCKLIST_API_KEY as string,
        "Content-Profile": "blocklist",
      },
      body: JSON.stringify({ ip: ipData }),
    });

    if (!response.ok) {
      throw new Error(`Error posting data: ${response.statusText}`);
    }
    console.log({ response: response.status });
    return response.status;
  } catch (error) {
    console.error("Post error:", error);
    throw error;
  }
}
