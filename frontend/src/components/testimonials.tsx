"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
    {
        quote: "mWareX completely removed the bottleneck of downloading 50GB files just to review them. It's a game changer.",
        author: "Alex Hormozi (Parody)",
        role: "Content Creator",
        gradient: "from-violet-500 to-purple-600",
        rating: 5
    },
    {
        quote: "The security features are what sold us. We no longer share our Google credentials with editors.",
        author: "MrBeast Team (Parody)",
        role: "Production Lead",
        gradient: "from-blue-500 to-cyan-600",
        rating: 5
    },
    {
        quote: "Direct publishing to YouTube API saves us about 4 hours per week per channel. Essential for scale.",
        author: "Ali Abdaal (Parody)",
        role: "YouTuber",
        gradient: "from-emerald-500 to-green-600",
        rating: 5
    }
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString() + suffix
    );

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    return <motion.span ref={ref}>{display}</motion.span>;
}

export function Testimonials() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const headingTextVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.2, 0.65, 0.3, 0.9] as const,
            },
        },
    };

    const headingHighlightVariants = {
        hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: "easeOut" as const,
                delay: 0.4,
            },
        },
    };

    // Custom card variants based on position
    const getCardVariant = (index: number) => {
        if (index === 0) {
            // Left card: Rotate in from bottom-left
            return {
                hidden: { opacity: 0, x: -50, y: 50, rotate: -5 },
                visible: {
                    opacity: 1, x: 0, y: 0, rotate: 0,
                    transition: { type: "spring" as const, stiffness: 50, damping: 15 }
                }
            };
        } else if (index === 1) {
            // Center card: Scale up with fade
            return {
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: {
                    opacity: 1, y: 0, scale: 1,
                    transition: { type: "spring" as const, stiffness: 50, damping: 15, delay: 0.1 }
                }
            };
        } else {
            // Right card: Rotate in from bottom-right
            return {
                hidden: { opacity: 0, x: 50, y: 50, rotate: 5 },
                visible: {
                    opacity: 1, x: 0, y: 0, rotate: 0,
                    transition: { type: "spring" as const, stiffness: 50, damping: 15, delay: 0.2 }
                }
            };
        }
    };

    return (
        <section className="py-28 relative overflow-hidden bg-secondary/30 border-t border-border">
            {/* Enhanced Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="inline-block"
                    >
                        <motion.div
                            variants={headingTextVariants}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 mx-auto"
                        >
                            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                            <span className="text-primary font-semibold text-xs uppercase tracking-wider">Testimonials</span>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                            <motion.span variants={headingTextVariants} className="inline-block">
                                Trusted by the{" "}
                            </motion.span>
                            <motion.span
                                variants={headingHighlightVariants}
                                className="relative inline-block ml-2"
                            >
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-indigo-500">
                                    best.
                                </span>
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 0.5, scale: 1.2 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-full"
                                />
                            </motion.span>
                        </h2>
                    </motion.div>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={getCardVariant(i)}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative flex flex-col h-full"
                        >
                            {/* Quote Icon */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 + (i * 0.1), type: "spring" }}
                                className="mb-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                            >
                                <Quote className="w-4 h-4 text-primary" />
                            </motion.div>

                            {/* Rating Stars - Pop Effect */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, starIndex) => (
                                    <motion.div
                                        key={starIndex}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: 0.4 + (i * 0.1) + (starIndex * 0.05),
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 10
                                        }}
                                    >
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quote Text */}
                            <p className="text-foreground/90 text-lg leading-relaxed mb-8 flex-grow">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                    {t.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground text-sm">{t.author}</h4>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-24 flex flex-wrap justify-center gap-12 md:gap-24"
                >
                    {[
                        { value: 10000, suffix: "+", label: "Active Creators" },
                        { value: 50, suffix: "M+", label: "Videos Processed" },
                        { value: 99, suffix: "%", label: "Accuracy" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <motion.div
                                className="text-4xl md:text-5xl font-bold text-foreground mb-2"
                            >
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </motion.div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
