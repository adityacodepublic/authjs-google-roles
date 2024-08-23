import getAuthSession from "./getAuthSession";

export const getSignInStatus = async() => {
  const session = await getAuthSession();
  if(session) return true;
  return false;
}