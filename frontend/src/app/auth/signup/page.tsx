"use client";

import { useState, useEffect } from "react";
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
import { MWareXLogo } from "@/components/mwarex-logo";

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
        // Skip payment page - go directly to dashboard
        router.push("/dashboard/creator");
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

  const userTypes = [
    { value: "creator" as const, label: "Creator", icon: Briefcase },
    { value: "editor" as const, label: "Editor", icon: PenTool },
  ];

  return (
    <main className="min-h-screen w-full flex bg-background text-foreground overflow-hidden font-sans">
      {/* Left Side - Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[420px] mx-auto w-full"
        >
          {/* Logo */}
          <div className="mb-8">
            <MWareXLogo showText={true} size="md" href="/" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">Join thousands of creators scaling their YouTube empire.</p>

          {/* User Type Selection */}
          <div className="flex gap-3 mb-8">
            {userTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUserType(type.value)}
                className={cn(
                  "flex-1 py-3.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2",
                  userType === type.value
                    ? "bg-gradient-to-b from-secondary to-muted border-border text-foreground shadow-lg"
                    : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                )}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input - Only for Creators */}
            {userType === "creator" && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder-muted-foreground"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder-muted-foreground"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder-muted-foreground"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm py-2 px-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 mt-6"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">or continue with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={() => window.location.href = getGoogleAuthUrl()}
            className="w-full h-12 bg-secondary hover:bg-muted text-foreground text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg border border-border"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-muted-foreground text-sm text-center mt-10">
            Already have an account? <Link href="/auth/signin" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Star/Space Illustration (Same as Sign In - Simplified) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 bg-card relative p-12 overflow-hidden items-center justify-center"
      >
        {/* Cosmic Background - Same as Sign In (Simplified) */}
        <div className="absolute inset-0">
          {/* Main Gradient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[80px]"
          />

          {/* Secondary Purple Glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-violet-600/20 to-transparent rounded-full blur-[60px]"
          />

          {/* Static Grid Lines */}
          <div className="absolute left-1/4 top-0 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent opacity-40" />
          <div className="absolute left-1/3 bottom-0 w-[1px] h-1/3 bg-gradient-to-t from-transparent via-zinc-700/50 to-transparent opacity-30" />
          <div className="absolute right-1/4 top-20 w-[1px] h-1/4 bg-gradient-to-b from-transparent via-zinc-600/50 to-transparent opacity-20" />

          {/* Twinkling Stars - Same as Sign In */}
          {mounted && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="absolute w-[2px] h-[2px] bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Central Planet/Orb Visual - Same as Sign In */}
        <div className="relative z-10">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 60px rgba(255,255,255,0.3), 0 0 80px rgba(129,140,248,0.2)",
                "0 0 80px rgba(255,255,255,0.5), 0 0 120px rgba(129,140,248,0.4)",
                "0 0 60px rgba(255,255,255,0.3), 0 0 80px rgba(129,140,248,0.2)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-white"
          />

          {/* Orbiting Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
          </motion.div>

          {/* Secondary Smaller Moon/Orb */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-14 -right-20 w-12 h-12 rounded-full bg-zinc-700 border border-zinc-600 shadow-xl"
          />
        </div>

        {/* App Name Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-12 right-12"
        >
          <MWareXLogo showText={true} size="md" />
        </motion.div>

        {/* Decorative Text */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-12 left-12"
        >
          <p className="text-zinc-400 text-sm font-medium">Start your journey</p>
          <p className="text-zinc-500 text-xs mt-1">Join 10,000+ creators today</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
