"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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

export function Testimonials() {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const headerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 20,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    const quoteIconVariants = {
        hidden: { opacity: 0, scale: 0, rotate: -45 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
            },
        },
    };

    return (
        <section className="py-28 relative overflow-hidden bg-secondary/30 border-t border-border">
            {/* Enhanced Background */}
            <div className="absolute inset-0">
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
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="text-center mb-20"
                >
                    <motion.div
                        variants={headerVariants}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <Star className="w-4 h-4 text-primary fill-primary" />
                        </motion.div>
                        <span className="text-primary font-semibold text-sm">Testimonials</span>
                    </motion.div>

                    <motion.h2
                        variants={headerVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                    >
                        Trusted by the{" "}
                        <span className="relative">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                                best
                            </span>
                            <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute bottom-2 left-0 h-3 bg-primary/20 -z-0 rounded-sm"
                            />
                        </span>
                        .
                    </motion.h2>
                    <motion.p
                        variants={headerVariants}
                        className="text-muted-foreground max-w-xl mx-auto text-lg"
                    >
                        See what creators and editing teams are saying about MWareX.
                    </motion.p>
                </motion.div>

                {/* Testimonial Cards */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            className="bg-card border border-border p-8 rounded-2xl hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
                        >
                            {/* Subtle gradient overlay on hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Quote Icon */}
                            <motion.div
                                variants={quoteIconVariants}
                                className="relative mb-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                                    <Quote className="w-5 h-5 text-primary" />
                                </div>
                            </motion.div>

                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, starIndex) => (
                                    <motion.div
                                        key={starIndex}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + starIndex * 0.1 }}
                                    >
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quote Text */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="relative text-foreground/90 text-lg leading-relaxed mb-8"
                            >
                                &ldquo;{t.quote}&rdquo;
                            </motion.p>

                            {/* Author */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, type: "spring" }}
                                className="relative flex items-center gap-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                                >
                                    {t.author.charAt(0)}
                                </motion.div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{t.author}</h4>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </motion.div>

                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-20 flex flex-wrap justify-center gap-12 md:gap-20"
                >
                    {[
                        { value: "10,000+", label: "Active Creators" },
                        { value: "50M+", label: "Videos Processed" },
                        { value: "99.9%", label: "Uptime" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <motion.p
                                className="text-3xl md:text-4xl font-bold text-foreground mb-1"
                            >
                                {stat.value}
                            </motion.p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
