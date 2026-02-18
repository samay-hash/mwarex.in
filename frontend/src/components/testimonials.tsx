"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Reduced to 4 key testimonials for a premium, focused look
const testimonials = [
    {
        quote: "mWareX completely removed the bottleneck of downloading 50GB files just to review them. It's a game changer for our entire editing workflow.",
        name: "Alex Hormozi (Parody)",
        role: "Content Creator",
        initials: "AH",
        image: "https://avatar.vercel.sh/alex",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        quote: "Direct publishing to YouTube API saves us about 4 hours per week per channel. Essential for scale when managing multiple channels.",
        name: "Ali Abdaal (Parody)",
        role: "YouTuber",
        initials: "AA",
        image: "https://avatar.vercel.sh/ali",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        quote: "The version control for video edits is a lifesaver. No more 'Final_Final_v3.mp4' confusion.",
        name: "EditStation",
        role: "Post-Production House",
        initials: "ES",
        image: "https://avatar.vercel.sh/editstation",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        quote: "Simple, intuitive, and powerful. My editors love the streamlined review process.",
        name: "Marcus B. (Parody)",
        role: "Tech Reviewer",
        initials: "MB",
        image: "https://avatar.vercel.sh/marcus",
        gradient: "from-orange-500 to-amber-500",
    },
];

export function Testimonials() {
    return (
        <section className="py-24 relative bg-background overflow-hidden" id="testimonials">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] opacity-50 mask-gradient" />

            {/* Soft gradient blur */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/80 to-background dark:from-transparent dark:via-black/80 dark:to-black" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-8"
                    >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-zinc-600 dark:text-zinc-300 font-medium text-xs tracking-wide">
                            Wall of Love
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6"
                    >
                        Trusted by the{" "}
                        <span className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500">
                            best.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto"
                    >
                        Join thousands of creators who rely on mWareX to streamline their production.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} t={t} i={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ t, i }: { t: typeof testimonials[0], i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className="group relative h-full cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiNGNTlFMEIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
        >
            <div className="relative h-full flex flex-col justify-between p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">

                {/* Subtle Gradient Glow on Hover (Top) */}
                <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl", t.gradient)} />

                {/* Content */}
                <div>
                    {/* Quote Mark */}
                    <div className="mb-6 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-zinc-300 dark:text-zinc-700">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                        </svg>
                    </div>

                    <p className="text-lg md:text-xl font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors duration-300">
                        "{t.quote}"
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4">
                    <div className={cn("relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br shadow-md", t.gradient)}>
                        {t.initials}
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">{t.name}</h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wide opacity-80">{t.role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
