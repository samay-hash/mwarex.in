"use client";

import { motion } from "framer-motion";
import { Youtube } from "lucide-react";

export function ProductPreview() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
                    >
                        <span className="text-primary font-medium text-sm">Dashboard Preview</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Power in your hands.
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A dashboard designed for speed. Manage hundreds of videos without losing context.
                    </p>
                </div>

                {/* Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full aspect-[16/10] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
                >
                    {/* Top Bar */}
                    <div className="h-12 border-b border-border flex items-center px-4 gap-4 bg-secondary/30">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="h-6 w-32 bg-muted rounded-full" />
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex h-[calc(100%-48px)]">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-border bg-secondary/20 p-4 space-y-4 hidden md:block">
                            <div className="h-8 w-full bg-primary/10 rounded-lg" />
                            <div className="h-4 w-3/4 bg-muted rounded-lg" />
                            <div className="h-4 w-1/2 bg-muted rounded-lg" />
                            <div className="h-4 w-2/3 bg-muted rounded-lg" />

                            <div className="pt-8 space-y-3">
                                <div className="h-4 w-full bg-muted rounded-lg" />
                                <div className="h-4 w-full bg-muted rounded-lg" />
                                <div className="h-4 w-full bg-muted rounded-lg" />
                            </div>
                        </div>

                        {/* Video Grid */}
                        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-video bg-secondary/30 rounded-xl border border-border p-4 flex flex-col justify-between hover:bg-secondary/50 transition-colors">
                                    <div className="w-full h-2/3 bg-muted/50 rounded-lg flex items-center justify-center mb-2">
                                        <Youtube className="w-8 h-8 text-muted-foreground/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-3/4 bg-muted rounded" />
                                        <div className="flex justify-between">
                                            <div className="h-2 w-1/3 bg-muted rounded" />
                                            <div className="h-2 w-4 bg-green-500/40 rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shadow Overlay for dark mode */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none dark:from-black/60" />
                </motion.div>
            </div>
        </section>
    );
}
