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
                    // We handle pointer events manually to allow clicking ONLY the target
                    pointerEvents: "auto",
                }}
            >
                {/* Semi-transparent overlay - using SVG to "cut out" the hole */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <mask id="onboarding-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            {targetRect && (
                                <rect
                                    x={targetRect.left - 4}
                                    y={targetRect.top - 4}
                                    width={targetRect.width + 8}
                                    height={targetRect.height + 8}
                                    rx="8"
                                    fill="black"
                                />
                            )}
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.6)" // 60% opacity dark overlay
                        mask="url(#onboarding-mask)"
                    />
                </svg>

                {/* Blocking Layer for non-target areas */}
                <div className="absolute inset-0 w-full h-full" />

                {/* Interaction Zone - Allow clicking ONLY here */}
                {allowInteraction && targetRect && (
                    <div
                        style={{
                            position: "absolute",
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                            cursor: "pointer",
                            zIndex: 9999, // Above everything
                        }}
                        onClick={(e) => {
                            // Ensure click passes through to underlying element if needed, 
                            // but usually the browser handles this if we don't preventDefault
                            // For React 18+ strict overlay, we might need to manually trigger click if it blocks.
                            // But a transparent div on top usually captures clicks unless 'pointer-events: none'.
                            // To safely allow interaction with the element BELOW, we make THIS div transparent to events:
                        }}
                        className="pointer-events-none" // KEY: Let clicks pass through to the real element below
                    />
                )}

                {/* Visual Highlight Ring */}
                {targetRect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute rounded-lg border-2 border-primary pointer-events-none"
                        style={{
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                            boxShadow: "0 0 20px rgba(var(--primary), 0.3)"
                        }}
                    />
                )}

                {/* Skip button - only if allowed */}
                {canSkip && (
                    <button
                        onClick={skipOnboarding}
                        className="absolute top-6 right-6 z-[10000] text-white/80 hover:text-white flex items-center gap-2 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
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
