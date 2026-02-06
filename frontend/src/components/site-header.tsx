"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
