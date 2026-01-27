"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "mWareX completely removed the bottleneck of downloading 50GB files just to review them. It's a game changer.",
        author: "Alex Hormozi (Parody)",
        role: "Content Creator",
        gradient: "from-violet-500 to-purple-600"
    },
    {
        quote: "The security features are what sold us. We no longer share our Google credentials with editors.",
        author: "MrBeast Team (Parody)",
        role: "Production Lead",
        gradient: "from-blue-500 to-cyan-600"
    },
    {
        quote: "Direct publishing to YouTube API saves us about 4 hours per week per channel. Essential for scale.",
        author: "Ali Abdaal (Parody)",
        role: "YouTuber",
        gradient: "from-emerald-500 to-green-600"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden bg-secondary/30 border-t border-border">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
                    >
                        <span className="text-primary font-medium text-sm">Testimonials</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Trusted by the best.
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        See what creators and editing teams are saying about MWareX.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="bg-card border border-border p-8 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                        >
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Quote className="w-5 h-5 text-primary" />
                                </div>
                            </div>

                            {/* Quote */}
                            <p className="text-foreground/90 text-lg leading-relaxed mb-8">
                                &ldquo;{t.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                                    {t.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{t.author}</h4>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
