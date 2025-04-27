# Auth.js Authentication with Google Sign-In and User Roles Demo

This project demonstrates how to implement authentication using Auth.js with Google Sign-In and user roles.
Made with nextjs, prisma, authjs

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

- Configure the Google OAuth Credentials [Link](https://youtu.be/1MTyCvS05V4?si=SrVl0rj56i4wfwAV&t=12273)

5. Run the application:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`.

## Implementation Details

- **Auth.js Usage:** The `lib/auth` and `hooks` have the necessary utilities for auth.
- **User Roles:** The user roles can be retrevied via `getCurrentRole` at `lib/auth` and `useCurrentRole` at `hooks`.
- **Role-Based Access Control:** Middleware or View component can be used to check user roles and restrict access to certain parts of the application.

## User Roles

This demo supports different user roles, such as:

- `admin`: Has full access to the application.
- `user`: Has limited access.

The user role can be changed by `admin` at _**`/settings/users`**_.
