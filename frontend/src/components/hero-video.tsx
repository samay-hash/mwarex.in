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
                {!showVideoPopOver && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']"
                    >
                        Click the video to play
                    </motion.span>
                )}
            </div>
            <AnimatePresence>
                {showVideoPopOver && (
                    <VideoPopOver setShowVideoPopOver={setShowVideoPopOver} />
                )}
            </AnimatePresence>
            <motion.div
                layoutId="hero-video-container"
                onMouseMove={handlePointerMove}
                onMouseLeave={() => {
                    opacity.set(0);
                }}
                onClick={() => setShowVideoPopOver(true)}
                className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden cursor-none relative border border-white/10 shadow-2xl bg-black group"
            >
                <motion.div
                    style={{ x, y, opacity }}
                    className="relative z-20 flex w-fit select-none items-center justify-center gap-2 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm text-white font-medium pointer-events-none"
                >
                    <Play className="size-4 fill-white" /> Play Showreel
                </motion.div>

                {/* Preview Video (Paused) */}
                <video
                    muted
                    playsInline
                    loop
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 will-change-transform group-hover:scale-105 transform"
                >
                    <source src="/assets/demo-video.mp4" />
                </video>

                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 hover:opacity-40 transition-opacity duration-500" />
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
