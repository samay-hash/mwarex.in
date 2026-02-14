"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Snowflake, Sun, CloudRain, Wind, Sparkles } from "lucide-react";
import { useSeason, Season } from "@/contexts/SeasonContext";
import { cn } from "@/lib/utils";

export function LandingSeasonSelector() {
    const { season, setSeason } = useSeason();
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const seasonsList = [
        {
            id: 'autumn',
            label: 'Autumn',
            icon: <Leaf className="w-5 h-5" />,
            color: "text-orange-500",
            desc: "Calm & Cozy"
        },
        {
            id: 'winter',
            label: 'Winter',
            icon: <Snowflake className="w-5 h-5" />,
            color: "text-blue-400",
            desc: "Cool & Focus"
        },
        {
            id: 'summer',
            label: 'Summer',
            icon: <Sun className="w-5 h-5" />,
            color: "text-amber-500",
            desc: "Warm & Energetic"
        },
        {
            id: 'rainy',
            label: 'Rainy',
            icon: <CloudRain className="w-5 h-5" />,
            color: "text-indigo-400",
            desc: "Deep Work"
        },
    ];

    // --- Desktop View ---
    return (
        <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex-col items-center gap-2">
            {/* Instruction Tooltip (Shows initially or on hover) */}
            <AnimatePresence>
                {(isHovered || season === 'none') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-medium backdrop-blur-md border border-white/10 whitespace-nowrap shadow-xl"
                    >
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Customize your workspace ambience
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="flex items-center gap-1 p-1.5 rounded-full bg-background/60 dark:bg-black/40 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
            >
                {seasonsList.map((s) => {
                    const isActive = season === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setSeason(s.id as Season)}
                            className="relative group flex items-center justify-center"
                        >
                            {/* Active Background Pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="season-active-pill"
                                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Button Content */}
                            <div className={cn(
                                "relative z-10 px-4 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300",
                                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
                            )}>
                                <span className={cn("transition-colors duration-300", isActive && s.color)}>
                                    {s.icon}
                                </span>
                                <span className={cn(
                                    "text-sm font-medium transition-all duration-300",
                                    isActive ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-[100px]"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        </button>
                    );
                })}

                {/* Separator */}
                <div className="w-px h-6 bg-border mx-1" />

                {/* Reset/None Option */}
                <button
                    onClick={() => setSeason('none')}
                    className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-full transition-all text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5",
                        season === 'none' && "bg-white dark:bg-white/10 text-foreground shadow-sm"
                    )}
                    title="Disable Effects"
                >
                    <Wind className="w-4 h-4" />
                </button>
            </motion.div>
        </div>
    );
}
