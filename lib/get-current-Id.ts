import { cache } from "react";
import getAuthSession from "./getAuthSession";

export const getCurrentId = async() => {
  const session = await getAuthSession();
  return session?.user.id;
};