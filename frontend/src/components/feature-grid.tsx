"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap, MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Youtube API",
        description: "Direct server-to-server publishing. No downloads required.",
        icon: Zap,
        align: "top"
    },
    {
        title: "Role-Based Access",
        description: "Granular permissions for editors, managers, and viewers.",
        icon: Lock,
        align: "right"
    },
    {
        title: "Secure Storage",
        description: "Enterprise-grade encryption for all your raw footage.",
        icon: Shield,
        align: "left"
    },
    {
        title: "1-Click Approvals",
        description: "Review streams instantly and approve from any device.",
        icon: MousePointer2,
        align: "bottom"
    }
];

export function FeatureGrid() {
    return (
        <section className="py-32 relative overflow-hidden bg-background" id="features">
            {/* Background elements */}
            <div className="absolute inset-0">
                {/* Subtle Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(var(--foreground) 1px, transparent 1px),
                            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
                    >
                        <span className="text-primary font-medium text-sm">Features</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">Scale</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to manage secure video workflows, organized in one powerful dashboard.
                    </p>
                </div>

                {/* Cross Layout Container */}
                <div className="relative w-full max-w-4xl mx-auto min-h-[600px] flex items-center justify-center">

                    {/* Center Core Visual */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border border-border bg-card/50 backdrop-blur-xl flex items-center justify-center z-20 shadow-2xl"
                    >
                        {/* Static rings - no animation */}
                        <div className="absolute inset-0 rounded-full border border-border/30" />
                        <div className="absolute inset-4 rounded-full border border-border/20" />

                        <div className="text-center p-4">
                            <span className="block text-4xl font-bold text-foreground mb-2">10x</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Faster Workflow</span>
                        </div>
                    </motion.div>

                    {/* Surrounding Cards */}
                    {features.map((feature, index) => {
                        // Position logic based on "align"
                        const posMap = {
                            top: "top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-8",
                            bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-8",
                            left: "left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-8",
                            right: "right-0 top-1/2 -translate-y-1/2 translate-x-full ml-8",
                        };

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, [feature.align === 'top' || feature.align === 'bottom' ? 'y' : 'x']: 20 }}
                                whileInView={{ opacity: 1, [feature.align === 'top' || feature.align === 'bottom' ? 'y' : 'x']: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className={cn(
                                    "absolute hidden md:flex flex-col items-center text-center p-6 w-64 rounded-2xl border border-border bg-card/80 backdrop-blur-md hover:bg-card transition-all group shadow-lg",
                                    posMap[feature.align as keyof typeof posMap]
                                )}
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        );
                    })}

                    {/* Mobile View: Simple Grid */}
                    <div className="md:hidden grid grid-cols-1 gap-6 w-full pt-32">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card/80">
                                <feature.icon className="w-8 h-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
