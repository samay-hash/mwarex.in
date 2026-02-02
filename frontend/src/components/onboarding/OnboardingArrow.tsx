"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUp, ArrowLeft } from "lucide-react";

type Direction = "up" | "down" | "left" | "right";

interface OnboardingArrowProps {
    direction?: Direction;
    text: string;
    position: React.CSSProperties; // Full CSS for flexible positioning
    className?: string;
}

const ARROW_ICONS = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
};

const ANIMATION_VARIANTS = {
    up: { y: [-8, 0, -8] },
    down: { y: [-8, 0, -8] },
    left: { x: [-8, 0, -8] },
    right: { x: [-8, 0, -8] },
};

export function OnboardingArrow({
    direction = "down",
    text,
    position,
    className = "",
}: OnboardingArrowProps) {
    const ArrowIcon = ARROW_ICONS[direction];
    const animationVariant = ANIMATION_VARIANTS[direction];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`fixed z-[10001] pointer-events-none ${className}`} // High Z-index
            style={position}
        >
            <div className="flex flex-col items-center gap-3">
                {/* Text for Down/Right arrows (Top/Left placement relative to arrow) */}
                {(direction === "down" || direction === "right") && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap max-w-xs border border-white/20"
                    >
                        {text}
                    </motion.div>
                )}

                {/* Animated Arrow */}
                <motion.div
                    animate={animationVariant}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative"
                >
                    {/* Intense Glow */}
                    <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl animate-pulse" />

                    {/* Arrow Icon */}
                    <div className="relative bg-white text-primary p-3 rounded-full shadow-2xl border-4 border-primary/20">
                        <ArrowIcon className="w-6 h-6" strokeWidth={3} />
                    </div>
                </motion.div>

                {/* Text for Up/Left arrows (Bottom/Right placement) */}
                {(direction === "up" || direction === "left") && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap max-w-xs border border-white/20"
                    >
                        {text}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
