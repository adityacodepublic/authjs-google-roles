# Auth.js Authentication with Google Sign-In and User Roles Demo

This project demonstrates how to implement authentication using Auth.js with Google Sign-In and user roles.
Made with nextjs, prisma, authjs

## Prerequisites

- Node.js and npm installed
- Google Cloud project with OAuth 2.0 Client ID and Client Secret

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/adityacodepublic/authjs-google-roles.git
cd authjs-google-roles
```

2. Install dependencies:

```bash
npm install
npx auth secret
```

3. Configure environment variables:

- Create a `.env` file in the root directory.
- Add the following variables:

```
AUTH_GOOGLE_ID=<your_google_client_id>
AUTH_GOOGLE_SECRET=<your_google_client_secret>

DATABASE_URL=<database connection string>
DIRECT_URL=<db direct connection string>
```

4. Google OAuth Keys:

- Configure the Google OAuth Credentials [Link](https://authjs.dev/getting-started/authentication/oauth)

5. Run the application:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`.

## Implementation Details

- **Auth.js Configuration:** The `pages/api/auth/[...nextauth].js` file configures Auth.js with the Google Provider.
- **Google Sign-In:** Uses the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for authentication.
- **User Roles:** The `callbacks` option in `[...nextauth].js` is used to retrieve user roles from a database or other source during the session creation. The role is then added to the session object.
- **Role-Based Access Control:** Middleware or component logic can use the session data to check user roles and restrict access to certain parts of the application.

## User Roles

This demo supports different user roles, such as:

- `admin`: Has full access to the application.
- `user`: Has limited access.

The user role can be changed by admin at /settings/users.
