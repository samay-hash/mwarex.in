"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  Upload,
  FileVideo,
  AlertCircle,
  Loader2,
  X,
  LogOut,
  LayoutDashboard,
  Eye,
  Sparkles,
  Settings,
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI } from "@/lib/api";
import { isAuthenticated, getUserData, logout, isDemoUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "uploaded" | "processing";
}

export default function EditorDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [creatorId, setCreatorId] = useState<string>("");
  const [userData, setUserData] = useState<{ id?: string; name?: string; email?: string; isDemo?: boolean } | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = getUserData();
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    setUserData(data);
    setIsDemo(data?.isDemo === true);

    if (data?.creatorId) {
      setCreatorId(data.creatorId);
    }

    // Only fetch videos if not a demo user
    if (!data?.isDemo) {
      fetchVideos();
    } else {
      setIsLoading(false);
    }

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
      const response = await videoAPI.getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    if (!creatorId) {
      setError(
        "No creator associated with your account. Please contact support."
      );
      return;
    }

    setUploadLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("creatorId", creatorId);
    formData.append("editorId", userData?.id || "");

    try {
      await videoAPI.upload(formData);
      setIsUploadModalOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      fetchVideos();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const stats = [
    {
      label: "Awaiting Review",
      value: videos.filter((v) => v.status === "pending").length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Approved",
      value: videos.filter((v) => v.status === "approved" || v.status === "uploaded" || v.status === "processing").length,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Rejected",
      value: videos.filter((v) => v.status === "rejected").length,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

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
            <span className="text-sm text-muted-foreground">Loading workspace...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MWareXLogo showText={true} size="md" />
            <div className="h-5 w-px bg-border hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <div className="p-1.5 bg-secondary rounded-lg">
                <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">Editor Workspace</h1>
                {userData && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {userData.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/editor/ai-studio")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-violet-500/10 hover:from-primary/20 hover:to-violet-500/20 text-primary border border-primary/20 font-medium text-sm transition-all"
              title="AI Studio"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">AI Studio</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/editor/settings")}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Submission</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "bg-card border rounded-xl p-5 hover:shadow-md transition-all duration-200",
                stat.border
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn("text-xs font-semibold uppercase tracking-wider", stat.color)}>
                  {stat.label}
                </span>
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-lg font-semibold">Recent Submissions</h2>
            <p className="text-sm text-muted-foreground">Manage and track your video delivery status.</p>
          </div>
          <button
            onClick={fetchVideos}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="aspect-video bg-secondary animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-secondary rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-secondary/70 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-card border border-dashed border-border rounded-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <FileVideo className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No videos submitted yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Start your workflow by uploading your first draft for review.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Upload className="w-4 h-4" />
              Upload your first video
            </button>
          </motion.div>
        )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Submit New Draft</h3>
                    <p className="text-xs text-muted-foreground">Send footage to creator for review</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-5 space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg px-4 py-3 outline-none transition-colors focus:bg-background"
                    placeholder="E.g. My Amazing Travel Vlog - v1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-secondary/50 border border-border focus:border-primary/50 rounded-lg px-4 py-3 outline-none transition-colors resize-none focus:bg-background"
                    placeholder="Add notes for the creator about this draft..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Video File
                  </label>
                  <div className="relative border-2 border-dashed border-border hover:border-primary/30 rounded-xl p-8 text-center transition-colors cursor-pointer bg-secondary/20 hover:bg-secondary/30">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />

                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                      <FileVideo className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {file ? file.name : "Click to browse or drag file"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV, or WEBM (Max 2GB)
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Submission
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
