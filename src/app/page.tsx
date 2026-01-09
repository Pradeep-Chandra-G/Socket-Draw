// src/app/page.tsx

import Link from "next/link";
import { Layout, Users, Pencil, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Whiteboard
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Collaborate in Real-Time
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Draw, design, and brainstorm together with your team. Create
            beautiful whiteboards and share them instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Creating Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-16 sm:mt-20">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Pencil className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Powerful Drawing Tools
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Pencil, shapes, arrows, text, and more. Everything you need to
              bring your ideas to life.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Real-Time Collaboration
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Work together with up to 5 team members simultaneously. See
              changes instantly.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Easy Sharing
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Share your whiteboards with a simple room code. Export to PNG or
              SVG anytime.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-sm sm:text-base text-gray-600">
          <p>
            © 2024 Whiteboard. Built with Next.js, Tailwind CSS & WebSockets.
          </p>
        </div>
      </footer>
    </div>
  );
}
