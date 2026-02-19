"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Youtube,
    Save,
    Bell,
    Check,
    AlertCircle,
    LogOut,
    User,
    Shield,
    Loader2,
    Bot,
    Mail,
    CreditCard,
    Lock,
    Sparkles
} from "lucide-react";
import { getUserData, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { videoAPI, userAPI, paymentAPI, getGoogleAuthUrl } from "@/lib/api";
import { SubscriptionModal } from "@/components/subscription-modal";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        aiAutoSuggest: true,
        aiThumbnailGen: true,
        contentModeration: 'medium',
        defaultStyle: 'modern',
        emailNotifications: true,
        pushNotifications: false
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const user = getUserData();
                if (user) setUserData(user);

                const res = await userAPI.getSettings();
                if (res.data.settings) {
                    setSettings(prev => ({ ...prev, ...res.data.settings }));
                }

                // Fetch subscription status
                const subRes = await paymentAPI.getSubscription();
                if (subRes.data.success) {
                    setSubscription(subRes.data.subscription);
                }

                // Check YouTube connection status
                try {
                    const ytStatus = await videoAPI.getYouTubeStatus();
                    setIsYoutubeConnected(ytStatus.data.connected === true);
                } catch (err) {
                    console.error("Failed to check YouTube status", err);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleConnectYouTube = () => {
        window.location.href = getGoogleAuthUrl();
    };

    const handleLogout = () => {
        logout();
        router.push("/auth/signin");
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await userAPI.updateSettings(settings);
            // Optional: Show success toast
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key as keyof typeof settings] // logical structure fix for boolean toggles
        }));
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // Helper to check if feature is locked
    const isLocked = (feature: string) => {
        const plan = subscription?.plan || 'free';
        if (plan === 'free') {
            // Lock advanced features for free users
            return ['aiThumbnailGen', 'pushNotifications'].includes(feature);
        }
        return false;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="min-h-screen bg-transparent p-6 lg:p-12"
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                            <Settings className="w-8 h-8 text-muted-foreground" />
                            Settings
                        </h1>
                        <p className="text-muted-foreground">Manage your account preferences and integrations.</p>
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </header>

                <div className="space-y-6">


                    {/* Subscription Section - NEW */}
                    <section className="glass p-8 rounded-3xl border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-indigo-400" />
                                Subscription Plan
                            </h2>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                                subscription?.plan === 'pro' || subscription?.plan === 'team'
                                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                    : "bg-secondary text-muted-foreground border-border"
                            )}>
                                {subscription?.plan || 'Free'} Plan
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Current Status</p>
                                <p className="text-foreground font-medium capitalize">{subscription?.status || 'Active'}</p>
                            </div>

                            {subscription?.plan === 'free' ? (
                                <button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Upgrade to Pro
                                </button>
                            ) : (
                                <button
                                    onClick={() => alert("Manage subscription coming soon!")} // Placeholder
                                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl font-medium transition-colors"
                                >
                                    Manage Subscription
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Profile Section */}
                    <section className="glass p-8 rounded-3xl border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Profile Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={userData?.name || ""}
                                    readOnly
                                    className="input-field opacity-60 cursor-not-allowed w-full bg-secondary border border-border rounded-xl p-3 text-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={userData?.email || ""}
                                    readOnly
                                    className="input-field opacity-60 cursor-not-allowed w-full bg-secondary border border-border rounded-xl p-3 text-foreground"
                                />
                            </div>
                        </div>
                    </section>

                    {/* AI Preferences Section */}
                    <section className="glass p-8 rounded-3xl border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-purple-400" />
                            AI Preferences
                        </h2>
                        <div className="space-y-6">
                            {/* Auto Suggest - Free */}
                            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border hover:border-purple-500/30 transition-colors">
                                <div>
                                    <h3 className="text-foreground font-medium mb-1">Auto-Suggest Video Ideas</h3>
                                    <p className="text-sm text-muted-foreground">Get AI-generated video topics based on trends.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.aiAutoSuggest}
                                        onChange={() => toggleSetting('aiAutoSuggest')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            {/* Thumbnail Gen - LOCKED */}
                            <div className={cn(
                                "flex items-center justify-between p-4 bg-secondary/30 rounded-xl border transition-colors relative overflow-hidden",
                                isLocked('aiThumbnailGen')
                                    ? "border-amber-500/20 opacity-80"
                                    : "border-border hover:border-purple-500/30"
                            )}>
                                <div className="relative z-10">
                                    <h3 className="text-foreground font-medium mb-1 flex items-center gap-2">
                                        Auto-Generate Thumbnails
                                        {isLocked('aiThumbnailGen') && (
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase rounded-full border border-amber-500/20 flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Pro
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Create AI thumbnails for confirmed video ideas.</p>
                                </div>

                                {isLocked('aiThumbnailGen') ? (
                                    <button
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        className="relative z-10 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20 transition-colors"
                                    >
                                        Unlock
                                    </button>
                                ) : (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.aiThumbnailGen}
                                            onChange={() => toggleSetting('aiThumbnailGen')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Default Art Style</label>
                                    <select
                                        value={settings.defaultStyle}
                                        onChange={(e) => updateSetting('defaultStyle', e.target.value)}
                                        className="w-full bg-secondary border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="modern">Modern & Clean</option>
                                        <option value="bold">Bold & High Contrast</option>
                                        <option value="minimalist">Minimalist</option>
                                        <option value="cinematic">Cinematic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Content Moderation</label>
                                    <select
                                        value={settings.contentModeration}
                                        onChange={(e) => updateSetting('contentModeration', e.target.value)}
                                        className="w-full bg-secondary border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="low">Low (Allow most ideas)</option>
                                        <option value="medium">Medium (Standard safety)</option>
                                        <option value="strict">Strict (Family friendly)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notification Settings */}
                    <section className="glass p-8 rounded-3xl border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-500" />
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 px-0 border-b border-border last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-medium">Email Notifications</h3>
                                        <p className="text-xs text-muted-foreground">Receive weekly digests and major updates.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={() => toggleSetting('emailNotifications')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Push Notifications - LOCKED */}
                            <div className="flex items-center justify-between p-4 px-0 border-b border-border last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-medium flex items-center gap-2">
                                            Push Notifications
                                            {isLocked('pushNotifications') && <Lock className="w-3 h-3 text-amber-400" />}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Get real-time alerts for video approvals.</p>
                                    </div>
                                </div>
                                {isLocked('pushNotifications') ? (
                                    <button
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                    >
                                        UPGRADE
                                    </button>
                                ) : (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.pushNotifications}
                                            onChange={() => toggleSetting('pushNotifications')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                                    </label>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ... Integrations & Account Actions Sections unchanged ... */}
                    <section className="glass p-8 rounded-3xl border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Youtube className="w-5 h-5 text-red-500" />
                            Integrations
                        </h2>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-2xl bg-gradient-to-br from-secondary/50 to-transparent border border-border relative group">
                            <div className="flex items-start gap-5">
                                <div className="p-4 rounded-2xl bg-[#FF0000]/10 border border-[#FF0000]/20 flex-shrink-0">
                                    <Youtube className="w-8 h-8 text-[#FF0000]" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold text-foreground">YouTube Integration</h3>
                                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                                        Authorize MwareX to manage your channel. We'll only upload videos that you explicitly approve from your dashboard.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                        <Shield className="w-3 h-3" />
                                        <span>Secure OAuth 2.0 Connection</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                {isYoutubeConnected ? (
                                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-medium">Connected</span>
                                        <Check className="w-4 h-4 ml-1" />
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleConnectYouTube}
                                        className="relative overflow-hidden group px-6 py-3 rounded-xl bg-white dark:bg-zinc-800 text-black dark:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white dark:from-zinc-700 dark:to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-3">
                                            <Youtube className="w-5 h-5 text-red-600 fill-current" />
                                            <span>Connect Channel</span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Account Actions */}
                    <section className="glass p-8 rounded-3xl border border-border">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-muted-foreground" />
                            Account Actions
                        </h2>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg w-fit"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </section>
                </div>
            </div>

            {/* Subscription Modal */}
            <SubscriptionModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                currentPlan={subscription?.plan || 'free'}
            />
        </div>
    );
}
