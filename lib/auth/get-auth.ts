import "server-only";

import { auth } from "@/auth";
import { cache } from "react";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { RateLimiter } from "@/lib/services/rate-limiter";
import { fetchIpBlocklist, SubmitIpData } from "@/actions/auth-config-actions";

const rateLimiter = new RateLimiter({ windowSize: 10000, maxRequests: 10 });
const blockLimiter = new RateLimiter({ windowSize: 60000, maxRequests: 5 });

// export default cache(auth);

export default async () => {
  // get data
  const [Auth, header, blocklist] = await Promise.all([
    auth(),
    headers(),
    fetchIpBlocklist(),
  ]);

  // IP Block

  const ip =
    header.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    header.get("x-real-ip") ||
    "unknown";
  if (blocklist && blocklist.includes(ip)) {
    redirect("/error/too-many-requests");
  }

  // Rate limiting
  const isRateLimited = rateLimiter.limit(ip); // true when rate limit crossed
  if (isRateLimited) {
    const isBlocked = blockLimiter.limit(ip); // true when block limit crossed
    if (isBlocked) {
      await SubmitIpData(ip);
      revalidateTag("blocklist");
    }
    return redirect("/error/too-many-requests");
  }

  // SignIn
  if (Auth === null) redirect("/signin");

  return Auth;
};
