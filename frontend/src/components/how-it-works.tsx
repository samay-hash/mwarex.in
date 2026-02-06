"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { UserPlus, Users, Upload, Youtube, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const workflowSteps = [
    {
        step: 1,
        title: "Sign up with Google",
        description: "Create your account instantly with one-click Google authentication. No lengthy forms, no waiting.",
        icon: UserPlus,
        color: "from-blue-500 to-cyan-500",
    },
    {
        step: 2,
        title: "Invite Editors",
        description: "Send secure invite links to your editing team. They get controlled access without seeing your credentials.",
        icon: Users,
        color: "from-violet-500 to-purple-500",
    },
    {
        step: 3,
        title: "Upload Footage",
        description: "Editors upload video files directly to your secure workspace. All uploads require your approval.",
        icon: Upload,
        color: "from-orange-500 to-amber-500",
        badge: "Pending Approval"
    },
    {
        step: 4,
        title: "Connect YouTube",
        description: "Link your YouTube channel securely via the official API. Your credentials stay protected.",
        icon: Youtube,
        color: "from-red-500 to-rose-500",
    },
    {
        step: 5,
        title: "Approve & Publish",
        description: "Review the content, add notes if needed, and publish directly to your channel with one click.",
        icon: CheckCircle,
        color: "from-emerald-500 to-green-500",
    },
];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const lineHeight = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <section
            ref={containerRef}
            className="py-32 relative bg-background overflow-hidden"
            id="workflow"
        >
            {/* Background Elements - Static */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(var(--foreground) 1px, transparent 1px),
                            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
                    >
                        <span className="text-primary font-medium text-sm">How It Works</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-6"
                    >
                        From Upload to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                            Published
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-xl mx-auto text-lg"
                    >
                        A streamlined 5-step workflow that keeps your channel secure while empowering your team.
                    </motion.p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Center Vertical Line - Static Track */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 bg-border/30 rounded-full" />

                    {/* Animated Progress Line - Scroll Based Only */}
                    <motion.div
                        className="absolute left-6 md:left-1/2 top-0 w-[2px] md:-translate-x-1/2 rounded-full overflow-hidden"
                        style={{ height: lineHeight }}
                    >
                        {/* Glowing animated line */}
                        <div className="w-full h-full bg-gradient-to-b from-primary via-violet-500 to-primary relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary via-violet-500 to-primary blur-sm" />
                        </div>
                    </motion.div>

                    {/* Steps */}
                    <div className="space-y-16 md:space-y-24">
                        {workflowSteps.map((step, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5 }}
                                    className={cn(
                                        "relative flex gap-8 items-start md:items-center",
                                        isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    )}
                                >
                                    {/* Horizontal Connector Line - From Node to Card */}
                                    <div
                                        className={cn(
                                            "hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] z-10",
                                            isEven
                                                ? "left-[calc(50%+24px)] right-[calc(50%+60px)]"
                                                : "right-[calc(50%+24px)] left-[calc(50%+60px)]"
                                        )}
                                    >
                                        {/* Glowing line effect */}
                                        <div className={cn(
                                            "absolute inset-0 rounded-full",
                                            `bg-gradient-to-${isEven ? 'l' : 'r'} ${step.color}`
                                        )} />
                                        <div className={cn(
                                            "absolute inset-0 rounded-full blur-sm opacity-50",
                                            `bg-gradient-to-${isEven ? 'l' : 'r'} ${step.color}`
                                        )} />
                                    </div>

                                    {/* Timeline Node - Enhanced with Glow */}
                                    <div
                                        className={cn(
                                            "absolute left-6 md:left-1/2 w-12 h-12 -translate-x-1/2 rounded-full flex items-center justify-center z-20",
                                            `bg-gradient-to-br ${step.color}`
                                        )}
                                    >
                                        {/* Outer glow ring */}
                                        <div className={cn(
                                            "absolute inset-[-4px] rounded-full blur-md opacity-40",
                                            `bg-gradient-to-br ${step.color}`
                                        )} />
                                        {/* Pulse animation ring */}
                                        <motion.div
                                            className={cn(
                                                "absolute inset-[-2px] rounded-full border-2 opacity-50",
                                                step.color.includes("blue") ? "border-blue-400" :
                                                    step.color.includes("violet") ? "border-violet-400" :
                                                        step.color.includes("orange") ? "border-orange-400" :
                                                            step.color.includes("red") ? "border-red-400" :
                                                                "border-green-400"
                                            )}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0, 0.5]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <step.icon className="w-5 h-5 text-white relative z-10" />
                                    </div>

                                    {/* Content Card */}
                                    <div className={cn(
                                        "pl-20 md:pl-0 w-full md:w-[calc(50%-60px)]",
                                        isEven ? "md:pr-8" : "md:pl-8"
                                    )}>
                                        <div className="p-6 md:p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                                            {/* Step Number & Badge */}
                                            <div className={cn(
                                                "flex items-center gap-3 mb-4",
                                                isEven ? "" : "md:justify-end"
                                            )}>
                                                <span className={cn(
                                                    "text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full",
                                                    `bg-gradient-to-r ${step.color} text-white`
                                                )}>
                                                    Step {step.step}
                                                </span>
                                                {step.badge && (
                                                    <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20">
                                                        {step.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className={cn(
                                                "text-xl md:text-2xl font-bold mb-3 text-foreground",
                                                isEven ? "" : "md:text-right"
                                            )}>
                                                {step.title}
                                            </h3>

                                            {/* Description */}
                                            <p className={cn(
                                                "text-muted-foreground leading-relaxed",
                                                isEven ? "" : "md:text-right"
                                            )}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Empty Space for Layout */}
                                    <div className="hidden md:block md:w-[calc(50%-60px)]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
