"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, Sparkles } from "lucide-react";

interface OnboardingTooltipProps {
    text: string;
    position: React.CSSProperties; // Allow full CSS control including transform
    showIcon?: boolean;
    className?: string;
}

export function OnboardingTooltip({
    text,
    position,
    showIcon = true,
    className = "",
}: OnboardingTooltipProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed z-[10001] pointer-events-none ${className}`} // High Z-index above overlay
            style={position}
        >
            <div className="bg-gradient-to-br from-primary/95 to-primary text-primary-foreground px-5 py-3 rounded-xl shadow-2xl shadow-primary/40 backdrop-blur-sm border border-primary-foreground/20 max-w-sm">
                <div className="flex items-start gap-3">
                    {showIcon && (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        </motion.div>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{text}</p>
                </div>
                {/* Subtle glow effect */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-primary/20 rounded-xl blur-xl -z-10"
                />
            </div>
        </motion.div>
    );
}
