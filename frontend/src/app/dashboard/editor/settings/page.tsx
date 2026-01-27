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
} from "lucide-react";
import { getUserData, logout, isAuthenticated } from "@/lib/auth";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

export default function EditorSettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ id?: string; name?: string; email?: string } | null>(null);

    const [pageLoaded, setPageLoaded] = useState(false);
    const [saving, setSaving] = useState(false);

    // Unified settings state
    const [settings, setSettings] = useState({
        aiAutoSuggest: true,
        aiThumbnailGen: true,
        contentModeration: "medium",
        defaultStyle: "modern",
        emailNotifications: true,
        pushNotifications: false,
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/auth/signin");
            return;
        }

        // Fetch real settings
        const fetchUserData = async () => {
            try {
                const res = await userAPI.getMe();
                setUserData(res.data);
                if (res.data.settings) {
                    setSettings(prev => ({ ...prev, ...res.data.settings }));
                }
            } catch (error) {
                console.error("Failed to load settings", error);
                toast.error("Failed to load settings");
            } finally {
                setPageLoaded(true);
            }
        };

        fetchUserData();
    }, [router]);

    const handleSettingChange = async (key: string, value: any) => {
        // Optimistic update
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        setSaving(true);

        try {
            await userAPI.updateSettings(newSettings);
            // Optional: toast.success("Saved"); - keeping it subtle
        } catch (error) {
            console.error("Failed to save setting", error);
            toast.error("Failed to save changes");
            // Revert on failure could be added here
        } finally {
            setSaving(false);
        }
    };

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
                        <span className="text-sm text-muted-foreground">Loading settings...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ... Header ... */}
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
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
                            <div className="p-1.5 bg-secondary rounded-lg">
                                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-semibold">Settings</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {saving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
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

            <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
                {/* ... Demo Notice ... */}

                {/* AI Preferences Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">AI Preferences</h2>
                            <p className="text-xs text-muted-foreground">Configure AI-powered features</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Auto-Suggest Titles</p>
                                <p className="text-sm text-muted-foreground">AI suggests titles based on video content</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.aiAutoSuggest}
                                    onChange={(e) => handleSettingChange('aiAutoSuggest', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Thumbnail Generation</p>
                                <p className="text-sm text-muted-foreground">Generate thumbnail suggestions using AI</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.aiThumbnailGen}
                                    onChange={(e) => handleSettingChange('aiThumbnailGen', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* Branding & Style Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Default Styles & Branding</h2>
                            <p className="text-xs text-muted-foreground">Set your default preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <label className="block font-medium mb-3">Default Video Style</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["modern", "classic", "minimal"].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => handleSettingChange('defaultStyle', style)}
                                        className={cn(
                                            "py-3 px-4 rounded-xl border text-sm font-medium transition-all capitalize",
                                            settings.defaultStyle === style
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background border-border hover:border-primary/50"
                                        )}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Safety & Moderation Section */}
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
                            <h2 className="text-lg font-semibold">Safety & Content Moderation</h2>
                            <p className="text-xs text-muted-foreground">Control content safety thresholds</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/50">
                        <label className="block font-medium mb-3">Content Moderation Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: "low", label: "Low", desc: "Minimal checks" },
                                { value: "medium", label: "Medium", desc: "Balanced" },
                                { value: "high", label: "High", desc: "Strict filtering" },
                            ].map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => handleSettingChange('contentModeration', level.value)}
                                    className={cn(
                                        "py-3 px-4 rounded-xl border text-sm transition-all text-left",
                                        settings.contentModeration === level.value
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:border-primary/50"
                                    )}
                                >
                                    <p className="font-medium">{level.label}</p>
                                    <p className={cn(
                                        "text-xs mt-0.5",
                                        settings.contentModeration === level.value ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>{level.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Notifications Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Notifications</h2>
                            <p className="text-xs text-muted-foreground">Manage notification preferences</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                            <div>
                                <p className="font-medium">Push Notifications</p>
                                <p className="text-sm text-muted-foreground">Browser push notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </motion.section>

                {/* Platform Integrations Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Platform & API Integrations</h2>
                            <p className="text-xs text-muted-foreground">Connected services and APIs</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { name: "YouTube API", status: "Not Connected", connected: false },
                            { name: "Cloud Storage", status: "Connected", connected: true },
                            { name: "Analytics", status: "Demo Mode", connected: false },
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

                {/* Account Security */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-card border border-border rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Account Security</h2>
                            <p className="text-xs text-muted-foreground">Manage your account access</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <p className="font-medium mb-2">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                                Logged in as: <span className="text-foreground">{userData?.email || "Unknown"}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </motion.section>
            </main>
        </div>
    );
}
