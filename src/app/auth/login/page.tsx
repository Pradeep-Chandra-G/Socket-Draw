import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access your workspace
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
          Secure, real-time collaboration environment
        </div>
      </div>
    </div>
  );
}
