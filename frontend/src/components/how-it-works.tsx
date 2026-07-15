"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { UserPlus, Users, Upload, Youtube, CheckCircle, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

const workflowSteps = [
    {
        step: 1,
        title: "Upload Footage",
        description: "Drop 10GB+ raw files directly into your workspace. No Google Drive links.",
        icon: Upload,
    },
    {
        step: 2,
        title: "AI Analysis",
        description: "AI identifies mistakes, silences, and cinematic B-roll automatically.",
        icon: UserPlus,
        badge: "Gemini"
    },
    {
        step: 3,
        title: "Autonomous Edit",
        description: "Instantly cuts and stitches the video. Days of editing done in minutes.",
        icon: Users,
    },
    {
        step: 4,
        title: "AI Chat Assistant",
        description: "Review the cut and chat with your timeline for pacing changes.",
        icon: CheckCircle,
    },
    {
        step: 5,
        title: "One-Click Publish",
        description: "Approve and stream directly to YouTube, Instagram, X, and LinkedIn.",
        icon: Youtube,
    },
    {
        step: 6,
        title: "Global Tracking",
        description: "Track cross-platform views, engagement, and viral velocity in real-time.",
        icon: LineChart,
    },
];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={containerRef}
            className="py-32 relative bg-[#111111] overflow-hidden border-t border-white/5"
            id="workflow"
        >
            {/* Background Elements - Restored to Original */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <img 
                    src="/bg-images/10071.jpg" 
                    alt="Process Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 md:opacity-[0.15]"
                />
                <div className="absolute inset-0 bg-[#111111]/40 mix-blend-multiply" />
                
                <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111] opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-[#111111] opacity-90" />
                
                <div className="absolute top-1/4 right-[5%] w-[500px] h-[500px] bg-[#C8A97E]/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-[5%] w-[600px] h-[600px] bg-[#C8A97E]/[0.02] rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-24 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 text-[#C8A97E] text-[10px] font-bold tracking-[0.25em] mb-8 uppercase"
                    >
                        <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
                        How It Works
                        <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#ffffff] font-normal tracking-tight mb-8"
                    >
                        From Upload to <span className="italic text-[#C8A97E]">Published.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white/40 max-w-xl mx-auto text-[15px] font-light leading-relaxed"
                    >
                        A completely autonomous AI workflow that edits and publishes your content while you sleep.
                    </motion.p>
                </div>

                {/* 3x2 Grid Container */}
                <div className="relative">
                    
                    {/* Connecting Lines (Desktop Only) */}
                    <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
                        {/* Top Row horizontal line */}
                        <div className="absolute top-[35%] left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent border-dashed" />
                        {/* Bottom Row horizontal line */}
                        <div className="absolute top-[85%] left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent border-dashed" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16 relative z-10">
                        {workflowSteps.map((step, index) => {
                            // Arrow logic: don't show on last item of row (index 2 and 5)
                            const showArrow = (index !== 2 && index !== 5);

                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                                    className="relative flex flex-col group"
                                >
                                    {/* Glassmorphism Card */}
                                    <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] bg-[#111111]/60 backdrop-blur-md border border-white/5 p-6 md:p-8 transition-all duration-700 hover:bg-[#151515]/80 hover:border-[#C8A97E]/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(200,169,126,0.15)] flex flex-col">
                                        
                                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C8A97E]/10 rounded-full blur-[40px] transition-all duration-700 group-hover:bg-[#C8A97E]/20" />
                                        
                                        {/* Header Row: Icon + Phase */}
                                        <div className="relative z-10 flex items-center justify-between mb-6">
                                            <div className="shrink-0 w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-[#C8A97E]/40 group-hover:bg-[#C8A97E]/10 transition-all duration-500 shadow-inner">
                                                <step.icon className="w-5 h-5 text-white/40 group-hover:text-[#C8A97E] transition-colors duration-500" />
                                            </div>
                                            
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C8A97E]">
                                                    Phase 0{step.step}
                                                </span>
                                                {step.badge && (
                                                    <span className="mt-1.5 text-[8px] font-semibold text-black bg-[#C8A97E] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                                        {step.badge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex-1">
                                            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-[#C8A97E] transition-colors duration-500">
                                                {step.title}
                                            </h3>
                                            <p className="text-[13px] text-white/40 leading-[1.8] font-light">
                                                {step.description}
                                            </p>
                                        </div>
                                        
                                        {/* Watermark Number */}
                                        <div className="absolute -bottom-4 -right-2 text-[80px] font-serif font-bold text-white/[0.02] pointer-events-none select-none z-0 transition-all duration-700 group-hover:text-white/[0.04]">
                                            0{step.step}
                                        </div>
                                    </div>

                                    {/* Arrow connecting to next card (Desktop only) */}
                                    {showArrow && (
                                        <div className="hidden lg:flex absolute top-[35%] -right-10 z-20 w-8 items-center justify-center pointer-events-none">
                                            <div className="w-full h-px bg-gradient-to-r from-[#C8A97E]/50 to-[#C8A97E] relative">
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-[#C8A97E] rotate-45" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
