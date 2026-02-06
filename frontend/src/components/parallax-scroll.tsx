"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
    testimonials,
    className,
}: {
    testimonials: {
        quote: string;
        name: string;
        designation: string;
        src?: string;
    }[];
    className?: string;
}) => {
    const gridRef = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: gridRef, // remove this if we want window scroll, but user said "scrolling effects *on there*", often implies the section itself. However, usually parallax checks window scroll. Let's try window scroll integration but keeping it contained if possible. Actually, standard parallax usually relies on Page Scroll. Let's bind to window scroll but target the ref for offsets.
        // simpler: useScroll with target: ref, offset: ["start start", "end start"]
        target: gridRef,
        offset: ["start end", "end start"],
    });

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const third = Math.ceil(testimonials.length / 3);

    const firstPart = testimonials.slice(0, third);
    const secondPart = testimonials.slice(third, 2 * third);
    const thirdPart = testimonials.slice(2 * third);

    return (
        <div
            className={cn("h-[40rem] items-start overflow-y-auto w-full relative", className)}
            ref={gridRef}
        >
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-10 py-40 px-10 relative z-10"
            >
                <div className="grid gap-10 relative">
                    {firstPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateFirst }}
                            key={"grid-1" + idx}
                        >
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10 relative">
                    {secondPart.map((el, idx) => (
                        <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10 relative">
                    {thirdPart.map((el, idx) => (
                        <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Glowing Connection Lines Layer */}
            <ConnectionLines
                scrollYProgress={scrollYProgress}
                count={firstPart.length} // Assuming balanced-ish lists
            />
        </div>
    );
};

const ConnectionLines = ({ scrollYProgress, count }: { scrollYProgress: any, count: number }) => {
    // Parallax logic matches the columns:
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const rows = Array.from({ length: count });
    const rowHeight = 400;
    const startY = 200;

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 max-w-7xl mx-auto px-10">
            <svg className="w-full h-full hidden lg:block">
                <defs>
                    {/* Primary glowing gradient */}
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                        <stop offset="30%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                        <stop offset="70%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                    </linearGradient>
                    {/* Glow filter for the lines */}
                    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Animated pulse gradient */}
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {rows.map((_, i) => (
                    <ConnectionRow
                        key={i}
                        i={i}
                        y1={y1}
                        y2={y2}
                        y3={y3}
                        rowHeight={rowHeight}
                        startY={startY}
                    />
                ))}
            </svg>
        </div>
    )
}

const ConnectionRow = ({ i, y1, y2, y3, rowHeight, startY }: any) => {
    const BaseY = startY + (i * rowHeight);

    // Transform the generic parallax values to this specific row's position
    const rowY1 = useTransform(y1, (val: number) => val + BaseY + 50); // +50 to center on card roughly
    const rowY2 = useTransform(y2, (val: number) => val + BaseY + 50);
    const rowY3 = useTransform(y3, (val: number) => val + BaseY + 50);

    // For diagonals
    const nextRowY1 = useTransform(y1, (val: number) => val + BaseY + 50 + 200);
    const nextRowY2 = useTransform(y2, (val: number) => val + BaseY + 50 + 200);
    const nextRowY3 = useTransform(y3, (val: number) => val + BaseY + 50 + 200);

    return (
        <g filter="url(#glow)">
            {/* Main Line Col 1 -> Col 2 */}
            <motion.line
                x1="16.66%"
                y1={rowY1}
                x2="50%"
                y2={rowY2}
                stroke="url(#glowGradient)"
                strokeWidth="3"
                opacity="0.6"
                strokeLinecap="round"
            />
            {/* Main Line Col 2 -> Col 3 */}
            <motion.line
                x1="50%"
                y1={rowY2}
                x2="83.33%"
                y2={rowY3}
                stroke="url(#glowGradient)"
                strokeWidth="3"
                opacity="0.6"
                strokeLinecap="round"
            />

            {/* Cross connection lines */}
            <motion.line
                x1="16.66%"
                y1={nextRowY1}
                x2="50%"
                y2={rowY2}
                stroke="url(#pulseGradient)"
                strokeWidth="1.5"
                opacity="0.3"
                strokeLinecap="round"
            />
            <motion.line
                x1="50%"
                y1={rowY2}
                x2="83.33%"
                y2={nextRowY3}
                stroke="url(#pulseGradient)"
                strokeWidth="1.5"
                opacity="0.3"
                strokeLinecap="round"
            />

            {/* Glowing nodes at connection points */}
            <motion.circle
                cx="16.66%"
                cy={rowY1}
                r="4"
                fill="#6366f1"
                opacity="0.7"
            />
            <motion.circle
                cx="50%"
                cy={rowY2}
                r="5"
                fill="#8b5cf6"
                opacity="0.8"
            />
            <motion.circle
                cx="83.33%"
                cy={rowY3}
                r="4"
                fill="#6366f1"
                opacity="0.7"
            />
        </g>
    );
}

const TestimonialCard = ({ item }: { item: any }) => {
    return (
        <div className="group relative">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 via-violet-500/50 to-primary/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

            {/* Card */}
            <div className="relative rounded-2xl border border-primary/20 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 p-6 backdrop-blur-xl shadow-lg shadow-primary/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/5 transition-all duration-300">
                {/* Inner Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Quote Icon */}
                <div className="mb-4 text-primary relative z-10">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="opacity-70"
                    >
                        <path
                            d="M10 11H6V15H10V11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18 11H14V15H18V11Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M3 15V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className="font-normal text-base text-foreground/80 mb-6 leading-relaxed relative z-10">
                    "{item.quote}"
                </p>

                <div className="flex items-center gap-3 relative z-10">
                    {/* Avatar with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                            {item.name.charAt(0)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.designation}</span>
                    </div>
                </div>

                {/* Connection Node (for line connections) */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 dark:bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-primary/50" />
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 dark:bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-primary/50" />
            </div>
        </div>
    );
};
