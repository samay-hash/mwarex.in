"use client";

import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { cn } from "@/lib/utils";

interface Testimonial {
    quote: string;
    author: string;
    role: string;
    gradient: string;
    rating: number;
}

const testimonials: Testimonial[] = [
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

export function Testimonials() {
    return (
        <section className="py-28 relative overflow-hidden bg-secondary/30 border-t border-border">
            {/* Enhanced Background Blob */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                {/* Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-8 mx-auto"
                    >
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-primary font-semibold text-xs uppercase tracking-wider">Testimonials</span>
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
                </div>

                {/* Swiper Carousel */}
                <div className="relative flex w-full items-center justify-center">
                    <Carousel testimonials={testimonials} />
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

// Adaptive Card Swiper Component
const Carousel = ({
    testimonials,
    autoplay = false,
    loop = true,
}: {
    testimonials: Testimonial[];
    autoplay?: boolean;
    loop?: boolean;
}) => {
    // Custom CSS for Swiper to adjust slide visuals
    const css = `
    .testimonial-swiper {
        width: 100%;
        max-width: 900px;
        padding: 40px 10px;
        overflow: visible !important;
    }
    .testimonial-swiper .swiper-slide {
        display: flex;
        justify-content: center;
        opacity: 0.4;
        transform: scale(0.9);
        transition: all 0.5s ease;
    }
    .testimonial-swiper .swiper-slide-active {
        opacity: 1;
        transform: scale(1);
        z-index: 10;
    }
    `;

    return (
        <div className="w-full relative">
            <style>{css}</style>

            <Swiper
                modules={[EffectCreative, Pagination, Autoplay, Navigation]}
                spaceBetween={30}
                slidesPerView={1}
                loop={loop}
                speed={800}
                autoplay={
                    autoplay ? { delay: 3000, disableOnInteraction: true } : false
                }
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1.2, centeredSlides: true }, // Show partial next slides
                    1024: { slidesPerView: 1.5, centeredSlides: true },
                }}
                className="testimonial-swiper"
            >
                {testimonials.map((t, i) => (
                    <SwiperSlide key={i}>
                        <div className="w-full max-w-2xl relative group h-full min-h-[400px]">
                            {/* --- CARD BACKGROUND --- */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                                {/* Dark Mode: Cinematic Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hidden dark:block"
                                    style={{ backgroundImage: 'url("/new-card-bg.png")' }}
                                />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] hidden dark:block" />

                                {/* Light Mode: Transparent Glass (Requested) */}
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:hidden" />

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-10 opacity-40 dark:opacity-20" />
                            </div>

                            {/* --- CARD CONTENT --- */}
                            <div className="relative z-20 p-8 md:p-12 flex flex-col items-center text-center h-full border border-black/5 dark:border-white/10 rounded-3xl transition-colors">
                                {/* Quote Icon */}
                                <div className="mb-6 w-12 h-12 rounded-full bg-primary/10 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-primary/10 dark:border-white/20">
                                    <Quote className="w-5 h-5 text-primary dark:text-white" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-8">
                                    {[...Array(t.rating)].map((_, idx) => (
                                        <Star key={idx} className="w-5 h-5 text-amber-500 fill-amber-500 dark:text-white dark:fill-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <p className="text-foreground dark:text-white text-xl md:text-2xl leading-relaxed mb-8 font-medium dark:font-light tracking-wide dark:drop-shadow-md">
                                    &ldquo;{t.quote}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md ring-1 ring-white/20`}>
                                        {t.author.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-foreground dark:text-white text-base tracking-wide">{t.author}</h4>
                                        <p className="text-sm text-muted-foreground dark:text-white/60">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-4 z-20 swiper-button-prev-custom cursor-pointer w-12 h-12 bg-background/80 dark:bg-black/50 backdrop-blur-md rounded-full items-center justify-center border border-border hover:scale-110 transition-all text-foreground dark:text-white shadow-lg">
                    <ChevronLeft className="w-6 h-6" />
                </div>
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 z-20 swiper-button-next-custom cursor-pointer w-12 h-12 bg-background/80 dark:bg-black/50 backdrop-blur-md rounded-full items-center justify-center border border-border hover:scale-110 transition-all text-foreground dark:text-white shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                </div>
            </Swiper>
        </div>
    );
};
