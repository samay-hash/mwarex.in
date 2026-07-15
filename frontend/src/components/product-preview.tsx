"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { AnimatedList } from "./ui/animated-list";
import { Globe } from "./ui/globe";
import { WheelPicker, WheelPickerWrapper } from "./wheel-picker";

import { cn } from "@/lib/utils";
import { Server } from "lucide-react";

const PIPELINE_EVENTS = [
  {
    name: "Upload Complete",
    description: "14.2 GB Raw Footage Ingested",
    time: "2m ago",
    icon: "☁️",
    color: "#C8A97E",
  },
  {
    name: "AI Extraction",
    description: "Llama 3.3 found 12 viral hooks",
    time: "8m ago",
    icon: "⚡",
    color: "#C8A97E",
  },
  {
    name: "Competitor Analysis",
    description: "Analyzed 45 trending videos",
    time: "15m ago",
    icon: "🧠",
    color: "#C8A97E",
  },
  {
    name: "Render Complete",
    description: "Exported 1080p vertical shorts",
    time: "32m ago",
    icon: "🎬",
    color: "#C8A97E",
  },
  {
    name: "Published",
    description: "Successfully pushed to YouTube",
    time: "1h ago",
    icon: "✅",
    color: "#C8A97E",
  },
];

function NotificationCard({ name, description, icon, color, time }: any) {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full cursor-pointer overflow-hidden rounded-2xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-neutral-900/80 border border-white/5 shadow-2xl"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex min-w-0 flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center gap-1 text-sm font-semibold text-white">
            <span className="truncate">{name}</span>
            <span className="text-neutral-500">·</span>
            <span className="shrink-0 text-[11px] font-medium text-neutral-400">
              {time}
            </span>
          </figcaption>
          <p className="truncate text-xs font-medium text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedTime, setSelectedTime] = useState({
    hours: "0",
    minutes: "0",
    seconds: "45",
  });

  const hoursOptions = Array.from({ length: 24 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));
  const minutesOptions = Array.from({ length: 60 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));
  const secondsOptions = Array.from({ length: 60 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));

  const globeConfig = useMemo(
    () => ({
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.2, 0.2, 0.2],
      markers: [],
    }),
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
            src="/bg-images/10037.jpg" 
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 md:opacity-[0.15]"
            style={{
                maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
            }}
        />
        <div className="absolute inset-0 bg-[#111111]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-[#C8A97E] text-[10px] font-bold tracking-[0.25em] mb-8 uppercase"
            >
                <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
                Why MWareX Succeeds
                <span className="w-8 h-[1px] bg-[#C8A97E] opacity-50"></span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#ffffff] font-normal leading-tight tracking-tight mb-6"
            >
                The Autonomous <span className="italic text-[#C8A97E]">Content Engine.</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-white/40 text-[15px] max-w-2xl mx-auto font-light leading-relaxed"
            >
                We eliminate the chaos of using 5 different scattered apps by bringing file storage, AI editing, secure communication, and publishing into a single autonomous engine.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 mt-10 w-full gap-5 sm:mt-16 md:grid-cols-3">
          {/* First Box */}
          <div className="bg-neutral-900/20 border overflow-hidden flex flex-col h-full rounded-[2rem] border-white/5 items-start justify-start backdrop-blur-sm">
            <div className="h-48 w-full bg-neutral-800/20 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('/bg-images/10071.jpg')] bg-cover bg-center opacity-30 mix-blend-screen" />
               <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent" />
               <div className="z-10 text-white flex gap-2 items-center text-xl font-medium tracking-tight">
                   <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                   Processing...
               </div>
            </div>
            <div className="px-8 py-8 flex-1">
              <div>
                <div className="[&_h3]:leading-[1.18]">
                  <h3 className="text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                    <span className="block text-[#C8A97E]">Autonomous</span>
                    <span className="block text-white">Editor Engine</span>
                  </h3>
                </div>

                <p className="mt-4 max-w-[360px] text-[14px] font-medium leading-[1.6] text-neutral-400 sm:text-[15px]">
                  Instantly cuts and stitches your video. What used to take days of manual editing now takes minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Second Box */}
          <div className="col-span-1 md:col-span-2 flex h-auto min-h-[420px] md:h-[400px] items-center justify-center rounded-[2rem] bg-neutral-900/20 border border-white/5 px-4 py-8 sm:px-10 backdrop-blur-sm">
            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-[320px] text-left">
                <div className="[&_h3]:leading-[1.18]">
                  <h3 className="text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                    <span className="block text-[#C8A97E]">Precise Control </span>
                    <span className="block text-white">
                      Target Durations.
                    </span>
                  </h3>
                </div>

                <p className="mt-4 text-[14px] font-medium leading-[1.6] text-neutral-400 sm:text-[15px]">
                  Tell the AI exactly how long your viral shorts should be. Set your target duration and let the engine extract the best moments.
                </p>
              </div>

              <div className="w-full max-w-[520px]">
                <div className="flex items-center justify-center gap-2 sm:gap-6">
                  <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-neutral-950/40 px-2 py-3 sm:px-3 sm:py-4 border border-white/5 shadow-2xl">
                    <span className="mb-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      Hours
                    </span>
                    <WheelPickerWrapper className="w-16 sm:w-24">
                      <WheelPicker
                        options={hoursOptions}
                        value={selectedTime.hours}
                        onValueChange={(value: string) =>
                          setSelectedTime((prev) => ({
                            ...prev,
                            hours: value,
                          }))
                        }
                      />
                    </WheelPickerWrapper>
                  </div>

                  <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-neutral-950/40 px-2 py-3 sm:px-3 sm:py-4 border border-white/5 shadow-2xl">
                    <span className="mb-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      Min
                    </span>
                    <WheelPickerWrapper className="w-16 sm:w-24">
                      <WheelPicker
                        options={minutesOptions}
                        value={selectedTime.minutes}
                        onValueChange={(value: string) =>
                          setSelectedTime((prev) => ({
                            ...prev,
                            minutes: value,
                          }))
                        }
                      />
                    </WheelPickerWrapper>
                  </div>

                  <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-neutral-950/40 px-2 py-3 sm:px-3 sm:py-4 border border-white/5 shadow-2xl">
                    <span className="mb-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      Sec
                    </span>
                    <WheelPickerWrapper className="w-16 sm:w-24">
                      <WheelPicker
                        options={secondsOptions}
                        value={selectedTime.seconds}
                        onValueChange={(value: string) =>
                          setSelectedTime((prev) => ({
                            ...prev,
                            seconds: value,
                          }))
                        }
                      />
                    </WheelPickerWrapper>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 text-center">
                  <button className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors">
                    Set Constraint
                  </button>
                  <p className="text-sm font-medium text-neutral-500 mt-2">
                    Llama 3.3 will optimize for this duration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third — Cloud Pipeline Engine */}
          <div className="flex min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/20 px-6 py-8 sm:px-10 sm:py-10 backdrop-blur-sm relative group">
            <div className="[&_h3]:leading-[1.18] relative z-10">
              <h3 className="max-w-xs text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                <span className="block text-[#C8A97E]">
                  Zero-Loss Cloud
                </span>
                <span className="block text-white">Rendering</span>
              </h3>
            </div>

            <p className="mt-4 max-w-[360px] text-[14px] font-medium leading-[1.6] text-neutral-400 sm:text-[15px] relative z-10">
              Raw footage is processed entirely on our secure servers. No local rendering, no quality compression.
            </p>
            
            {/* Elegant Static Graphic */}
            <div className="absolute bottom-0 right-0 left-0 h-48 flex items-center justify-center overflow-hidden pointer-events-none">
               
               {/* Main Icon Container */}
               <div className="relative z-10 w-20 h-20 bg-[#111111]/80 backdrop-blur-md rounded-2xl border border-[#C8A97E]/30 flex items-center justify-center">
                 <Server className="w-8 h-8 text-[#C8A97E]" />
                 {/* Processing Dots */}
                 <div className="absolute bottom-3 flex gap-1">
                   <div className="w-1 h-1 bg-[#C8A97E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-1 h-1 bg-[#C8A97E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-1 h-1 bg-[#C8A97E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
               
               {/* Decorative Data Lines */}
               <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#C8A97E]/10 to-transparent left-1/3" />
               <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#C8A97E]/10 to-transparent right-1/3" />
               <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#C8A97E]/10 to-transparent left-1/4" />
               <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#C8A97E]/10 to-transparent right-1/4" />
            </div>
          </div>

          {/* Fourth — Live activity feed */}
          <div className="flex h-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/20 px-6 py-8 sm:px-10 backdrop-blur-sm relative group">
            <div className="[&_h3]:leading-[1.18] relative z-10">
              <h3 className="max-w-xs text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                <span className="block text-[#C8A97E]">
                  AI Activity Feed
                </span>
              </h3>
            </div>

            <p className="mt-4 max-w-[360px] text-[14px] font-medium leading-[1.6] text-neutral-400 sm:text-[15px] relative z-10">
              Get instant feedback on extraction completions, rendering milestones, and API publishes.
            </p>

            <div className="relative mt-8 min-h-0 flex-1 overflow-hidden z-0">
              <AnimatedList delay={2500} className="gap-3">
                {Array.from({ length: 8 }, () => PIPELINE_EVENTS)
                  .flat()
                  .map((item, idx) => (
                    <NotificationCard {...item} key={idx} />
                  ))}
              </AnimatedList>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
            </div>
          </div>

          {/* Fifth — Global Intelligence */}
          <div className="flex min-h-[380px] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/20 px-6 py-8 sm:px-10 backdrop-blur-sm relative group">
            <div className="relative z-20 [&_h3]:leading-[1.18]">
              <h3 className="max-w-xs text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-white sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                <span className="block text-[#C8A97E]">
                  Global Intelligence
                </span>
              </h3>
            </div>

            <p className="relative z-20 mt-4 max-w-[360px] text-[14px] font-medium leading-[1.6] text-neutral-400 sm:text-[15px]">
              Our real-time AI strategist tracks viral trends and competitor intelligence worldwide.
            </p>

            <div className="relative mt-4 min-h-0 flex-1 z-10">
              <Globe
                className="top-6 left-1/2 max-w-none -translate-x-1/2 scale-[1.2] opacity-80"
                config={globeConfig}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.4),transparent_65%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
