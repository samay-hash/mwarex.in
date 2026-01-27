"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Youtube,
  Clock,
  Users,
  Plus,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Mail,
  Copy,
  Check,
  Video as VideoIcon,
  Menu,
  ChevronRight,
  Loader2,
  LayoutDashboard,
  X,
  Sun,
  Moon,
  Eye
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI, inviteAPI, getGoogleAuthUrl } from "@/lib/api";
import { isAuthenticated, getUserData, logout, isDemoUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "uploaded";
  youtubeId?: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [avatarLetter, setAvatarLetter] = useState("U");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<{ name?: string; email?: string; isDemo?: boolean } | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const data = getUserData();
    if (!isAuthenticated() || !data) {
      router.push("/auth/signin");
      return;
    }
    setUserData(data);
    setIsDemo(data?.isDemo === true);

    // Only fetch videos if not a demo user
    if (!data?.isDemo) {
      fetchVideos();
    } else {
      // For demo users, just show empty state immediately
      setIsLoading(false);
    }

    const letter = data?.name?.[0] || data?.email?.[0] || "U";
    setAvatarLetter(letter);

    // Page load animation
    setTimeout(() => setPageLoaded(true), 100);
  }, [router]);

  const fetchVideos = async () => {
    // Don't fetch if demo user
    if (isDemoUser()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await videoAPI.getPending();
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.approve(id);
      await fetchVideos();
    } catch (error) {
      console.error("Failed to approve video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.reject(id);
      setVideos(
        videos.map((v) =>
          v._id === id ? { ...v, status: "rejected" as const } : v
        )
      );
    } catch (error) {
      console.error("Failed to reject video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInviteEditor = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);

    // For demo users, show a mock invite link
    if (isDemo) {
      setTimeout(() => {
        setInviteLink(`https://mwarex.app/invite/demo-${Date.now()}`);
        setIsInviting(false);
      }, 1000);
      return;
    }

    try {
      const response = await inviteAPI.sendInvite(inviteEmail);
      setInviteLink(response.data.inviteLink);
    } catch (error) {
      console.error("Failed to send invite:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || video.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [videos, searchQuery, activeTab]);

  const stats = useMemo(
    () => [
      {
        label: "Pending",
        value: videos.filter((v) => v.status === "pending").length,
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      },
      {
        label: "Approved",
        value: videos.filter((v) => v.status === "approved").length,
        icon: CheckCircle,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      },
      {
        label: "Published",
        value: videos.filter((v) => v.status === "uploaded").length,
        icon: Youtube,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
      },
      {
        label: "Rejected",
        value: videos.filter((v) => v.status === "rejected").length,
        icon: XCircle,
        color: "text-zinc-400",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
      },
    ],
    [videos]
  );

  // Initial page loader
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
            <span className="text-sm text-muted-foreground">Loading dashboard...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans transition-colors duration-300">

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024 ? 0 : -280 }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Area */}
        <div className="p-5 border-b border-border">
          <MWareXLogo showText={true} size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground px-3 mb-3 uppercase tracking-widest">Menu</p>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setIsInviteModalOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm"
          >
            <Users className="w-4 h-4" />
            <span>Team Members</span>
          </button>

          <a
            href={getGoogleAuthUrl()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm"
          >
            <Youtube className="w-4 h-4" />
            <span>Integrations</span>
          </a>

          <div className="my-4 border-t border-border" />

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors text-sm">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userData?.name || "Creator"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{userData?.email}</p>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-background">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Welcome back, {userData?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {videos.filter(v => v.status === 'pending').length > 0 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-600 dark:text-amber-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {videos.filter(v => v.status === 'pending').length} pending
              </div>
            )}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Invite Editor</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Demo Mode Banner */}
          {isDemo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Recruiter Demo Mode</p>
                  <p className="text-xs text-muted-foreground">You're viewing a preview of the Creator Dashboard. Some features are simulated.</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Exit Demo
              </button>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-card border rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-200 cursor-default",
                  stat.border
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:bg-background"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab("pending")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === "pending"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                All Videos
              </button>
              <button
                onClick={fetchVideos}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </button>
            </div>
          </motion.div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="aspect-video bg-secondary animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-secondary rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-secondary/70 rounded animate-pulse" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-9 flex-1 bg-secondary rounded animate-pulse" />
                      <div className="h-9 flex-1 bg-secondary rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={video.status === "pending"}
                  isLoading={actionLoading === video._id}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-card border border-dashed border-border rounded-2xl"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <VideoIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                {activeTab === 'pending'
                  ? "You're all caught up! No pending reviews at the moment."
                  : "Try adjusting your search filters."}
              </p>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Invite Editor
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Invite Editor Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Invite Editor</h2>
                    <p className="text-xs text-muted-foreground">Send a secure invite link</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {!inviteLink ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Editor's Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg pl-10 pr-4 py-3 outline-none transition-colors focus:bg-background"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleInviteEditor}
                      disabled={!inviteEmail || isInviting}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isInviting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Send Invite
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                        <CheckCircle className="w-4 h-4" />
                        Invite Generated!
                      </div>
                      <p className="text-xs text-muted-foreground">Share this link with your editor</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Invite Link</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="w-full bg-secondary/50 border border-border rounded-lg pl-3 pr-20 py-3 text-sm font-mono outline-none"
                        />
                        <button
                          onClick={copyInviteLink}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border rounded text-xs font-medium flex items-center gap-1 hover:bg-secondary transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setInviteLink("");
                        setInviteEmail("");
                        setIsInviteModalOpen(false);
                      }}
                      className="w-full py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
