"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { CloudRain, Snowflake, Sun, Leaf, Wind } from "lucide-react";
import { useSeason, Season } from "@/contexts/SeasonContext"; // Note: This uses the Context we just created
import { cn } from "@/lib/utils";

// --- Particle Config ---
const PARTICLE_COUNT = 15; // Keep it low for performance

// Hook to detect reduced motion preference
const useReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener("change", listener);
        return () => mediaQuery.removeEventListener("change", listener);
    }, []);
    return prefersReducedMotion;
};

// --- Season Components ---

const AutumnParticles = () => {
    const prefersReducedMotion = useReducedMotion();

    // Generate random positions/delays for leaves
    const leaves = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        size: 10 + Math.random() * 20,
        rotate: Math.random() * 360,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Ambient Warmth */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 mix-blend-overlay" />

            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className="absolute text-orange-400 dark:text-orange-300 opacity-40 will-change-transform"
                    style={{
                        left: `${leaf.x}%`,
                        top: -50,
                    }}
                    animate={
                        !prefersReducedMotion ? {
                            y: ["0vh", "110vh"],
                            x: [0, (Math.random() - 0.5) * 200], // Drift horizontally
                            rotate: [leaf.rotate, leaf.rotate + 360],
                            opacity: [0, 0.4, 0], // Fade in/out
                        } : { opacity: 0.2, y: "50vh" } // Static for reduced motion
                    }
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: leaf.delay,
                    }}
                >
                    <Leaf size={leaf.size} fill="currentColor" className="opacity-60" />
                </motion.div>
            ))}
        </div>
    );
};

const WinterParticles = () => {
    const prefersReducedMotion = useReducedMotion();

    const snowflakes = Array.from({ length: PARTICLE_COUNT * 2 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        size: 2 + Math.random() * 4,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Cool Ambient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/10 to-transparent dark:from-blue-900/10 mix-blend-overlay" />

            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute bg-white rounded-full opacity-60 dark:opacity-40 will-change-transform"
                    style={{
                        left: `${flake.x}%`,
                        top: -10,
                        width: flake.size,
                        height: flake.size,
                    }}
                    animate={
                        !prefersReducedMotion ? {
                            y: ["0vh", "110vh"],
                            x: [0, (Math.random() - 0.5) * 50], // Drift slightly
                            opacity: [0, 0.6, 0],
                        } : { opacity: 0.3, y: "50vh" }
                    }
                    transition={{
                        duration: flake.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: flake.delay,
                    }}
                />
            ))}
        </div>
    );
};

const SummerParticles = () => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Warm Glows */}
            <motion.div
                className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[100px] mix-blend-screen dark:mix-blend-lighten"
                animate={!prefersReducedMotion ? { x: [0, 50, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[80px] mix-blend-screen dark:mix-blend-lighten"
                animate={!prefersReducedMotion ? { y: [0, -30, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Floating Dust */}
            {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-yellow-200 rounded-full opacity-40 will-change-transform"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                    }}
                    animate={
                        !prefersReducedMotion ? {
                            y: [0, -40, 0],
                            opacity: [0.2, 0.5, 0.2],
                        } : {}
                    }
                    transition={{
                        duration: 4 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
};

const RainyParticles = () => {
    const prefersReducedMotion = useReducedMotion();

    const drops = Array.from({ length: PARTICLE_COUNT * 3 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 0.5, // fast
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Moody Ambient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-slate-800/5 mix-blend-overlay" />

            {drops.map((drop) => (
                <motion.div
                    key={drop.id}
                    className="absolute bg-blue-400/30 dark:bg-blue-300/20 w-[1px] h-[15px] will-change-transform"
                    style={{
                        left: `${drop.x}%`,
                        top: -20,
                    }}
                    animate={
                        !prefersReducedMotion ? {
                            y: ["0vh", "110vh"],
                            opacity: [0, 0.5, 0],
                        } : { opacity: 0.1, y: "50vh" }
                    }
                    transition={{
                        duration: drop.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: drop.delay,
                    }}
                />
            ))}
        </div>
    );
};

// --- Main Background Component ---

export function SeasonalBackground() {
    const { season } = useSeason();
    const { theme } = useTheme(); // can be used to adjust intensity if needed
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || season === 'none') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 transition-colors duration-1000">
            <AnimatePresence mode="wait">
                {season === 'autumn' && (
                    <motion.div
                        key="autumn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <AutumnParticles />
                    </motion.div>
                )}

                {season === 'winter' && (
                    <motion.div
                        key="winter"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <WinterParticles />
                    </motion.div>
                )}

                {season === 'summer' && (
                    <motion.div
                        key="summer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <SummerParticles />
                    </motion.div>
                )}

                {season === 'rainy' && (
                    <motion.div
                        key="rainy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <RainyParticles />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Switcher Components ---

export function SeasonSwitcher() {
    const { season, setSeason } = useSeason();
    const [isOpen, setIsOpen] = useState(false);

    const seasons: { id: Season; label: string; icon: React.ReactNode; color: string }[] = [
        { id: 'none', label: 'None', icon: <div className="w-4 h-4 rounded-full border border-current" />, color: "text-gray-500" },
        { id: 'autumn', label: 'Autumn', icon: <Leaf className="w-4 h-4" />, color: "text-orange-500" },
        { id: 'winter', label: 'Winter', icon: <Snowflake className="w-4 h-4" />, color: "text-blue-400" },
        { id: 'summer', label: 'Summer', icon: <Sun className="w-4 h-4" />, color: "text-amber-500" },
        { id: 'rainy', label: 'Rainy', icon: <CloudRain className="w-4 h-4" />, color: "text-indigo-400" },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative"
                title="Change Season"
            >
                {seasons.find(s => s.id === season)?.icon || <Wind className="w-4 h-4" />}
                {season !== 'none' && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1"
                        >
                            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Choose Ambience
                            </p>
                            {seasons.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSeason(s.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-3 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-secondary/80",
                                        season === s.id ? "bg-secondary/50 text-foreground font-medium" : "text-muted-foreground"
                                    )}
                                >
                                    <span className={cn(s.color)}>{s.icon}</span>
                                    {s.label}
                                    {season === s.id && (
                                        <motion.div layoutId="active-season" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
