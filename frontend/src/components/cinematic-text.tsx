"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function CinematicText({ text, className, delay = 0 }: CinematicTextProps) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: delay,
            },
        },
    };

    const getDirection = (i: number) => {
        const directions = [
            { x: -100, y: -100 }, // Top-left
            { x: 100, y: -100 },  // Top-right
            { x: -100, y: 100 },  // Bottom-left
            { x: 100, y: 100 },   // Bottom-right
            { x: 0, y: -150 },    // Top
            { x: 0, y: 150 },     // Bottom
            { x: -150, y: 0 },    // Left
            { x: 150, y: 0 },     // Right
        ];
        // Use a deterministic pseudo-random pattern based on index
        return directions[(i * 13) % directions.length];
    };

    const letterVariant = {
        hidden: (i: number) => {
            const dir = getDirection(i);
            return {
                x: dir.x,
                y: dir.y,
                opacity: 0,
                filter: "blur(12px) brightness(0.5)",
                scale: 1.5,
            };
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 120,
                mass: 0.8,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={cn("flex flex-wrap justify-start", className)}
        >
            {words.map((word, i) => (
                <div key={i} className="mr-[0.25em] whitespace-nowrap inline-block">
                    {word.split("").map((letter, j) => (
                        <motion.span
                            key={j}
                            custom={i * 10 + j}
                            variants={letterVariant}
                            className="inline-block"
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>
            ))}
        </motion.div>
    );
}
