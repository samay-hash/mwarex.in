"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";
import { BlurReveal } from "@/components/blur-reveal";

export function HeroSection() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleOpenDemo = () => {
        setIsVideoOpen(true);
    };

    const handleCloseDemo = () => {
        setIsVideoOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

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
                <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-[60px] md:blur-[120px] translate-x-1/3 -translate-y-1/4 will-change-transform" />
                <div className="absolute bottom-0 left-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-[50px] md:blur-[100px] -translate-x-1/4 translate-y-1/4 will-change-transform" />
                {/* Central orb removed on mobile to save resources, added back on desktop */}
                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full will-change-transform" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full z-10">
                {/* Centered Content */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Announcement Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/80 to-secondary/60 border border-border/50 backdrop-blur-md text-sm text-foreground hover:border-primary/30 transition-all cursor-pointer group">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="font-medium">New: YouTube API 2.0</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>

                    {/* Main Heading with BlurReveal */}
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                            <BlurReveal
                                text="Simplify your creator workflow"
                                className="inline-block"
                                delay={0.1}
                            />
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
                    >
                        The professional operating system for creators and editing teams. Align, approve, and publish faster—without the chaos.
                    </motion.p>

                    {/* CTA Buttons or Video Player */}
                    <AnimatePresence mode="wait">
                        {!isVideoOpen ? (
                            <motion.div
                                key="buttons"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col sm:flex-row items-center gap-4"
                            >
                                <Link href="/auth/signup">
                                    <div className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 overflow-hidden">
                                        <span className="relative flex items-center justify-center gap-2">
                                            Start Free Trial
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>

                                <button
                                    onClick={handleOpenDemo}
                                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-secondary/50 border border-border text-foreground font-semibold hover:bg-secondary hover:border-primary/30 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Play className="w-4 h-4 fill-primary text-primary ml-0.5" />
                                    </div>
                                    <span>Watch Demo</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-4xl relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-primary/20 mx-auto"
                            >
                                <button
                                    onClick={handleCloseDemo}
                                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    playsInline
                                >
                                    <source src="/assets/demo-video.mp4" type="video/mp4" />
                                    {/* Fallback to show error gracefully if video missing */}
                                    Your browser does not support the video tag.
                                </video>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Trust Badges - Only show when video is NOT open to reduce clutter */}
                    {!isVideoOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="mt-12 flex items-center gap-4 text-sm text-muted-foreground"
                        >
                            <div className="flex -space-x-2">
                                {[
                                    'bg-gradient-to-br from-violet-400 to-purple-600',
                                    'bg-gradient-to-br from-blue-400 to-cyan-600',
                                    'bg-gradient-to-br from-emerald-400 to-green-600',
                                    'bg-gradient-to-br from-orange-400 to-red-600',
                                ].map((gradient, i) => (
                                    <div
                                        key={i}
                                        className={`w-9 h-9 rounded-full border-2 border-background ${gradient} overflow-hidden`}
                                    />
                                ))}
                            </div>
                            <p>Trusted by <span className="text-foreground font-medium">10,000+</span> creators</p>
                        </motion.div>
                    )}

                </div>
            </div>
        </section>
    );
}
