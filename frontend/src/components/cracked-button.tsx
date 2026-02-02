"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export function CrackedButton({ children, className, ...props }: CrackedButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Crack paths starting from center (approx 200, 25 based on 400x50 viewBox)
    // Jagged lines radiating outward
    const cracks = [
        "M200,25 L180,15 L160,20 L120,5", // Top left-ish
        "M200,25 L220,35 L250,30 L300,45", // Bottom right-ish
        "M200,25 L190,40 L160,45 L130,40", // Bottom left-ish
        "M200,25 L215,10 L240,15 L280,5",  // Top right-ish
    ];

    const crackVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 0.6,
            transition: {
                duration: 0.2,
                ease: "easeOut" as const
            }
        },
    };

    const snakeVariants = {
        hidden: { pathLength: 0, pathOffset: 0, opacity: 0 },
        visible: {
            pathLength: [0, 0.3, 0], // Snake grows then shrinks
            pathOffset: [0, 0.7, 1], // Moves along the path
            opacity: [0, 1, 0],
            transition: {
                duration: 1.5,
                ease: "easeInOut" as const,
                delay: 0.1,
                repeat: Infinity,
                repeatDelay: 2
            }
        },
    };

    return (
        <button
            className={cn(
                "relative overflow-hidden group",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {/* Base Button Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Crack Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 50"
                    preserveAspectRatio="none"
                    className="overflow-visible"
                >
                    <AnimatePresence>
                        {isHovered && cracks.map((d, i) => (
                            <React.Fragment key={i}>
                                {/* The physical 'crack' */}
                                <motion.path
                                    d={d}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                    className="text-white/40 dark:text-black/40"
                                    variants={crackVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                />

                                {/* The 'energy snake' */}
                                <motion.path
                                    d={d}
                                    stroke="url(#snake-gradient)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    variants={snakeVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    style={{ filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))" }}
                                />
                            </React.Fragment>
                        ))}
                    </AnimatePresence>
                    <defs>
                        <linearGradient id="snake-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="white" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </button>
    );
}
