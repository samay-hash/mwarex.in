"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Play,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { authAPI, getGoogleAuthUrl } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"creator" | "editor">("creator");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (userType === "creator") {
        const response = await authAPI.userSignup({ email, password, name });
        // Auto sign in after signup
        const signinResponse = await authAPI.userSignin({ email, password });
        setToken(signinResponse.data.token);
        setUserRole("creator");
        setUserData({ email, name, id: response.data.user?._id });
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

  return (
    <main className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center gap-3 mb-12"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <Play className="w-7 h-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-black text-white">
              Approval<span className="text-red-500">Hub</span>
            </span>
          </Link>

          {/* Card */}
          <div className="glass rounded-3xl p-10 shadow-2xl border border-white/10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-3">
                Create Account
              </h1>
              <p className="text-gray-400 text-lg">
                Join the professional video workflow
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="flex rounded-2xl bg-white/5 p-1.5 mb-8 border border-white/5">
              <button
                type="button"
                onClick={() => setUserType("creator")}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  userType === "creator"
                    ? "bg-red-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                I&apos;m a Creator
              </button>
              <button
                type="button"
                onClick={() => setUserType("editor")}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  userType === "editor"
                    ? "bg-red-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                I&apos;m an Editor
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {userType === "creator" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="input-field pl-14 h-14 text-lg"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-14 h-14 text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-14 pr-14 h-14 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-14 h-14 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-gray-600 bg-transparent"
                />
                <label className="text-sm text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-red-400 hover:text-red-300 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-sm font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Sign Up */}
            <a
              href={getGoogleAuthUrl()}
              className="w-full btn-secondary flex items-center justify-center gap-4 py-5 text-lg font-semibold rounded-2xl border-2 border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </a>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 text-sm mt-8">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - YouTube Branding */}
      <div className="flex-1 relative overflow-hidden">
        {/* YouTube Red Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-black/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* YouTube Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl mx-auto">
              <svg
                className="w-20 h-20 text-red-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">YouTube</h2>
            <p className="text-white/80 text-xl font-medium max-w-sm mx-auto leading-relaxed">
              Professional video approval made simple. Connect your creative
              workflow today.
            </p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-32 left-16 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm"
        />
      </div>
    </main>
  );
}
