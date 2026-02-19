"use client";

import { motion } from "framer-motion";
import { Shield, Zap, GitBranch, Globe, Lock, CheckCircle2, Headphones, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductPreview() {
    return (
        <section className="relative bg-background py-24 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
                    >
                        <span className="text-emerald-400 font-medium text-sm tracking-wide uppercase">System Architecture</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                    >
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Scale & Security</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Every workspace runs in isolation with OAuth 2.0 authentication, role-based access, and encrypted cloud storage — so creators and editors collaborate without compromise.
                    </motion.p>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                    {/* Card 1: Protected & Secure */}
                    <FeatureCard
                        title="Isolated Workspaces"
                        description="Every creator gets a private, sandboxed workspace. Video assets, drafts, and credentials are stored in encrypted cloud environments — no cross-tenant data leaks, ever."
                        delay={0.1}
                        direction="left"
                    >

                        {/* Abstract Visual: Lock & Shield */}
                        <div className="absolute top-8 right-8 pointer-events-none">
                            <div className="relative w-32 h-32">
                                <motion.div
                                    className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500">
                                        <Lock className="w-8 h-8 text-emerald-400" />
                                    </div>
                                </div>
                                {/* Floating elements */}
                                <motion.div
                                    className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full blur-[1px]"
                                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                />
                                <motion.div
                                    className="absolute bottom-2 left-2 w-2 h-2 bg-emerald-600 rounded-full blur-[1px]"
                                    animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Card 2: Regulated & Compliant */}
                    <FeatureCard
                        title="Role-Based Access Control"
                        description="Creators own the channel. Editors get scoped access — upload edits, leave comments, but never touch publish settings. OAuth 2.0 tokens ensure only authorized actions reach YouTube."
                        delay={0.2}
                        direction="right"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Abstract Visual: Compliance/Check */}
                        <div className="absolute top-8 right-8 pointer-events-none">
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Abstract UI Elements */}
                                    <div className="relative w-24 h-20">
                                        <motion.div
                                            className="absolute top-0 right-0 w-16 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm z-10"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 5, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-16 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm z-20 flex items-center justify-center"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Card 3: Professional Support */}
                    <FeatureCard
                        title="Cloud-Native Pipeline"
                        description="Videos flow through a managed pipeline — raw upload, AI-assisted editing, creator review, one-click YouTube publish. All processed on cloud infrastructure, nothing runs on your device."
                        delay={0.3}
                        direction="left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Abstract Visual: Connection/Support */}
                        <div className="absolute top-8 right-8 pointer-events-none">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute inset-0 border border-dashed border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                    <Headphones className="w-6 h-6 text-blue-400" />
                                </div>
                                {/* Orbiting dot */}
                                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#60A5FA]" />
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Card 4: Reliable Infrastructure */}
                    <FeatureCard
                        title="Real-Time Sync"
                        description="Live room-based collaboration between creators and editors. Instant notifications, comment threads on timelines, and status tracking — your team stays in sync, not in chaos."
                        delay={0.4}
                        direction="right"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Abstract Visual: Cubes/Server */}
                        <div className="absolute top-10 right-10 pointer-events-none">
                            <div className="relative w-24 h-24">
                                <motion.div
                                    className="absolute top-0 left-0 w-8 h-8 bg-violet-500/20 border border-violet-500/30 rounded-lg transform -skew-y-12"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.div
                                    className="absolute top-4 left-6 w-8 h-8 bg-violet-500/40 border border-violet-500/50 rounded-lg transform -skew-y-12 z-10"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                />
                                <motion.div
                                    className="absolute top-8 left-12 w-8 h-8 bg-violet-500/60 border border-violet-500/70 rounded-lg transform -skew-y-12 z-20 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                </div>
            </div>
        </section>
    );
}

function FeatureCard({ title, description, children, delay = 0, className, direction = "left" }: { title: string, description: string, children?: React.ReactNode, delay?: number, className?: string, direction?: "left" | "right" }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
            className={cn(
                "relative overflow-hidden rounded-[32px] bg-white/5 dark:bg-black/40 border border-black/5 dark:border-white/5 p-8 md:p-10 h-[320px] flex flex-col justify-end group transition-all duration-500 backdrop-blur-xl",
                "hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-20px_rgba(255,255,255,0.08)]",
                "hover:border-black/10 dark:hover:border-white/10",
                "cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]",
                className
            )}
        >
            {/* Soft Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px] pointer-events-none mix-blend-overlay" />

            {/* Visual Container */}
            <div className="absolute inset-0 pointer-events-none">
                {children}
            </div>

            {/* Texts */}
            <div className="relative z-10 max-w-[90%]">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
