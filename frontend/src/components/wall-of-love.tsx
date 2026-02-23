"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Loader2, Quote, User, Briefcase, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { feedbackAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Feedback {
    _id: string;
    name: string;
    role: string;
    rating: number;
    message: string;
    avatarUrl?: string;
    createdAt: string;
}

export function WallOfLove() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const res = await feedbackAPI.getFeedbacks();
            setFeedbacks(res.data.data || res.data);
        } catch (err) {
            console.error("Failed to fetch feedback", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Message is required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const newFeedback = await feedbackAPI.addFeedback({
                name: name.trim() || "",
                role: role.trim() || "",
                rating,
                message: message.trim()
            });
            // Immediately push to local state to show it floating
            setFeedbacks(prev => [newFeedback.data.feedback, ...prev]);

            toast.success("Thank you for your feedback!");
            setName("");
            setRole("");
            setRating(5);
            setMessage("");
        } catch (err) {
            console.error("Failed to submit feedback", err);
            toast.error("Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Splitting feedbacks into columns for a masonry look
    const columns = useMemo(() => {
        const cols: Feedback[][] = [[], [], []];
        feedbacks.forEach((fb, i) => {
            cols[i % 3].push(fb);
        });
        return cols;
    }, [feedbacks]);

    return (
        <section id="wall-of-love" className="relative py-24 md:py-32 overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen opacity-40 translate-x-1/4" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] mix-blend-screen opacity-40 -translate-x-1/4" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                    {/* Left Side: Title & Form */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                                <SparklesIcon className="w-3.5 h-3.5" />
                                <span>Wall of Love</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                                Share your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                                    experience.
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-base max-w-sm">
                                We're building the future of video workflows. Your feedback actively shapes our startup.
                            </p>
                        </motion.div>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            onSubmit={handleSubmit}
                            className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-5"
                        >
                            <div className="space-y-4">
                                {/* Rating */}
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                                        Your Rating
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(null)}
                                                className="p-1 focus:outline-none hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-8 h-8 transition-colors",
                                                        (hoveredStar !== null ? star <= hoveredStar : star <= rating)
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "fill-secondary text-secondary"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name & Role */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground ml-1">Name <span className="text-[10px] opacity-70">(opt)</span></label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-muted-foreground/40"
                                                placeholder="Anonymous"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground ml-1">Role <span className="text-[10px] opacity-70">(opt)</span></label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={e => setRole(e.target.value)}
                                                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-muted-foreground/40"
                                                placeholder="Creator, Dev..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground ml-1 flex justify-between">
                                        <span>Feedback</span>
                                        <span className="text-amber-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
                                        <textarea
                                            required
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            rows={4}
                                            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none placeholder:text-muted-foreground/40"
                                            placeholder="What do you think of MWareX? Share your honest thoughts..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Post on Wall</span>
                                    </>
                                )}
                            </button>
                        </motion.form>
                    </div>

                    {/* Right Side: Masonry Feedback Display */}
                    <div className="lg:col-span-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-border rounded-2xl bg-secondary/20 backdrop-blur-sm">
                                <Quote className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-foreground">No feedback yet</h3>
                                <p className="text-muted-foreground text-sm mt-1 max-w-sm">Be the first to share your thoughts and see them float on this wall immediately!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {columns.map((col, colIdx) => (
                                    <div key={colIdx} className="flex flex-col gap-4">
                                        <AnimatePresence>
                                            {col.map((fb, idx) => (
                                                <motion.div
                                                    key={fb._id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ type: "spring", damping: 20, stiffness: 100, delay: Math.min(idx * 0.05, 0.5) }}
                                                    className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-300 relative group"
                                                >
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <Quote className="w-12 h-12 rotate-180" />
                                                    </div>
                                                    <div className="flex items-center gap-1 mb-3">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={cn(
                                                                    "w-3.5 h-3.5",
                                                                    i < fb.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted/30"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-foreground/90 mb-6 italic relative z-10">
                                                        "{fb.message}"
                                                    </p>
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex flex-shrink-0 items-center justify-center text-amber-500 font-bold text-xs ring-1 ring-amber-500/20">
                                                            {fb.name ? fb.name[0].toUpperCase() : "A"}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold truncate text-foreground">{fb.name || "Anonymous"}</p>
                                                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">{fb.role || "Guest"}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path d="M12 0C12 0 12 7.5 17 12C12 16.5 12 24 12 24C12 24 12 16.5 7 12C12 7.5 12 0 12 0Z" />
        </svg>
    );
}
