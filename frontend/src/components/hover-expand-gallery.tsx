"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const images = [
    {
        src: "/images/workflow/001..png",
        alt: "Project Overview",
        code: "# 01",
    },
    {
        src: "/images/workflow/03.png",
        alt: "Video Upload",
        code: "# 02",
    },
    {
        src: "/images/workflow/04.png",
        alt: "Task Assignment",
        code: "# 03",
    },
    {
        src: "/images/workflow/05.png",
        alt: "Editing Process",
        code: "# 04",
    },
    {
        src: "/images/workflow/06.png",
        alt: "Review & Feedback",
        code: "# 05",
    },
    {
        src: "/images/workflow/07.png",
        alt: "Final Approval",
        code: "# 06",
    },
    {
        src: "/images/workflow/08.png",
        alt: "Publishing",
        code: "# 07",
    },
];

export const HoverExpandGallery = () => {
    return (
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-transparent py-10">
            <HoverExpand_001 className="" images={images} />
        </div>
    );
};

const HoverExpand_001 = ({
    images,
    className,
}: {
    images: { src: string; alt: string; code: string }[];
    className?: string;
}) => {
    const [activeImage, setActiveImage] = useState<number | null>(1);

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: 0.2,
            }}
            className={cn("relative w-full max-w-6xl px-5", className)}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <div className="flex w-full items-center justify-center gap-1 overflow-x-auto pb-4 hide-scrollbar">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                                "relative cursor-pointer overflow-hidden rounded-3xl shrink-0 border border-white/10",
                                activeImage === index ? "ring-2 ring-primary/50" : ""
                            )}
                            initial={{ width: "2.5rem", height: "20rem" }}
                            animate={{
                                width: activeImage === index ? "24rem" : "5rem",
                                height: activeImage === index ? "24rem" : "24rem",
                            }}
                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                            onClick={() => setActiveImage(index)}
                            onMouseEnter={() => setActiveImage(index)}
                        >
                            <AnimatePresence>
                                {activeImage === index && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"
                                    />
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {activeImage === index && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full"
                                    >
                                        <h3 className="text-white font-bold text-xl mb-1">{image.alt}</h3>
                                        <p className="text-white/60 text-sm font-mono">
                                            {image.code}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <img
                                src={image.src}
                                className="w-full h-full object-cover bg-secondary"
                                alt={image.alt}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};
