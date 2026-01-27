"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    Image,
    Type,
    Wand2,
    BarChart3,
    Play,
    Loader2,
    ArrowLeft,
    LogOut,
    Info,
    RefreshCw,
    Download,
    Copy,
    Check,
    Zap,
    Target,
    TrendingUp,
    Eye,
} from "lucide-react";
import { getUserData, logout, isAuthenticated } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

export default function AIStudioPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<"thumbnail" | "titles" | "enhance" | "score">("thumbnail");

    // Demo states
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
    const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
    const [performanceScore, setPerformanceScore] = useState<number | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/auth/signin");
            return;
        }
        const data = getUserData();
        setUserData(data);
        setTimeout(() => setPageLoaded(true), 100);
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Simulated AI generation functions
    const generateThumbnails = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedThumbnails([
                "thumbnail-preview-1",
                "thumbnail-preview-2",
                "thumbnail-preview-3",
                "thumbnail-preview-4",
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    const generateTitles = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedTitles([
                "10 Mind-Blowing Tips That Changed My Life Forever",
                "You Won't Believe What Happened Next...",
                "The Ultimate Guide to [Your Topic] in 2024",
                "I Tried This For 30 Days - Here's What Happened",
                "Why Everyone Is Wrong About [Topic]",
            ]);
            setIsGenerating(false);
        }, 1500);
    };

    const analyzePerformance = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setPerformanceScore(Math.floor(Math.random() * 30) + 70);
            setIsGenerating(false);
        }, 2500);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const tabs = [
        { id: "thumbnail" as const, label: "Thumbnails", icon: Image },
        { id: "titles" as const, label: "Titles", icon: Type },
        { id: "enhance" as const, label: "Enhance", icon: Wand2 },
        { id: "score" as const, label: "Score", icon: BarChart3 },
    ];

    if (!pageLoaded) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MWareXLogo showText={false} size="lg" />
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Loading AI Studio...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard/editor")}
                            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <MWareXLogo showText={true} size="md" href="/dashboard/editor" />
                        <div className="h-5 w-px bg-border hidden md:block" />
                        <div className="hidden md:flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                                AI Studio
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
                {/* Demo Mode Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/10 border border-primary/20 flex items-start gap-3"
                >
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-foreground">AI Studio - Preview Mode</p>
                        <p className="text-xs text-muted-foreground">
                            All AI outputs are simulated for demonstration. In production, these would use real AI models.
                        </p>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Content Sections */}
                <AnimatePresence mode="wait">
                    {/* Thumbnail Generation */}
                    {activeTab === "thumbnail" && (
                        <motion.div
                            key="thumbnail"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center">
                                            <Image className="w-6 h-6 text-pink-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">AI Thumbnail Generator</h2>
                                            <p className="text-sm text-muted-foreground">Create eye-catching thumbnails</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={generateThumbnails}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-4 h-4" />
                                        )}
                                        Generate
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                                        <label className="block text-sm font-medium mb-2">Video Topic / Description</label>
                                        <textarea
                                            placeholder="Describe your video content for better thumbnail suggestions..."
                                            className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {generatedThumbnails.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {generatedThumbnails.map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 via-violet-500/20 to-pink-500/20 border border-border flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden"
                                                >
                                                    <div className="text-center">
                                                        <Play className="w-8 h-8 text-primary mx-auto mb-2" />
                                                        <span className="text-xs text-muted-foreground">Preview {i + 1}</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button className="p-2 bg-background rounded-lg">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 bg-background rounded-lg">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Title Suggestions */}
                    {activeTab === "titles" && (
                        <motion.div
                            key="titles"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                            <Type className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Title & Description AI</h2>
                                            <p className="text-sm text-muted-foreground">Generate engaging titles</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={generateTitles}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Wand2 className="w-4 h-4" />
                                        )}
                                        Suggest Titles
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                                        <label className="block text-sm font-medium mb-2">Video Keywords</label>
                                        <input
                                            type="text"
                                            placeholder="Enter keywords: productivity, morning routine, tips..."
                                            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    {generatedTitles.length > 0 && (
                                        <div className="space-y-3">
                                            {generatedTitles.map((title, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                                                >
                                                    <span className="text-sm font-medium">{title}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(title)}
                                                        className="p-2 rounded-lg hover:bg-background transition-colors"
                                                    >
                                                        {copied === title ? (
                                                            <Check className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Content Enhancement */}
                    {activeTab === "enhance" && (
                        <motion.div
                            key="enhance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                                        <Wand2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Content Enhancement Preview</h2>
                                        <p className="text-sm text-muted-foreground">AI-powered improvements</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { title: "Auto Color Correction", icon: Zap, status: "Available" },
                                        { title: "Audio Enhancement", icon: Target, status: "Available" },
                                        { title: "Smart Cropping", icon: Image, status: "Coming Soon" },
                                        { title: "Caption Generation", icon: Type, status: "Available" },
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-5 rounded-xl bg-secondary/50 border border-border"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <feature.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <span className={cn(
                                                    "text-xs font-medium px-2 py-1 rounded-full",
                                                    feature.status === "Available"
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-muted text-muted-foreground"
                                                )}>
                                                    {feature.status}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                                            <p className="text-xs text-muted-foreground">
                                                Preview only in demo mode
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Performance Score */}
                    {activeTab === "score" && (
                        <motion.div
                            key="score"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Performance & Readiness Score</h2>
                                            <p className="text-sm text-muted-foreground">Analyze your video's potential</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={analyzePerformance}
                                        disabled={isGenerating}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4" />
                                        )}
                                        Analyze
                                    </button>
                                </div>

                                {performanceScore !== null ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
                                            <svg className="w-40 h-40 transform -rotate-90">
                                                <circle
                                                    className="text-muted"
                                                    strokeWidth="8"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="62"
                                                    cx="80"
                                                    cy="80"
                                                />
                                                <circle
                                                    className={cn(
                                                        performanceScore >= 80 ? "text-emerald-500" :
                                                            performanceScore >= 60 ? "text-amber-500" : "text-red-500"
                                                    )}
                                                    strokeWidth="8"
                                                    strokeDasharray={`${performanceScore * 3.9} 390`}
                                                    strokeLinecap="round"
                                                    stroke="currentColor"
                                                    fill="transparent"
                                                    r="62"
                                                    cx="80"
                                                    cy="80"
                                                />
                                            </svg>
                                            <span className="absolute text-4xl font-bold">{performanceScore}</span>
                                        </div>
                                        <p className="text-lg font-semibold text-foreground mb-2">
                                            {performanceScore >= 80 ? "Excellent!" : performanceScore >= 60 ? "Good" : "Needs Work"}
                                        </p>
                                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                            Your video is {performanceScore >= 80 ? "ready for upload" : "almost ready"}.
                                            Score is simulated for demo purposes.
                                        </p>

                                        <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg mx-auto">
                                            {[
                                                { label: "Title Score", value: Math.floor(performanceScore * 0.95) },
                                                { label: "Thumbnail", value: Math.floor(performanceScore * 1.02) },
                                                { label: "Description", value: Math.floor(performanceScore * 0.88) },
                                            ].map((item) => (
                                                <div key={item.label} className="p-4 rounded-xl bg-secondary/50">
                                                    <p className="text-2xl font-bold text-primary">{Math.min(item.value, 100)}</p>
                                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-16">
                                        <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                        <p className="text-muted-foreground">Click "Analyze" to check your video's readiness</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
