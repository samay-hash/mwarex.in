"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { authAPI, getGoogleAuthUrl } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"creator" | "editor" | "admin">("creator");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      if (userType === "admin") {
        response = await authAPI.adminSignin({ email, password });
      } else {
        response = await authAPI.userSignin({ email, password });
      }
      setToken(response.data.token);
      setUserRole(userType);
      setUserData({ email });

      if (userType === "creator") {
        router.push("/dashboard/creator");
      } else if (userType === "editor") {
        router.push("/dashboard/editor");
      } else if (userType === "admin") {
        router.push("/dashboard/admin");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
        "Invalid credentials. Please try again."
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
          <h1 className="text-4xl font-semibold text-white mb-10">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Custom Input Styles to match the provided image */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-500 font-medium">Your email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a23] border border-zinc-800 rounded-lg h-12 px-4 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-white placeholder-zinc-600"
                placeholder="name@example.co"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-zinc-500 font-medium">Password</label>
                <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Forget password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a23] border border-zinc-800 rounded-lg h-12 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all text-white placeholder-zinc-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs py-2 px-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-600 text-white font-medium rounded-lg hover:from-zinc-600 hover:to-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 mt-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-32">
            Don't have an account? <Link href="/auth/signup" className="text-zinc-300 hover:text-white transition-colors">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration Section */}
      <div className="hidden lg:flex w-1/2 bg-[#050507] relative p-12 overflow-hidden items-center justify-center">
        {/* Background Decoration to match the image */}
        <div className="absolute inset-0">
          {/* Shooting Stars / Lines */}
          <div className="absolute left-1/4 top-0 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50" />
          <div className="absolute left-1/3 bottom-0 w-[1px] h-1/3 bg-gradient-to-t from-transparent via-zinc-800 to-transparent opacity-30" />
          <div className="absolute right-1/4 top-20 w-[1px] h-1/4 bg-gradient-to-b from-transparent via-zinc-700 to-transparent opacity-20" />

          {/* Tiny Stars/Particles */}
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

        {/* Central Planet/Orb Visual */}
        <div className="relative z-10 scale-90">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-white shadow-[0_0_80px_rgba(255,255,255,0.4)]" />

          {/* Secondary Smaller Moon/Orb */}
          <div className="absolute -top-12 -right-16 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 shadow-xl" />

          {/* Shooting star line */}
          <div className="absolute -left-12 top-0 w-[1px] h-[300px] bg-gradient-to-b from-white/40 via-white/10 to-transparent transform -rotate-12" />
        </div>

        {/* App Name Branding */}
        <div className="absolute bottom-12 right-12 flex items-center gap-2">
          <span className="text-white text-lg font-bold tracking-tighter italic">MwareX</span>
        </div>
      </div>
    </main>
  );
}
