"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
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

    // 3D Tilt Effect State
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

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

                {/* Single Page Layout: Left Phone -> Right Grid */}
                <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Mobile Image */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative order-2 lg:order-1">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative flex items-center justify-center cursor-grab active:cursor-grabbing w-full max-w-[360px]"
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                                perspective: 1200
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img 
                                src="/3dmob.png" 
                                alt="MWareX 3D Mobile App" 
                                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(200,169,126,0.15)]"
                                style={{ transform: "translateZ(50px)" }} // Pop out effect
                            />
                        </motion.div>
                    </div>

                    {/* Right Column: 6 Steps Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10 order-1 lg:order-2">
                        {workflowSteps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                                className="relative flex flex-col group h-full"
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-3xl bg-[#111111]/80 backdrop-blur-xl border border-white/5 p-6 transition-all duration-500 hover:bg-[#151515] hover:border-[#C8A97E]/30 hover:shadow-[0_10px_30px_-10px_rgba(200,169,126,0.15)] flex flex-col">
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C8A97E]/10 rounded-full blur-[40px] transition-all duration-500 group-hover:bg-[#C8A97E]/20" />
                                    
                                    <div className="relative z-10 flex items-center gap-4 mb-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-[#C8A97E]/40 group-hover:bg-[#C8A97E]/10 transition-all duration-500 shadow-inner">
                                            <step.icon className="w-5 h-5 text-white/40 group-hover:text-[#C8A97E] transition-colors duration-500" />
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C8A97E]">Phase 0{step.step}</span>
                                            {step.badge && (
                                                <span className="mt-0.5 text-[8px] font-bold text-black bg-[#C8A97E] px-2 py-0.5 rounded-sm uppercase tracking-wider">{step.badge}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex-1">
                                        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-[#C8A97E] transition-colors duration-500">{step.title}</h3>
                                        <p className="text-xs text-white/40 leading-[1.6] font-light">{step.description}</p>
                                    </div>
                                    
                                    <div className="absolute bottom-1 right-3 text-[60px] font-serif font-black text-white/[0.02] pointer-events-none select-none z-0 transition-all duration-500 group-hover:text-white/[0.04] group-hover:-translate-y-1">
                                        0{step.step}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
