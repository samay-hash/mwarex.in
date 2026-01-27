"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Briefcase,
  PenTool,
} from "lucide-react";
import { authAPI, getGoogleAuthUrl } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"creator" | "editor">("creator");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (userType === "creator") {
        const response = await authAPI.userSignup({ email, password, name });
        const signinResponse = await authAPI.userSignin({ email, password });
        setToken(signinResponse.data.token);
        setUserRole("creator");
        setUserData({ email, name, id: response.data.user?._id });
        router.push("/onboarding/pricing");
      } else {
        const response = await authAPI.editorSignup({ email, password });
        const signinResponse = await authAPI.userSignin({ email, password });
        setToken(signinResponse.data.token);
        setUserRole("editor");
        setUserData({ email, id: response.data.user?._id });
        router.push("/dashboard/editor");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
        "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-[#0d0d12] text-zinc-300 overflow-y-auto font-sans">
      {/* Left Side - Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24">
        <div className="max-w-[400px]">
          <h1 className="text-4xl font-semibold text-white mb-6">Sign up</h1>

          {/* Compact Role Select */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setUserType('creator')}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                userType === 'creator'
                  ? "bg-[#1a1a23] border-zinc-700 text-white"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Creator
            </button>
            <button
              type="button"
              onClick={() => setUserType('editor')}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                userType === 'editor'
                  ? "bg-[#1a1a23] border-zinc-700 text-white"
                  : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700"
              )}
            >
              <PenTool className="w-4 h-4" />
              Editor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === "creator" && (
              <div className="space-y-2">
                <label className="text-sm text-zinc-500 font-medium">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a1a23] border border-zinc-800 rounded-lg h-11 px-4 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-white placeholder-zinc-600"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-zinc-500 font-medium">Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a23] border border-zinc-800 rounded-lg h-11 px-4 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-white placeholder-zinc-600"
                placeholder="name@example.co"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-500 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a23] border border-zinc-800 rounded-lg h-11 px-4 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-white placeholder-zinc-600"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs py-1 px-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 text-white font-medium rounded-lg hover:from-zinc-600 hover:to-zinc-800 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign up"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d0d12] px-2 text-zinc-600">or</span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = getGoogleAuthUrl()}
            className="w-full h-11 bg-transparent border border-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-[#1a1a23] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-zinc-500 text-sm text-center mt-12">
            Already have an account? <Link href="/auth/signin" className="text-zinc-300 hover:text-white transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration Section */}
      <div className="hidden lg:flex w-1/2 bg-[#050507] relative p-12 overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-0 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50" />
          <div className="absolute left-1/3 bottom-0 w-[1px] h-1/3 bg-gradient-to-t from-transparent via-zinc-800 to-transparent opacity-30" />
          <div className="absolute right-1/4 top-20 w-[1px] h-1/4 bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-20" />

          {mounted && [...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 scale-90">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-white shadow-[0_0_80px_rgba(255,255,255,0.4)]" />
          <div className="absolute -top-12 -right-16 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 shadow-xl" />
          <div className="absolute -left-12 top-0 w-[1px] h-[300px] bg-gradient-to-b from-white/40 via-white/10 to-transparent transform -rotate-12" />
        </div>

        <div className="absolute bottom-12 right-12 flex items-center gap-2">
          <span className="text-white text-lg font-bold tracking-tighter italic">MwareX</span>
        </div>
      </div>
    </main>
  );
}
