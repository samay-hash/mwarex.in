"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { Menu, X, Leaf, Snowflake, Sun, CloudRain, Wind, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useSeason, Season } from "@/contexts/SeasonContext";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { season, setSeason } = useSeason();

    const seasonsList = [
        { id: 'autumn', label: 'Autumn', icon: <Leaf className="w-5 h-5" />, color: "text-orange-500" },
        { id: 'winter', label: 'Winter', icon: <Snowflake className="w-5 h-5" />, color: "text-blue-400" },
        { id: 'summer', label: 'Summer', icon: <Sun className="w-5 h-5" />, color: "text-amber-500" },
        { id: 'rainy', label: 'Rainy', icon: <CloudRain className="w-5 h-5" />, color: "text-indigo-400" },
    ];

    const mobileSeasons = [
        { id: 'none', label: 'None', icon: <Wind className="w-5 h-5" />, color: "text-muted-foreground" },
        ...seasonsList
    ];

    const currentMobileSeason = mobileSeasons.find(s => s.id === season) || mobileSeasons[0];

    const handleMobileNext = () => {
        const currentIndex = mobileSeasons.findIndex(s => s.id === season);
        const nextIndex = (currentIndex + 1) % mobileSeasons.length;
        setSeason(mobileSeasons[nextIndex].id as Season);
    };

    const handleMobilePrev = () => {
        const currentIndex = mobileSeasons.findIndex(s => s.id === season);
        const prevIndex = (currentIndex - 1 + mobileSeasons.length) % mobileSeasons.length;
        setSeason(mobileSeasons[prevIndex].id as Season);
    };

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between pointer-events-none"
            >
                <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                    <Link href="/" className="z-50 hover:scale-105 transition-transform duration-300">
                        <MWareXLogo />
                    </Link>

                    {/* Mobile Season Selector - Centered Area */}
                    <div className="md:hidden flex-1 flex justify-center mx-2 z-50">
                        <div className="flex items-center justify-between gap-1.5 bg-black/40 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/10 shadow-lg w-[140px]">
                            <button
                                onClick={handleMobilePrev}
                                className="p-1 rounded-full hover:bg-white/10 text-muted-foreground transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1.5 overflow-hidden justify-center flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentMobileSeason.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className={cn("flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", currentMobileSeason.color)}
                                    >
                                        <span className="[&>svg]:w-3.5 [&>svg]:h-3.5 flex items-center justify-center">
                                            {currentMobileSeason.icon}
                                        </span>
                                        <span>{currentMobileSeason.label}</span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={handleMobileNext}
                                className="p-1 rounded-full hover:bg-white/10 text-muted-foreground transition-colors"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 bg-background/50 backdrop-blur-md px-8 py-3 rounded-full border border-border/40 shadow-sm">
                        <Link href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Workflow</Link>
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                        <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4 z-10">
                        <ThemeToggle />
                        <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Log in
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="group relative px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_20px_-5px_var(--color-primary)] hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden z-50 p-2 text-foreground"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center p-6 space-y-8"
                    >
                        <nav className="flex flex-col items-center gap-6 w-full">
                            <Link
                                href="#workflow"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Workflow
                            </Link>
                            <Link
                                href="#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Features
                            </Link>
                            <Link
                                href="#pricing"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Pricing
                            </Link>
                        </nav>

                        <div className="w-16 h-[1px] bg-border" />

                        <div className="flex flex-col items-center gap-6 w-full">
                            <div className="scale-125">
                                <ThemeToggle />
                            </div>

                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-muted-foreground hover:text-foreground"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/auth/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full max-w-xs text-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
