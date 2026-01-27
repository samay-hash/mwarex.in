"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MWareXLogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
    href?: string;
}

export function MWareXLogo({ className, showText = true, size = "md", href }: MWareXLogoProps) {
    const sizes = {
        sm: { container: "w-7 h-7", tick: "w-4 h-4" },
        md: { container: "w-9 h-9", tick: "w-5 h-5" },
        lg: { container: "w-12 h-12", tick: "w-7 h-7" },
    };

    const logoContent = (
        <div className={cn("flex items-center gap-2.5", href && "cursor-pointer", className)}>
            {/* Logo Icon - Tick Mark with YouTube color scheme (half white, half red) */}
            <div className={cn(
                "relative flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-lg border border-zinc-800/50",
                sizes[size].container
            )}>
                {/* Custom Tick SVG - Half White, Half Red */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={sizes[size].tick}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Left part of tick (downward stroke) - White */}
                    <path
                        d="M5 13l4 4"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Right part of tick (upward stroke) - Red like YouTube */}
                    <path
                        d="M9 17L19 7"
                        stroke="#FF0000"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {showText && (
                <span className="text-xl font-bold tracking-tight text-foreground">
                    MWareX<span className="text-primary">.</span>
                </span>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{logoContent}</Link>;
    }

    return logoContent;
}
