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
    RefreshCw,
    Download,
    Copy,
    Check,
    Zap,
    Target,
    TrendingUp,
    Eye,
    Shield,
    Users,
    Activity,
} from "lucide-react";
import { getUserData, logout, isAuthenticated } from "@/lib/auth";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

export default function AdminAIStudioPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "models" | "analytics" | "moderation">("overview");

    // Demo states
    const [isLoading, setIsLoading] = useState(false);

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

    const tabs = [
        { id: "overview" as const, label: "Overview", icon: BarChart3 },
        { id: "models" as const, label: "AI Models", icon: Sparkles },
        { id: "analytics" as const, label: "Analytics", icon: TrendingUp },
        { id: "moderation" as const, label: "Moderation", icon: Shield },
    ];

    const aiStats = [
        { label: "AI Requests Today", value: "2,451", change: "+12%", icon: Zap, color: "text-primary" },
        { label: "Thumbnails Generated", value: "847", change: "+8%", icon: Image, color: "text-pink-500" },
        { label: "Titles Suggested", value: "1,203", change: "+15%", icon: Type, color: "text-blue-500" },
        { label: "Content Analyzed", value: "401", change: "+5%", icon: Eye, color: "text-emerald-500" },
    ];

    const aiModels = [
        { name: "Thumbnail Generator v2", status: "Active", accuracy: 94, requests: "12K/day" },
        { name: "Title Optimizer", status: "Active", accuracy: 91, requests: "8K/day" },
        { name: "Content Analyzer", status: "Active", accuracy: 88, requests: "4K/day" },
        { name: "Performance Predictor", status: "Beta", accuracy: 85, requests: "2K/day" },
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
                            onClick={() => router.push("/dashboard/admin")}
                            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <MWareXLogo showText={true} size="md" href="/dashboard/admin" />
                        <div className="h-5 w-px bg-border hidden md:block" />
                        <div className="hidden md:flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                                AI Studio Admin
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                    className="mb-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-violet-500/10 border border-amber-500/20 flex items-start gap-3"
                >
                    <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-foreground">Admin AI Studio - Demo Mode</p>
                        <p className="text-xs text-muted-foreground">
                            All statistics and AI model data are simulated for demonstration purposes.
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
                    {/* Overview */}
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {aiStats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-card border border-border rounded-xl p-5"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={cn("p-2 rounded-lg bg-secondary", stat.color)}>
                                                <stat.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
                                        </div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Usage Chart Placeholder */}
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-6">AI Usage Trends</h3>
                                <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
                                    <div className="text-center">
                                        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                        <p className="text-muted-foreground">Chart visualization (Demo)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI Models */}
                    {activeTab === "models" && (
                        <motion.div
                            key="models"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-6">Active AI Models</h3>
                                <div className="space-y-4">
                                    {aiModels.map((model, i) => (
                                        <motion.div
                                            key={model.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{model.name}</p>
                                                    <p className="text-xs text-muted-foreground">{model.requests}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{model.accuracy}%</p>
                                                    <p className="text-xs text-muted-foreground">Accuracy</p>
                                                </div>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    model.status === "Active"
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : "bg-amber-500/10 text-amber-500"
                                                )}>
                                                    {model.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Analytics */}
                    {activeTab === "analytics" && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-semibold mb-4">Top Performing Features</h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Thumbnail Generation", usage: 85 },
                                            { name: "Title Suggestions", usage: 72 },
                                            { name: "Performance Scoring", usage: 58 },
                                            { name: "Content Enhancement", usage: 45 },
                                        ].map((feature) => (
                                            <div key={feature.name}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>{feature.name}</span>
                                                    <span className="text-muted-foreground">{feature.usage}%</span>
                                                </div>
                                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${feature.usage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h3 className="font-semibold mb-4">User Engagement</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Active AI Users", value: "2,341", icon: Users },
                                            { label: "Avg. Session Time", value: "12m 34s", icon: Activity },
                                            { label: "Feature Adoption", value: "78%", icon: TrendingUp },
                                        ].map((metric) => (
                                            <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                                <div className="flex items-center gap-3">
                                                    <metric.icon className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm">{metric.label}</span>
                                                </div>
                                                <span className="font-semibold">{metric.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Moderation */}
                    {activeTab === "moderation" && (
                        <motion.div
                            key="moderation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">AI Content Moderation</h3>
                                        <p className="text-xs text-muted-foreground">Automated safety monitoring</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: "Content Flagged", value: "23", status: "warning" },
                                        { label: "Auto-Blocked", value: "5", status: "error" },
                                        { label: "Approved Today", value: "412", status: "success" },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className={cn(
                                                "p-4 rounded-xl text-center",
                                                stat.status === "warning" && "bg-amber-500/10",
                                                stat.status === "error" && "bg-red-500/10",
                                                stat.status === "success" && "bg-emerald-500/10"
                                            )}
                                        >
                                            <p className={cn(
                                                "text-2xl font-bold",
                                                stat.status === "warning" && "text-amber-500",
                                                stat.status === "error" && "text-red-500",
                                                stat.status === "success" && "text-emerald-500"
                                            )}>{stat.value}</p>
                                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-xl bg-secondary/50">
                                    <p className="text-sm text-muted-foreground text-center">
                                        All moderation data is simulated for demo purposes.
                                        In production, this would show real-time content moderation metrics.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
