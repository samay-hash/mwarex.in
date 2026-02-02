"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

interface OnboardingOverlayProps {
    targetSelector?: string; // CSS selector for element to highlight
    allowInteraction?: boolean; // Allow clicking the highlighted element
    children?: React.ReactNode; // Custom content (arrows, tooltips)
}

export function OnboardingOverlay({
    targetSelector,
    allowInteraction = false,
    children,
}: OnboardingOverlayProps) {
    const { skipOnboarding, canSkip, isOnboarding } = useOnboarding();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!isOnboarding) return;

        const updateTargetPosition = () => {
            if (targetSelector) {
                const element = document.querySelector(targetSelector);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    setTargetRect(rect);
                }
            } else {
                setTargetRect(null);
            }
        };

        updateTargetPosition();

        // Check periodically for element appearance (important for dynamic elements)
        const interval = setInterval(updateTargetPosition, 500);
        window.addEventListener("scroll", updateTargetPosition);
        window.addEventListener("resize", updateTargetPosition);

        return () => {
            clearInterval(interval);
            window.removeEventListener("scroll", updateTargetPosition);
            window.removeEventListener("resize", updateTargetPosition);
        };
    }, [targetSelector, isOnboarding]);

    if (!isOnboarding) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998]"
                style={{
                    // Non-intrusive: allow clicks to pass through everywhere
                    pointerEvents: "none",
                }}
            >
                {/* Visual Highlight Ring Only - removed dark overlay */}
                {targetRect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute rounded-lg border-2 border-primary"
                        style={{
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                            boxShadow: "0 0 20px rgba(var(--primary), 0.3)"
                        }}
                    />
                )}

                {/* Skip button - needs pointer-events-auto since parent is none */}
                {canSkip && (
                    <button
                        onClick={skipOnboarding}
                        className="absolute top-6 right-6 z-[10000] pointer-events-auto text-white/80 hover:text-white flex items-center gap-2 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
                    >
                        <X className="w-4 h-4" />
                        Skip Tutorial
                    </button>
                )}

                {/* Content (Arrows/Text) */}
                <div className="relative z-[10000] pointer-events-none">
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
