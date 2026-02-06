import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


const variants = {
    hidden: { filter: "blur(20px)", transform: "translateY(20%)", opacity: 0 },
    visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

interface BlurRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export function BlurReveal({ text, className = "", delay = 0 }: BlurRevealProps) {
    const words = text.split(" ");

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1, delayChildren: delay }}
            className={cn("flex flex-wrap", className)}
        >
            {words.map((word, index) => (
                <span key={index} className="inline-block mr-[0.25em] last:mr-0">
                    <motion.span
                        className="inline-block"
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        variants={variants}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.div>
    );
}
