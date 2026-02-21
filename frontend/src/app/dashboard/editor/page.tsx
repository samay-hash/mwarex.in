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
  ArrowRight,
  Lock,
  DollarSign,
  Wand2
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI, aiAPI, paymentAPI, roomAPI } from "@/lib/api";
import { isAuthenticated, getUserData, logout, isDemoUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { SubscriptionModal } from "@/components/subscription-modal";
import { cn } from "@/lib/utils";
import { SeasonSwitcher } from "@/components/seasonal-background";

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "uploaded" | "processing" | "raw_uploaded" | "raw_rejected" | "editing_in_progress";
  rejectionReason?: string;
  rawFileUrl?: string; // Add rawFileUrl
  editorId?: { _id: string; name: string; email: string } | string;
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
  const [subscription, setSubscription] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Room State
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);
  const [currentRoom, setCurrentRoom] = useState<{ _id: string; name: string } | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [joinToken, setJoinToken] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [uploadEditId, setUploadEditId] = useState<string | null>(null); // Track if uploading an edit for a raw video

  // AI Thumbnail State
  const [thumbnailPrompt, setThumbnailPrompt] = useState("");
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState("");
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

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

    // Don't call fetchVideos() here — wait for rooms to load first
    if (data?.isDemo) {
      setIsLoading(false);
    }

    // Fetch Rooms for Editor
    if (!data?.isDemo) {
      roomAPI.list()
        .then(res => {
          setRooms(res.data);
          if (res.data.length > 0) {
            setCurrentRoom(res.data[0]);
          } else {
            setIsLoading(false);
            // Maybe prompt to join a room?
            setIsRoomModalOpen(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }

    // Fetch subscription
    if (!data?.isDemo) {
      paymentAPI.getSubscription()
        .then(res => setSubscription(res.data.subscription))
        .catch(console.error);
    }

    // Page load animation
    setTimeout(() => setPageLoaded(true), 100);
  }, [router]);

  // Re-fetch videos whenever the selected room changes
  useEffect(() => {
    if (currentRoom) {
      fetchVideos();
    }
  }, [currentRoom]);


  const fetchVideos = async () => {
    // Don't fetch if demo user
    if (isDemoUser()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = currentRoom ? { roomId: currentRoom._id } : {};
      const response = await videoAPI.getVideos(params);
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // For raw edits, title/desc might be optional upkeep, but let's keep them
    if (!title && !uploadEditId) return;

    setUploadLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    // Always send roomId so the video is associated with the correct room
    if (currentRoom) {
      formData.append("roomId", currentRoom._id);
    }

    // For new uploads (not editing an existing video)
    if (!uploadEditId) {
      if (creatorId) {
        formData.append("creatorId", creatorId);
      }
      formData.append("editorId", userData?.id || "");
    }

    formData.append("thumbnailUrl", selectedThumbnail);

    try {
      if (uploadEditId) {
        await videoAPI.uploadEdit(uploadEditId, formData);
      } else {
        await videoAPI.upload(formData);
      }

      setIsUploadModalOpen(false);
      setUploadEditId(null); // Reset
      setTitle("");
      setDescription("");
      setFile(null);
      setGeneratedThumbnails([]);
      setSelectedThumbnail("");
      setThumbnailPrompt("");
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

  const handleRawAccept = async (id: string) => {
    try {
      await videoAPI.reviewRaw(id, "accept");
      fetchVideos();
    } catch (err) { console.error(err); }
  };

  const handleRawReject = async (id: string) => {
    // For MVP, using default reason. In real app, prompt for reason.
    try {
      await videoAPI.reviewRaw(id, "reject", "Editor unable to accept this request at this time.");
      fetchVideos();
    } catch (err) { console.error(err); }
  };

  const openUploadEditModal = (id: string) => {
    setUploadEditId(id);
    setTitle("Edited Version"); // Default title?
    setIsUploadModalOpen(true);
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

  const isRevenueLocked = subscription?.plan === "free" && !isDemo;

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
    <div
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      className="min-h-screen text-foreground transition-colors duration-300 font-sans"
    >
      {/* Header */}
      <header
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
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

          {/* Room Switcher */}
          <div className="flex items-center gap-2 ml-4 relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all">
              <span className="font-medium text-xs">{currentRoom?.name || "Select Workspace"}</span>
              <Wand2 className="w-3 h-3 text-muted-foreground" />
            </button>
            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-xl overflow-hidden hidden group-focus-within:block group-hover:block z-50">
              <div className="max-h-48 overflow-y-auto p-1">
                {rooms.map(room => (
                  <button
                    key={room._id}
                    onClick={() => setCurrentRoom(room)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md text-xs transition-colors text-left",
                      currentRoom?._id === room._id ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="truncate">{room.name}</span>
                    {currentRoom?._id === room._id && <CheckCircle className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="p-1 border-t border-border">
                <button
                  onClick={() => setIsRoomModalOpen(true)}
                  className="w-full flex items-center gap-2 p-2 rounded-md text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Join Workspace
                </button>
              </div>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/editor/ai-studio")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-violet-500/10 hover:from-primary/20 hover:to-violet-500/20 text-primary border border-primary/20 font-medium text-sm transition-all cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
              title="AI Studio"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden md:inline">AI Studio</span>
            </button>
            <SeasonSwitcher />
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
              onClick={() => { setUploadEditId(null); setIsUploadModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Submission</span>
            </button>
          </div>
        </div>
      </header >

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "bg-card border rounded-xl p-3 md:p-5 hover:shadow-md transition-all duration-200",
                stat.border
              )}
            >
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <span className={cn("text-[10px] md:text-xs font-semibold uppercase tracking-wider", stat.color)}>
                  {stat.label}
                </span>
                <div className={cn("w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-3.5 h-3.5 md:w-4 md:h-4", stat.color)} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}

          {/* Revenue Split Card (Locked) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => isRevenueLocked && setIsUpgradeModalOpen(true)}
            className={cn(
              "bg-card border rounded-xl p-3 md:p-5 transition-all duration-200 relative group",
              isRevenueLocked
                ? "cursor-pointer border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
                : "cursor-default border-indigo-500/20"
            )}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-indigo-500">
                My Revenue Look
              </span>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="group/info relative hidden md:block" onClick={(e) => e.stopPropagation()}>
                  <Eye className="w-4 h-4 text-muted-foreground/50 hover:text-indigo-500 transition-colors cursor-pointer" />
                  <div className="absolute right-0 top-6 w-48 p-2 bg-popover border border-border rounded-lg shadow-lg text-[10px] text-muted-foreground opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-10">
                    Editor and creator can get instant payment after approve to youtube and all.
                  </div>
                </div>
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center bg-indigo-500/10">
                  <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {isRevenueLocked ? (
                <p className="text-xl md:text-3xl font-bold blur-sm select-none">$650.00</p>
              ) : (
                <p className="text-xl md:text-3xl font-bold">$0.00</p>
              )}

              {isRevenueLocked && (
                <div className="bg-amber-500/10 text-amber-500 p-1 md:p-1.5 rounded-full">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </div>

            {isRevenueLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Unlock
                </span>
              </div>
            )}
          </motion.div>

          {/* Editing Tools Card (Locked) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => isRevenueLocked && setIsUpgradeModalOpen(true)}
            className={cn(
              "bg-card border rounded-xl p-3 md:p-5 transition-all duration-200 relative group",
              isRevenueLocked
                ? "cursor-pointer border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyTDEwIDI2TDE0IDE2TDI2IDEyTDIgMloiIGZpbGw9IiMxMGI5ODEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+'),_pointer]"
                : "cursor-default border-violet-500/20"
            )}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-violet-500">
                Editing Tools
              </span>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="group/info relative hidden md:block" onClick={(e) => e.stopPropagation()}>
                  <Eye className="w-4 h-4 text-muted-foreground/50 hover:text-violet-500 transition-colors cursor-pointer" />
                  <div className="absolute right-0 top-6 w-48 p-2 bg-popover border border-border rounded-lg shadow-lg text-[10px] text-muted-foreground opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-10">
                    You will get access to premium editing platform for edit your videos and all.
                  </div>
                </div>
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center bg-violet-500/10">
                  <Wand2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {isRevenueLocked ? (
                <p className="text-base md:text-xl font-bold blur-sm select-none">Premium Access</p>
              ) : (
                <p className="text-base md:text-xl font-bold">Access Granted</p>
              )}

              {isRevenueLocked && (
                <div className="bg-amber-500/10 text-amber-500 p-1 md:p-1.5 rounded-full">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </div>

            {isRevenueLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Unlock
                </span>
              </div>
            )}
          </motion.div>
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
            {/* Skeletons */}
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-secondary/30 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Raw Requests Section */}
            {videos.some(v => v.status === "raw_uploaded") && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-8 bg-purple-500 rounded-full" />
                  <h3 className="text-lg font-semibold">New Raw Requests</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.filter(v => v.status === "raw_uploaded").map(video => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      showEditorActions={true}
                      onRawAccept={handleRawAccept}
                      onRawReject={handleRawReject}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* In Progress Section */}
            {videos.some(v => v.status === "editing_in_progress") && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-8 bg-blue-500 rounded-full" />
                  <h3 className="text-lg font-semibold">Editing In Progress</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.filter(v => v.status === "editing_in_progress").map(video => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      showEditorActions={true}
                      onUploadEdit={openUploadEditModal}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Submitted / History Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                <h3 className="text-lg font-semibold">Submitted & History</h3>
              </div>
              {videos.filter(v => !["raw_uploaded", "editing_in_progress"].includes(v.status)).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.filter(v => !["raw_uploaded", "editing_in_progress"].includes(v.status)).map(video => (
                    <VideoCard
                      key={video._id}
                      video={video}
                      showEditorActions={video.status === "rejected"}
                      onUploadEdit={openUploadEditModal}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 opacity-60 text-sm">No submission history yet.</div>
              )}
            </section>
          </div>
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
              onClick={() => { setIsUploadModalOpen(false); setUploadEditId(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-card border border-border rounded-xl overflow-hidden shadow-2xl"
            >
              {/* Compact Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/20">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">{uploadEditId ? "Submit Edited Version" : "New Submission"}</span>
                </div>
                <button
                  onClick={() => { setIsUploadModalOpen(false); setUploadEditId(null); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-4 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-2.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Compact Inputs */}
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-secondary/30 border border-border focus:border-primary/50 rounded-lg px-3 py-2 text-sm outline-none transition-all focus:bg-background placeholder:text-muted-foreground/70"
                      placeholder="Video Title"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-secondary/30 border border-border focus:border-primary/50 rounded-lg px-3 py-2 text-sm outline-none transition-all resize-none focus:bg-background placeholder:text-muted-foreground/70"
                      placeholder="Add brief notes..."
                    />
                  </div>
                </div>

                {/* Compact AI Thumbnail */}
                <div className="border border-border rounded-lg p-3 bg-secondary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Thumbnail
                    </label>
                    {selectedThumbnail && (
                      <button type="button" onClick={() => setSelectedThumbnail("")} className="text-[10px] text-red-400 hover:text-red-500">Clear</button>
                    )}
                  </div>

                  {!selectedThumbnail ? (
                    <div className="flex gap-2">
                      <input
                        value={thumbnailPrompt}
                        onChange={(e) => setThumbnailPrompt(e.target.value)}
                        placeholder="AI Prompt..."
                        className="flex-1 bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary/50"
                      />
                      <button
                        type="button"
                        disabled={isGeneratingThumbnail || !thumbnailPrompt}
                        onClick={async () => {
                          if (!thumbnailPrompt) return;
                          setIsGeneratingThumbnail(true);
                          try {
                            const res = await aiAPI.generateThumbnails({ topic: thumbnailPrompt });
                            setGeneratedThumbnails(res.data.thumbnails.map((t: any) => t.url));
                          } catch (err) { console.error(err); } finally { setIsGeneratingThumbnail(false); }
                        }}
                        className="px-3 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        {isGeneratingThumbnail ? <Loader2 className="w-3 h-3 animate-spin" /> : "Generate"}
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-20 w-36 rounded-md overflow-hidden border border-border mx-auto group">
                      <img src={selectedThumbnail} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                  )}

                  {generatedThumbnails.length > 0 && !selectedThumbnail && (
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {generatedThumbnails.slice(0, 4).map((url, i) => (
                        <div key={i} onClick={() => setSelectedThumbnail(url)} className="aspect-video rounded overflow-hidden cursor-pointer border hover:border-primary">
                          <img src={url} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Compact Upload Box */}
                <div className="relative group">
                  <div className={cn(
                    "relative border-2 border-dashed border-border rounded-lg p-4 text-center transition-all cursor-pointer bg-secondary/10 group-hover:border-primary/40 group-hover:bg-secondary/20",
                    file ? "border-emerald-500/30 bg-emerald-500/5" : ""
                  )}>
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      {file ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <FileVideo className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div className="text-xs truncate max-w-[200px] font-medium text-emerald-600 dark:text-emerald-400">
                            {file.name}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium">Click to upload video</p>
                            <p className="text-[10px] text-muted-foreground">MP4, MOV (Max 2GB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Upload
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SubscriptionModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentPlan={subscription?.plan || "free"}
      />
    </div >
  );
}
