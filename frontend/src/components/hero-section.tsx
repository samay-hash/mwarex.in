"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlurReveal } from "@/components/blur-reveal";
import { HeroVideo } from "@/components/hero-video";

export function HeroSection() {

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0">
            {/* Premium Net/Mesh Background - Optimized for performance */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Static Grid Pattern - Simplified mask for better mobile performance */}
                <div
                    className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99, 102, 241, 0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    }}
                />

                {/* Gradient Orbs - Reduced blur on mobile, enabled hardware acceleration */}
                <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-[40px] md:blur-[80px] translate-x-1/3 -translate-y-1/4" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
                <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-[30px] md:blur-[60px] -translate-x-1/4 translate-y-1/4" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
                {/* Central orb removed on mobile to save resources, added back on desktop */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Content */}
                    <div className="flex flex-col items-start text-left order-1 lg:order-1 relative z-30">
                        {/* Announcement Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/60 backdrop-blur-sm text-xs font-medium text-muted-foreground hover:bg-secondary/80 hover:border-primary/20 transition-all cursor-pointer group">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-foreground/90">New: YouTube API 2.0</span>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </motion.div>

                        {/* Main Heading with CinematicText */}
                        <div className="mb-6 max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]">
                                <BlurReveal
                                    text="Simplify your creator workflow"
                                    className="justify-start"
                                />
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="text-lg text-muted-foreground max-w-lg mb-8 leading-normal font-normal"
                        >
                            India’s First Scalable Web Platform designed to solve real-world creator and editor problems by connecting, managing, and simplifying the entire content workflow.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-4 mb-12"
                        >
                            <Link href="/auth/signup">
                                <div className="group relative px-8 py-3.5 bg-foreground text-white dark:text-black rounded-full font-medium text-base transition-all hover:bg-foreground/90 active:scale-95 shadow-lg shadow-foreground/10">
                                    <span className="relative flex items-center justify-center gap-2">
                                        Start Free Trial
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="flex items-center gap-4 text-sm text-muted-foreground"
                        >
                            <div className="flex -space-x-2">
                                {[
                                    'bg-gradient-to-br from-orange-400 to-orange-600',
                                    'bg-gradient-to-br from-slate-50 to-gray-200',
                                    'bg-gradient-to-br from-green-500 to-emerald-800',

                                ].map((gradient, i) => (
                                    <div
                                        key={i}
                                        className={`w-9 h-9 rounded-full border-2 border-background ${gradient} overflow-hidden`}
                                    />
                                ))}
                            </div>
                            <p>Trusted by <span className="text-foreground font-medium">Indian</span> Creators</p>
                        </motion.div>
                    </div>

                    {/* Right Column: Video Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="w-full relative z-20 order-2 lg:order-2 flex justify-center lg:justify-end"
                    >
                        {/* Wrapper to constrain size as requested ("small") */}
                        <div className="w-full max-w-lg lg:max-w-none xl:max-w-xl 2xl:max-w-2xl transform hover:scale-[1.02] transition-transform duration-500">
                            <HeroVideo />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
