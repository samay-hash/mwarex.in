"use client";

import React from "react";
import { motion, Variants, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
    text: string;
    className?: string;
    delay?: number;
    childTransition?: Transition;
    childVariants?: Variants;
}

const defaultTransition: Transition = {
    duration: 1,
    ease: [0.25, 0.1, 0.25, 1],
};

const defaultVariants: Variants = {
    hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
    visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

export const BlurReveal: React.FC<BlurRevealProps> = ({
    text,
    className,
    delay = 0,
    childTransition = defaultTransition,
    childVariants = defaultVariants,
}) => {
    const words = text.split(" ");

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.04, delayChildren: delay }}
            className={cn("flex flex-wrap", className)}
        >
            {words.map((word, index) => (
                <React.Fragment key={index}>
                    <motion.span
                        className="inline-block"
                        transition={childTransition}
                        variants={childVariants}
                    >
                        {word}
                    </motion.span>
                    {index < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </React.Fragment>
            ))}
        </motion.div>
    );
};
