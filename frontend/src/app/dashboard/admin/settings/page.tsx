"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Settings,
    Sparkles,
    Shield,
    Bell,
    Palette,
    Globe,
    Lock,
    ChevronRight,
    LogOut,
    ArrowLeft,
    Info,
    Loader2,
    Database,
    Zap,
    Users,
    Activity,
} from "lucide-react";
import { getUserData, logout, isAuthenticated } from "@/lib/auth";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ id?: string; name?: string; email?: string } | null>(null);
    const [pageLoaded, setPageLoaded] = useState(false);

    // Settings state
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(true);
    const [moderationLevel, setModerationLevel] = useState("medium");
    const [autoBackup, setAutoBackup] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [rateLimiting, setRateLimiting] = useState(true);

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
                        <span className="text-sm text-muted-foreground">Loading admin settings...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
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
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-semibold">Admin Settings</span>
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

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* Demo Mode Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3"
                >
                    <Shield className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-foreground">Admin Demo Mode</p>
                        <p className="text-xs text-muted-foreground">
                            All settings are simulated. In production, changes here would affect the entire platform.
                        </p>
                    </div>
                </motion.div>

                {/* System Controls Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">System Controls</h2>
                            <p className="text-xs text-muted-foreground">Critical platform settings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                            <div>
                                <p className="font-medium text-red-500">Maintenance Mode</p>
                                <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Rate Limiting</p>
                                <p className="text-sm text-muted-foreground">Protect API from abuse</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rateLimiting}
                                    onChange={(e) => setRateLimiting(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* AI Platform Settings */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">AI Platform Settings</h2>
                            <p className="text-xs text-muted-foreground">Configure AI features globally</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">AI Features Enabled</p>
                                <p className="text-sm text-muted-foreground">Enable AI tools for all users</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={aiEnabled}
                                    onChange={(e) => setAiEnabled(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* Content Moderation */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Content Moderation Thresholds</h2>
                            <p className="text-xs text-muted-foreground">Global safety settings</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/50">
                        <label className="block font-medium mb-3">Platform Moderation Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: "low", label: "Permissive", desc: "Minimal auto-blocks" },
                                { value: "medium", label: "Balanced", desc: "Standard filtering" },
                                { value: "high", label: "Strict", desc: "Aggressive moderation" },
                            ].map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setModerationLevel(level.value)}
                                    className={cn(
                                        "py-3 px-4 rounded-xl border text-sm transition-all text-left",
                                        moderationLevel === level.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:border-primary/50"
                                    )}
                                >
                                    <p className="font-medium">{level.label}</p>
                                    <p className={cn(
                                        "text-xs mt-0.5",
                                        moderationLevel === level.value ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>{level.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Database & Backup */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Database className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Database & Backup</h2>
                            <p className="text-xs text-muted-foreground">Data management settings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Auto Backup</p>
                                <p className="text-sm text-muted-foreground">Daily automated backups</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoBackup}
                                    onChange={(e) => setAutoBackup(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="font-medium mb-2">Database Status</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm text-muted-foreground">Healthy - Last backup: 2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Notifications */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Admin Notifications</h2>
                            <p className="text-xs text-muted-foreground">Alert preferences</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div>
                            <p className="font-medium">Email Alerts</p>
                            <p className="text-sm text-muted-foreground">System alerts to admin emails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </motion.section>

                {/* API Integrations */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Platform & API Integrations</h2>
                            <p className="text-xs text-muted-foreground">Connected services</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { name: "YouTube Data API", status: "Active", connected: true },
                            { name: "MongoDB Atlas", status: "Connected", connected: true },
                            { name: "Cloudinary", status: "Connected", connected: true },
                            { name: "SendGrid Email", status: "Demo Mode", connected: false },
                        ].map((integration) => (
                            <div
                                key={integration.name}
                                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        integration.connected ? "bg-emerald-500" : "bg-muted-foreground"
                                    )} />
                                    <div>
                                        <p className="font-medium">{integration.name}</p>
                                        <p className="text-xs text-muted-foreground">{integration.status}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
