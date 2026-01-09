import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-slate-500 text-sm">
              Start collaborating with your team today
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link
              href="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
