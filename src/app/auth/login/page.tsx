import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { Layout } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Layout className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Whiteboard
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-slate-600 text-sm">
                Enter your credentials to access your workspace
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <Link
                href="/auth/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-3 text-center text-xs text-slate-500 border-t border-slate-100">
            Secure, real-time collaboration environment
          </div>
        </div>
      </div>
    </div>
  );
}
