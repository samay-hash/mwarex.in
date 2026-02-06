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
            className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
            ref={gridRef}
        >
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start  max-w-7xl mx-auto gap-10 py-40 px-10"
                ref={gridRef}
            >
                <div className="grid gap-10">
                    {firstPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateFirst }}
                            key={"grid-1" + idx}
                        >
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10">
                    {secondPart.map((el, idx) => (
                        <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10">
                    {thirdPart.map((el, idx) => (
                        <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
                            <TestimonialCard item={el} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TestimonialCard = ({ item }: { item: any }) => {
    return (
        <div className="group hover:scale-105 transition-transform duration-300 relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm">
            <div className="mb-4 text-primary">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-50"
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

            <p className="font-normal text-base text-foreground/80 mb-6 leading-relaxed">
                "{item.quote}"
            </p>

            <div className="flex items-center gap-3">
                {/* Placeholder Avatar if src is missing, or initials */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {item.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.designation}</span>
                </div>
            </div>
        </div>
    );
};
