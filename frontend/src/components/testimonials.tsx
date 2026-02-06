"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { ParallaxScroll } from "@/components/parallax-scroll";

const testimonials = [
    {
        quote: "mWareX completely removed the bottleneck of downloading 50GB files just to review them. It's a game changer for our entire editing workflow.",
        name: "Alex Hormozi (Parody)",
        designation: "Content Creator",
        src: ""
    },
    {
        quote: "The security features are what sold us. We no longer share our Google credentials with editors, which was a huge security risk before.",
        name: "MrBeast Team (Parody)",
        designation: "Production Lead",
        src: ""
    },
    {
        quote: "Direct publishing to YouTube API saves us about 4 hours per week per channel. Essential for scale when managing multiple channels.",
        name: "Ali Abdaal (Parody)",
        designation: "YouTuber",
        src: ""
    },
    {
        quote: "The best platform I've used for managing video production. It's clean, fast, and secure.",
        name: "Sarah Jenkins",
        designation: "Documentary Filmmaker",
        src: ""
    },
    {
        quote: "Workflow automation at its finest. We can finally track every stage of production without spreadsheets.",
        name: "David Cho",
        designation: "Agency Owner",
        src: ""
    },
    {
        quote: "A must-have tool for any serious YouTube studio. The ROI is immediate.",
        name: "TechLead (Parody)",
        designation: "Ex-Google, Ex-Facebook",
        src: ""
    },
    {
        quote: "Simple, intuitive, and powerful. My editors love the streamlined review process.",
        name: "Marcus Brownlee (Parody)",
        designation: "Tech Reviewer",
        src: ""
    },
    {
        quote: "Finally, a tool that understands the creator economy workflow.",
        name: "Casey Neistat (Parody)",
        designation: "Vlogger",
        src: ""
    },
    {
        quote: "The version control for video edits is a lifesaver. No more 'Final_Final_v3.mp4' confusion.",
        name: "EditStation",
        designation: "Post-Production House",
        src: ""
    }
];

export function Testimonials() {
    return (
        <section className="py-20 relative overflow-hidden bg-secondary/10 border-t border-border">
            {/* Enhanced Background Blob */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] opacity-50" />
            </div>

            <div className="w-full relative z-10">
                {/* Header */}
                <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 mx-auto"
                    >
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">Community Feedback</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
                    >
                        Trusted by the{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-indigo-500">
                            best.
                        </span>
                    </motion.h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        See what creators and teams are saying about their new workflow.
                    </p>
                </div>

                {/* Parallax Scroll Container */}
                <div className="h-[800px] w-full relative overflow-hidden mask-gradient-y">
                    {/* Overlay gradients to fade top/bottom */}
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

                    <ParallaxScroll testimonials={testimonials} className="h-full" />
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-12 flex flex-wrap justify-center gap-12 md:gap-24 relative z-30 bg-background/50 backdrop-blur-sm py-10"
                >
                    {[
                        { value: 101, suffix: "+", label: "Active Creators" },
                        { value: 50, suffix: "+", label: "Videos Processed" },
                        { value: 93, suffix: "%", label: "Accuracy" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Keeping the Counter component
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [hasInView, setHasInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "-50px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const [count, setCount] = useState(0);
    useEffect(() => {
        if (hasInView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const incrementTime = 30;
            const step = end / (duration / incrementTime);

            const timer = setInterval(() => {
                start += step;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.round(start));
                }
            }, incrementTime);
            return () => clearInterval(timer);
        }
    }, [hasInView, value]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}
