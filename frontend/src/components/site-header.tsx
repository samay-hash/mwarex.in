"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { Menu, X, Snowflake, Sun, Moon, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useSeason } from "@/contexts/SeasonContext";
import { cn } from "@/lib/utils";

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { season, setSeason } = useSeason();
    const { isDark, toggleTheme } = useThemeToggle({ variant: "circle", start: "top-right" });

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



                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 bg-background/50 backdrop-blur-md px-6 py-3 rounded-full border border-border/40 shadow-sm">
                        <Link href="/#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Workflow</Link>
                        <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Features</Link>
                        <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Pricing</Link>
                        <Link href="/#wall-of-love" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 whitespace-nowrap">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Wall of Love</span>
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4 z-10">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border",
                                    isDark
                                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
                                        : "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]"
                                )}
                                title="Toggle Theme"
                            >
                                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setSeason(season === 'winter' ? 'none' : 'winter')}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border",
                                    season === 'winter'
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]"
                                        : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                                title="Toggle Snow"
                            >
                                <Snowflake className={cn("w-5 h-5", season === 'winter' && "animate-pulse")} />
                            </button>
                        </div>
                        <Link href="/auth/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]">
                            Log in
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="group relative px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_20px_-5px_var(--color-primary)] hover:scale-105 active:scale-95 cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden z-50 p-2 text-foreground pointer-events-auto"
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
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center p-6 space-y-8 pointer-events-auto"
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
                            <Link
                                href="/#wall-of-love"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Wall of Love
                            </Link>
                        </nav>

                        <div className="w-16 h-[1px] bg-border" />

                        <div className="flex flex-col items-center gap-6 w-full">
                            <div className="scale-125">
                                <div className="scale-125 flex items-center gap-4">
                                    <button
                                        onClick={toggleTheme}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border",
                                            isDark
                                                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
                                                : "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]"
                                        )}
                                        title="Toggle Theme"
                                    >
                                        {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setSeason(season === 'winter' ? 'none' : 'winter')}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border",
                                            season === 'winter'
                                                ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]"
                                                : "bg-transparent border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                        )}
                                    >
                                        <Snowflake className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-muted-foreground hover:text-foreground cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/auth/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full max-w-xs text-center px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
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
