"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductPreview() {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 text-[#C8A97E] text-[10px] font-bold tracking-[0.25em] mb-8 uppercase"
                    >
                        <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
                        System Architecture
                        <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#ffffff] font-normal leading-tight tracking-tight mb-8"
                    >
                        Built for <span className="italic text-[#C8A97E]">Scale & Security.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white/40 text-[15px] max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Every workspace runs in isolation with OAuth 2.0 authentication, role-based access, and encrypted cloud storage — so creators and editors collaborate without compromise.
                    </motion.p>
                </div>

                {/* 2x2 Grid - Sleek, Minimalist Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Card 1: Protected & Secure */}
                    <FeatureCard
                        title="Isolated Workspaces"
                        description="Every creator gets a private, sandboxed workspace. Video assets, drafts, and credentials are stored in encrypted cloud environments — no cross-tenant data leaks, ever."
                        delay={0.1}
                        index={0}
                    >
                        <Lock className="w-10 h-10 text-white/20 group-hover:text-[#C8A97E] transition-colors duration-500 mb-8" strokeWidth={1} />
                    </FeatureCard>

                    {/* Card 2: Regulated & Compliant */}
                    <FeatureCard
                        title="Role-Based Access Control"
                        description="Creators own the channel. Editors get scoped access — upload edits, leave comments, but never touch publish settings. OAuth 2.0 tokens ensure only authorized actions reach YouTube."
                        delay={0.2}
                        index={1}
                    >
                        <CheckCircle2 className="w-10 h-10 text-white/20 group-hover:text-[#C8A97E] transition-colors duration-500 mb-8" strokeWidth={1} />
                    </FeatureCard>

                    {/* Card 3: Cloud-Native Pipeline */}
                    <FeatureCard
                        title="Cloud-Native Pipeline"
                        description="Videos flow through a managed pipeline — raw upload, AI-assisted editing, creator review, one-click YouTube publish. All processed on cloud infrastructure, nothing runs on your device."
                        delay={0.3}
                        index={2}
                    >
                        <svg className="w-10 h-10 text-white/20 group-hover:text-[#C8A97E] transition-colors duration-500 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                    </FeatureCard>

                    {/* Card 4: Real-Time Sync */}
                    <FeatureCard
                        title="Real-Time Sync"
                        description="Live room-based collaboration between creators and editors. Instant notifications, comment threads on timelines, and status tracking — your team stays in sync, not in chaos."
                        delay={0.4}
                        index={3}
                    >
                        <Headphones className="w-10 h-10 text-white/20 group-hover:text-[#C8A97E] transition-colors duration-500 mb-8" strokeWidth={1} />
                    </FeatureCard>

                </div>
            </div>
        </section>
    );
}

function FeatureCard({ title, description, children, delay = 0, className, index = 0 }: { title: string, description: string, children?: React.ReactNode, delay?: number, className?: string, index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden bg-[#111111]/40 border border-white/5 p-10 md:p-14 group transition-all duration-700",
                "hover:bg-[#151515] hover:border-[#C8A97E]/30",
                className
            )}
        >
            {/* Corner Decorative Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C8A97E]/0 group-hover:border-[#C8A97E]/40 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C8A97E]/0 group-hover:border-[#C8A97E]/40 transition-colors duration-700" />

            <div className="relative z-10 flex flex-col h-full">
                {children}

                <div className="mt-auto">
                    <h3 className="text-xl md:text-2xl font-serif text-[#ffffff] mb-4 tracking-wide group-hover:text-[#C8A97E] transition-colors duration-500">
                        {title}
                    </h3>
                    <p className="text-white/40 text-[13px] md:text-[14px] leading-[1.8] font-light group-hover:text-white/60 transition-colors duration-500">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
