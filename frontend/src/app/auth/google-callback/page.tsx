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
        <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#050505]">
            {/* Ultra-Dark Backdrop with exquisite blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-[#050505] overflow-hidden"
            >
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-indigo-900/20 via-transparent to-transparent opacity-50 blur-[100px]" />
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm p-4"
            >
                {/* Central Premium Loader */}
                <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                    {/* Outer Glow Ring - Ambient */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-indigo-500/20 blur-3xl"
                    />

                    {/* Track Ring (Static Thin) */}
                    <div className="absolute inset-0 rounded-full border border-white/5" />

                    {/* Spinning Gradient Ring 1 */}
                    {status === "loading" && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-t border-r border-indigo-500/50"
                            style={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" }}
                        />
                    )}

                    {/* Spinning Gradient Ring 2 (Counter-Rotating) */}
                    {status === "loading" && (
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 rounded-full border-b border-l border-purple-500/50"
                        />
                    )}

                    {/* Success/Error Ring */}
                    {status === "success" && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                            className="absolute inset-0 rounded-full border-2 border-emerald-500/50"
                        />
                    )}
                    {status === "error" && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
                            className="absolute inset-0 rounded-full border-2 border-red-500/50"
                        />
                    )}

                    {/* Logo/Icon Container */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                        {status === "success" ? (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="text-emerald-400"
                            >
                                <CheckCircle className="w-8 h-8" />
                            </motion.div>
                        ) : status === "error" ? (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="text-red-400"
                            >
                                <AlertCircle className="w-8 h-8" />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <MWareXLogo showText={false} size="sm" />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Status Typography */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <motion.h2
                        key={status}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-light tracking-tight text-white"
                    >
                        {status === "loading" && (
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                finalizing_access
                            </span>
                        )}
                        {status === "success" && (
                            <span className="text-emerald-400 font-medium">Access Granted</span>
                        )}
                        {status === "error" && (
                            <span className="text-red-400">Access Denied</span>
                        )}
                    </motion.h2>

                    <div className="h-6 overflow-hidden">
                        <motion.p
                            key={message}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="text-sm font-mono text-white/40 tracking-wide uppercase"
                        >
                            {message}
                        </motion.p>
                    </div>
                </div>

                {/* Tech Elements / Decoration */}
                <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className={`w-full h-full opacity-50 ${status === "success" ? "bg-emerald-500" : status === "error" ? "bg-red-500" : "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"}`}
                    />
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em]">
                    <span>Secure</span> • <span>Encrypted</span> • <span>v2.4</span>
                </div>
            </motion.div>
        </main>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
