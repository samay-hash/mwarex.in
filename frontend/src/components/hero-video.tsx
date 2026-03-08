"use client";

import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Play, Plus } from "lucide-react";
import {
    MediaControlBar,
    MediaController,
    MediaMuteButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaTimeDisplay,
    MediaTimeRange,
    MediaVolumeRange,
} from "media-chrome/react";
import type { ComponentProps } from "react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
    <MediaController
        style={{
            ...style,
        }}
        {...props}
    />
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => (
    <MediaControlBar {...props} />
);

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
    className,
    ...props
}: VideoPlayerTimeRangeProps) => (
    <MediaTimeRange
        className={cn(
            "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
            className,
        )}
        {...props}
    />
);

export type VideoPlayerTimeDisplayProps = ComponentProps<
    typeof MediaTimeDisplay
>;

export const VideoPlayerTimeDisplay = ({
    className,
    ...props
}: VideoPlayerTimeDisplayProps) => (
    <MediaTimeDisplay className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerVolumeRangeProps = ComponentProps<
    typeof MediaVolumeRange
>;

export const VideoPlayerVolumeRange = ({
    className,
    ...props
}: VideoPlayerVolumeRangeProps) => (
    <MediaVolumeRange className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
    className,
    ...props
}: VideoPlayerPlayButtonProps) => (
    <MediaPlayButton className={cn("", className)} {...props} />
);

export type VideoPlayerSeekBackwardButtonProps = ComponentProps<
    typeof MediaSeekBackwardButton
>;

export const VideoPlayerSeekBackwardButton = ({
    className,
    ...props
}: VideoPlayerSeekBackwardButtonProps) => (
    <MediaSeekBackwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerSeekForwardButtonProps = ComponentProps<
    typeof MediaSeekForwardButton
>;

export const VideoPlayerSeekForwardButton = ({
    className,
    ...props
}: VideoPlayerSeekForwardButtonProps) => (
    <MediaSeekForwardButton className={cn("p-2.5", className)} {...props} />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
    className,
    ...props
}: VideoPlayerMuteButtonProps) => (
    <MediaMuteButton className={cn("", className)} {...props} />
);

export type VideoPlayerContentProps = ComponentProps<"video">;

export const VideoPlayerContent = ({
    className,
    ...props
}: VideoPlayerContentProps) => (
    <video className={cn("mb-0 mt-0", className)} {...props} />
);

export const HeroVideo = () => {
    const [showVideoPopOver, setShowVideoPopOver] = useState(false);

    const SPRING = {
        stiffness: 150,
        damping: 20,
        mass: 1,
    };

    const x = useSpring(0, SPRING);
    const y = useSpring(0, SPRING);
    const opacity = useSpring(0, SPRING);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        opacity.set(1);
        const bounds = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - bounds.left);
        y.set(e.clientY - bounds.top);
    };

    return (
        <div className="relative flex h-full w-full items-center justify-center bg-transparent py-10">
            <div className="absolute top-0 grid content-start justify-items-center gap-6 text-center z-10 w-full pointer-events-none">
            </div>
            <AnimatePresence>
                {showVideoPopOver && (
                    <VideoPopOver setShowVideoPopOver={setShowVideoPopOver} />
                )}
            </AnimatePresence>
            <motion.div
                layoutId="hero-video-container"
                onMouseMove={handlePointerMove}
                onMouseLeave={() => opacity.set(0)}
                onClick={() => setShowVideoPopOver(true)}
                className="w-full max-w-sm aspect-video sm:aspect-auto sm:h-[250px] rounded-2xl overflow-hidden cursor-pointer relative border border-white/10 shadow-[0_0_50px_rgba(200,169,126,0.05)] bg-[#111111]/80 backdrop-blur-md group flex items-center justify-center transition-all duration-700 hover:border-[#C8A97E]/30 hover:bg-[#151515]"
            >
                {/* Subtle continuous border reflection effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                {/* Animated Gradient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#C8A97E]/20 blur-[50px] rounded-full group-hover:bg-[#C8A97E]/40 transition-colors duration-700"></div>

                <div className="relative z-20 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 group-hover:border-[#C8A97E]/50 group-hover:bg-[#C8A97E]/10 transition-all duration-500 shadow-xl">
                        <Play className="size-6 fill-white text-white group-hover:fill-[#C8A97E] group-hover:text-[#C8A97E] transition-colors duration-500 ml-1" />
                    </div>
                    <div>
                        <span className="block text-white text-sm font-serif mb-1 group-hover:text-[#C8A97E] transition-colors duration-500">Play Video</span>
                        <span className="block text-[10px] text-white/40 uppercase tracking-[0.2em]">Platform Tour · 1m 20s</span>
                    </div>
                </div>

                {/* Grid Pattern Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)] mix-blend-overlay pointer-events-none"></div>
            </motion.div>
        </div>
    );
};

const VideoPopOver = ({
    setShowVideoPopOver,
}: {
    setShowVideoPopOver: (showVideoPopOver: boolean) => void;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-6"
        >
            <div
                className="absolute inset-0"
                onClick={() => setShowVideoPopOver(false)}
            />
            <motion.div
                layoutId="hero-video-container"
                className="relative w-full max-w-7xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-[101] bg-black"
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 30
                }}
            >
                <VideoPlayer style={{ width: "100%", height: "100%" }}>
                    <VideoPlayerContent
                        src="/assets/demo-video.mp4"
                        autoPlay
                        slot="media"
                        className="w-full h-full object-cover"
                        style={{ width: "100%", height: "100%" }}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowVideoPopOver(false);
                        }}
                        className="absolute right-6 top-6 z-50 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors backdrop-blur-md border border-white/10"
                    >
                        <Plus className="size-6 rotate-45" />
                    </button>

                    <VideoPlayerControlBar className="absolute bottom-0 left-0 w-full p-6 flex items-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20">
                        <VideoPlayerPlayButton className="text-white hover:text-primary transition-colors" />
                        <VideoPlayerTimeRange className="flex-1" />
                        <div className="flex items-center gap-4">
                            <VideoPlayerMuteButton className="text-white hover:text-primary transition-colors" />
                            <VideoPlayerVolumeRange className="w-24 hidden sm:block" />
                        </div>
                    </VideoPlayerControlBar>
                </VideoPlayer>
            </motion.div>
        </motion.div>
    );
};
