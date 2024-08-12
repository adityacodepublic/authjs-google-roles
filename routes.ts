export const publicRoutes = [""];

export const authRoutes = [
  "/signin",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_lOGIN_REDIRECT = "/orders";


const roleRoute = {
  superadmin: ["/"],
  manage:     ["/orders","stock","/inventory","migrateData","order"],
  stock:      ["/stock",]
}

