import { signIn } from "@/auth";
import { LoginForm } from "@/components/auth/auth-form/login-form";

const SignIn = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[#f6f6f6e0]">
      <div className="space-y-6 text-center">
        <LoginForm />
      </div>
    </main>
  );
};

export default SignIn;
