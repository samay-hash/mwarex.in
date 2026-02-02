"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

import { cn } from "@/lib/utils";

// 7 workflow images from the provided assets
const images = [
    { src: "/images/workflow/001..png", alt: "Project Overview" },
    { src: "/images/workflow/03.png", alt: "Video Upload" },
    { src: "/images/workflow/04.png", alt: "Task Assignment" },
    { src: "/images/workflow/05.png", alt: "Editing Process" },
    { src: "/images/workflow/06.png", alt: "Review & Feedback" },
    { src: "/images/workflow/07.png", alt: "Final Approval" },
    { src: "/images/workflow/08.png", alt: "Publishing" },
];

const WorkflowCarousel = ({
    images,
    className,
    showPagination = true,
    showNavigation = true,
    loop = true,
    autoplay = true,
    spaceBetween = 40,
}: {
    images: { src: string; alt: string }[];
    className?: string;
    showPagination?: boolean;
    showNavigation?: boolean;
    loop?: boolean;
    autoplay?: boolean;
    spaceBetween?: number;
}) => {
    const css = `
    .WorkflowCarousel {
        padding-bottom: 50px !important;
    }
    .WorkflowCarousel .swiper-pagination-bullet {
        background: hsl(var(--primary));
        opacity: 0.4;
    }
    .WorkflowCarousel .swiper-pagination-bullet-active {
        opacity: 1;
    }
    `;

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                duration: 0.5,
                delay: 0.3,
            }}
            className={cn("relative w-full max-w-4xl", className)}
        >
            <style>{css}</style>

            <Swiper
                spaceBetween={spaceBetween}
                autoplay={
                    autoplay
                        ? {
                            delay: 3000,
                            disableOnInteraction: false,
                        }
                        : false
                }
                effect="cards"
                grabCursor={true}
                loop={loop}
                pagination={
                    showPagination
                        ? {
                            clickable: true,
                        }
                        : false
                }
                navigation={
                    showNavigation
                        ? {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }
                        : false
                }
                className="WorkflowCarousel h-[450px] md:h-[550px] w-[320px] md:w-[450px]"
                modules={[EffectCards, Autoplay, Pagination, Navigation]}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <div className="relative h-full w-full">
                            {/* Card label overlay */}
                            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                                <span className="text-xs font-medium text-white/90">{image.alt}</span>
                            </div>
                            <img
                                className="h-full w-full object-cover"
                                src={image.src}
                                alt={image.alt}
                            />
                        </div>
                    </SwiperSlide>
                ))}
                {showNavigation && (
                    <div>
                        <div className="swiper-button-next after:hidden">
                            <div className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors">
                                <ChevronRightIcon className="h-5 w-5 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="swiper-button-prev after:hidden">
                            <div className="w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors">
                                <ChevronLeftIcon className="h-5 w-5 text-primary-foreground" />
                            </div>
                        </div>
                    </div>
                )}
            </Swiper>
        </motion.div>
    );
};

export function ProductPreview() {
    return (
        <section className="relative bg-background py-24 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
                    >
                        <span className="text-primary font-medium text-sm">Workflow Preview</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-foreground mb-6"
                    >
                        A glimpse inside the workflow
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        that moves your videos from idea to impact.
                    </motion.p>
                </div>

                {/* Swiper Card Carousel */}
                <div className="flex items-center justify-center min-h-[600px]">
                    <WorkflowCarousel
                        images={images}
                        loop={true}
                        autoplay={true}
                        showPagination={true}
                        showNavigation={true}
                    />
                </div>

                {/* Interaction hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                </motion.div>
            </div>
        </section>
    );
}

export { WorkflowCarousel };
