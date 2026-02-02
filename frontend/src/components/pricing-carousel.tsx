"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { cn } from "@/lib/utils";

/**
 * Reusable animated carousel component for pricing or content cards.
 * Uses Swiper with a creative effect.
 */
interface CarouselProps {
    children: React.ReactNode[];
    className?: string;
    showPagination?: boolean;
    showNavigation?: boolean;
    loop?: boolean;
    autoplay?: boolean;
    spaceBetween?: number;
}

export const PricingCarousel = ({
    children,
    className,
    showPagination = true,
    showNavigation = false,
    loop = false,
    autoplay = false,
    spaceBetween = 20,
}: CarouselProps) => {
    // Custom styles for Swiper
    const css = `
  .PricingCarouselSwiper {
    width: 100%;
    /* Allow height to be determined by content, but giving a min-height for safety */
    min-height: 500px; 
    padding-bottom: 50px !important;
    padding-top: 20px !important;
  }
  
  /* Make slides equal height if possible, or center them */
  .PricingCarouselSwiper .swiper-slide {
    display: flex;
    justify-content: center;
    height: auto; /* Let content dictate height */
    width: 320px; /* Base width for mobile slides */
  }

  /* Responsive width for larger screens if this is ever used elsewhere, 
     but for this pricing carousel we likely want a specific card width */
  @media (min-width: 640px) {
    .PricingCarouselSwiper .swiper-slide {
      width: 380px; 
    }
  }

  .PricingCarouselSwiper .swiper-pagination-bullet {
    background-color: var(--primary) !important;
    opacity: 0.5;
  }

  .PricingCarouselSwiper .swiper-pagination-bullet-active {
    background-color: var(--primary) !important;
    opacity: 1;
    width: 20px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  `;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn("w-full max-w-[1200px] mx-auto relative", className)}
        >
            <style>{css}</style>

            <Swiper
                spaceBetween={spaceBetween}
                autoplay={
                    autoplay
                        ? {
                            delay: 3000,
                            disableOnInteraction: true,
                        }
                        : false
                }
                effect="creative"
                grabCursor={true}
                slidesPerView="auto"
                centeredSlides={true}
                initialSlide={1} // Start with the middle slide (Pro plan usually)
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
                className="PricingCarouselSwiper"
                creativeEffect={{
                    limitProgress: 2, // Limit effect to nearby slides
                    prev: {
                        shadow: true,
                        translate: ["-120%", 0, -500],
                        rotate: [0, 0, -10],
                        scale: 0.9,
                    },
                    next: {
                        shadow: true,
                        translate: ["120%", 0, -500],
                        rotate: [0, 0, 10],
                        scale: 0.9,
                    },
                }}
                modules={[EffectCreative, Pagination, Autoplay]}
            >
                {children.map((child, index) => (
                    <SwiperSlide key={index}>
                        {child}
                    </SwiperSlide>
                ))}

                {showNavigation && (
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none flex justify-between px-2">
                        {/* Navigation custom buttons could go here */}
                    </div>
                )}
            </Swiper>
        </motion.div>
    );
};
