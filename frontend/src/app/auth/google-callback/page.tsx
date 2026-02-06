"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { MWareXLogo } from "@/components/mwarex-logo";

function GoogleCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Completing sign in...");

    // Get params from URL
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");
    const redirect = searchParams.get("redirect");
    const error = searchParams.get("error");

    useEffect(() => {
        const completeAuth = async () => {
            // Check for errors
            if (error) {
                setStatus("error");
                setMessage(`Authentication failed: ${error}`);
                setTimeout(() => {
                    router.push("/auth/signin?error=" + error);
                }, 2000);
                return;
            }

            // Check if we have the required data
            if (!token) {
                setStatus("error");
                setMessage("Authentication failed: No token received");
                setTimeout(() => {
                    router.push("/auth/signin?error=no_token");
                }, 2000);
                return;
            }

            try {
                // Store authentication data
                setToken(token);
                setUserRole((role as "creator" | "editor" | "admin") || "creator");
                setUserData({
                    email: email || "",
                    name: name || "",
                    id: userId || "",
                });

                setStatus("success");
                setMessage(`Welcome${name ? `, ${name}` : ""}! Redirecting to dashboard...`);

                // Redirect to dashboard
                setTimeout(() => {
                    const dashboardPath = redirect || (role === "editor" ? "/dashboard/editor" : "/dashboard/creator");
                    router.push(dashboardPath);
                }, 1500);
            } catch (err) {
                console.error("Auth completion error:", err);
                setStatus("error");
                setMessage("Failed to complete authentication");
                setTimeout(() => {
                    router.push("/auth/signin?error=auth_completion_failed");
                }, 2000);
            }
        };

        completeAuth();
    }, [token, email, name, role, userId, redirect, error, router]);

    return (
        <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
                }}
            />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="fixed top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/30 rounded-full blur-3xl"
            />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center text-center p-8"
            >
                {/* Logo */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: status === "success"
                            ? [
                                "0 0 40px rgba(34, 197, 94, 0.4)",
                                "0 0 60px rgba(34, 197, 94, 0.6)",
                                "0 0 40px rgba(34, 197, 94, 0.4)",
                            ]
                            : status === "error"
                                ? [
                                    "0 0 40px rgba(239, 68, 68, 0.4)",
                                    "0 0 60px rgba(239, 68, 68, 0.6)",
                                    "0 0 40px rgba(239, 68, 68, 0.4)",
                                ]
                                : [
                                    "0 0 40px rgba(99, 102, 241, 0.4)",
                                    "0 0 60px rgba(99, 102, 241, 0.6)",
                                    "0 0 40px rgba(99, 102, 241, 0.4)",
                                ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 ${status === "success"
                        ? "bg-gradient-to-br from-green-400 to-emerald-500"
                        : status === "error"
                            ? "bg-gradient-to-br from-red-400 to-rose-500"
                            : "bg-gradient-to-br from-indigo-400 to-violet-500"
                        }`}
                >
                    {status === "loading" && <MWareXLogo showText={false} size="md" />}
                    {status === "success" && <CheckCircle className="w-14 h-14 text-white" />}
                    {status === "error" && <AlertCircle className="w-14 h-14 text-white" />}
                </motion.div>

                {/* Status Title */}
                <motion.h1
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-3"
                >
                    {status === "loading" && "Signing you in..."}
                    {status === "success" && "Success!"}
                    {status === "error" && "Oops!"}
                </motion.h1>

                {/* Message */}
                <motion.p
                    key={message}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/70 text-lg mb-8 max-w-md"
                >
                    {message}
                </motion.p>

                {/* Loading Indicator */}
                {status === "loading" && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <Loader2 className="w-8 h-8 text-white/60" />
                    </motion.div>
                )}

                {/* Progress Dots for Loading */}
                {status === "loading" && (
                    <div className="flex gap-2 mt-6">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-2.5 h-2.5 rounded-full bg-white/50"
                            />
                        ))}
                    </div>
                )}

                {/* Google Badge */}
                <div className="mt-12 flex items-center gap-3 text-white/40 text-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Signed in with Google</span>
                </div>
            </motion.div>
        </main>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-indigo-900">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
