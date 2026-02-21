"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Youtube,
  MoreVertical,
  X,
  ExternalLink,
  AlertTriangle,
  FileVideo,
  Loader2,
  MessageSquare,
  Quote,
  RefreshCw,
  Download,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    status: "pending" | "approved" | "rejected" | "uploaded" | "processing" | "raw_uploaded" | "raw_rejected" | "editing_in_progress";
    creatorId?: string;
    editorId?: string | { _id: string; name: string; email: string };
    youtubeId?: string;
    rejectionReason?: string;
    editorRejectionReason?: string;
    rawFileUrl?: string;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
  showEditorActions?: boolean;
  onRawAccept?: (id: string) => void;
  onRawReject?: (id: string) => void;
  onUploadEdit?: (id: string) => void;
  isLoading?: boolean;
}

export default function VideoCard({
  video,
  onApprove,
  onReject,
  showActions = false,
  showEditorActions = false,
  onRawAccept,
  onRawReject,
  onUploadEdit,
  isLoading = false,
}: VideoCardProps) {
  const router = useRouter();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const getStatusIcon = () => {
    switch (video.status) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "approved": return <CheckCircle className="w-3.5 h-3.5" />;
      case "rejected": return <XCircle className="w-3.5 h-3.5" />;
      case "uploaded": return <Youtube className="w-3.5 h-3.5" />;
      case "processing": return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case "raw_uploaded": return <FileVideo className="w-3.5 h-3.5" />;
      case "editing_in_progress": return <Clock className="w-3.5 h-3.5" />;
      case "raw_rejected": return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = () => {
    switch (video.status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "uploaded": return "bg-red-600/10 text-red-600 border-red-600/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "raw_uploaded": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "editing_in_progress": return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      case "raw_rejected": return "bg-red-400/10 text-red-400 border-red-400/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getLabel = () => {
    switch (video.status) {
      case "pending": return "Review Pending";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "uploaded": return "On YouTube";
      case "processing": return "Uploading...";
      case "raw_uploaded": return "Raw Video Requests";
      case "editing_in_progress": return "In Progress";
      case "raw_rejected": return "Raw Rejected";
      default: return video.status;
    }
  }

  // Helper to construct the full video URL
  const getVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob")) return path;

    // Cleanup path separators
    const cleanPath = path.replace(/\\/g, "/");
    // CRITICAL FIX: Use port 8000 to match backend, instead of 5000
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Ensure one slash between base and path
    const safeBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const safePath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    return `${safeBase}${safePath}`;
  };

  // Determine which video to show: edited fileUrl takes precedence for preview, but for "raw_uploaded" we show rawFileUrl
  const currentVideoPath = (video.status === "raw_uploaded" || video.status === "editing_in_progress") && video.rawFileUrl
    ? video.rawFileUrl
    : video.fileUrl;

  const videoUrl = getVideoUrl(currentVideoPath);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
      className="glass-card rounded-2xl overflow-visible card-hover group flex flex-col h-full border border-border/40 hover:border-border/80 bg-card transition-all duration-300 shadow-sm hover:shadow-lg relative"
    >
      {/* Rejection Note - "Hanging" effect */}
      {(video.status === "rejected" || video.status === "raw_rejected") && (video.rejectionReason || video.editorRejectionReason) && (
        <div className="absolute -top-4 -right-4 z-30 max-w-[250px] animate-in fade-in zoom-in duration-300 group-hover:scale-105 transition-transform">
          <div className="relative bg-red-50 dark:bg-red-950/90 text-red-900 dark:text-red-100 text-xs p-3 rounded-tr-xl rounded-bl-xl rounded-tl-xl shadow-xl border border-red-200 dark:border-red-900">
            <div className="absolute -bottom-1.5 right-0 w-3 h-3 bg-red-50 dark:bg-red-950/90 border-r border-b border-red-200 dark:border-red-900 rotate-45 transform origin-center"></div>
            <div className="flex gap-2">
              <Quote className="w-4 h-4 text-red-400 rotate-180 flex-shrink-0" />
              <div>
                <span className="font-bold block text-[10px] uppercase tracking-wider text-red-500 mb-0.5">Feedback</span>
                <p className="italic leading-snug">"{video.rejectionReason || video.editorRejectionReason}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail / Video Preview Area */}
      <div
        className="relative aspect-video bg-muted/30 overflow-hidden cursor-pointer group/thumb rounded-t-2xl"
        onClick={() => {
          router.push(`/dashboard/video/${video._id}`);
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover/thumb:scale-110">
          <div className="w-14 h-14 rounded-full bg-background/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/thumb:bg-primary transition-colors shadow-2xl">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted opacity-50 transition-opacity group-hover/thumb:opacity-40" />

        {/* Placeholder Icon if no thumbnail (could check if videoError here too if we tried to preload) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <FileVideo className="w-20 h-20" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 shadow-sm",
            getStatusBadgeClass()
          )}>
            {getStatusIcon()}
            {getLabel()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col bg-card/50">
        <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {video.title || "Untitled Video"}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed h-10">
          {video.description || "No description provided"}
        </p>

        {/* Assigned Editor Badge */}
        {video.editorId && typeof video.editorId === 'object' && showActions && (
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-2 py-1.5 rounded-lg w-fit">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
              {(video.editorId as any).name?.[0] || 'E'}
            </div>
            <span>Assigned to <span className="font-medium text-foreground">{(video.editorId as any).name}</span></span>
          </div>
        )}

        <div className="mt-auto">
          {/* Actions - Creator View */}
          {showActions && video.status === "pending" && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); onApprove?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-red-500/20 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          {/* Actions - Editor View (Raw Requests) */}
          {showEditorActions && video.status === "raw_uploaded" && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); onRawAccept?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRawReject?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-red-500/20 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          {/* Actions - Editor View (In Progress) */}
          {showEditorActions && video.status === "editing_in_progress" && (
            <div className="space-y-2 pt-4 border-t border-border/40">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const url = video.rawFileUrl ? getVideoUrl(video.rawFileUrl) : getVideoUrl(video.fileUrl);

                    // For Cloudinary URLs, inject fl_attachment to force download
                    if (url.includes("res.cloudinary.com")) {
                      const downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
                      window.location.href = downloadUrl;
                      return;
                    }

                    // For local/other URLs, use fetch + blob
                    try {
                      const btn = e.currentTarget;
                      const originalContent = btn.innerHTML;
                      btn.textContent = "Downloading...";
                      btn.setAttribute("disabled", "true");

                      const response = await fetch(url);
                      const blob = await response.blob();
                      const blobUrl = URL.createObjectURL(blob);

                      const link = document.createElement("a");
                      link.href = blobUrl;
                      link.download = `${video.title || "video"}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                      btn.innerHTML = originalContent;
                      btn.removeAttribute("disabled");
                    } catch (err) {
                      console.error("Download failed:", err);
                      window.open(url, "_blank");
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-blue-500/20 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onUploadEdit?.(video._id); }}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold uppercase tracking-wide border border-primary/20 disabled:opacity-50"
                >
                  <Youtube className="w-4 h-4" />
                  Upload Edit
                </button>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/video/${video._id}`); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs font-medium border border-border/40"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Open Chat & Studio
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Actions - Editor View (Rejected - Retry) */}
          {showEditorActions && video.status === "rejected" && (
            <div className="pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); onUploadEdit?.(video._id); }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-bold uppercase tracking-wide border border-primary/20 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                Upload New Version
              </button>
            </div>
          )}

          {/* YouTube Link - Uploaded status */}
          {video.status === "uploaded" && video.youtubeId && (
            <div className="pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank"); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20"
              >
                <Youtube className="w-4 h-4" />
                Watch on YouTube
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-primary transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {!videoError ? (
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                  src={videoUrl}
                  onError={(e) => {
                    console.error("Video playback error", e);
                    setVideoError(true);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full aspect-video flex flex-col items-center justify-center bg-zinc-900 text-center p-6">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Unavailable to Play</h3>
                  <p className="text-zinc-400 text-sm max-w-md">
                    We couldn't load the video from <span className="font-mono bg-black/50 px-1 py-0.5 rounded text-xs text-red-400 break-all">{videoUrl}</span>.
                  </p>
                  <p className="text-zinc-500 text-xs mt-4">
                    Troubleshooting:
                    <br />1. Is the backend server running on port 8000?
                    <br />2. Try re-uploading the video (older uploads might be missing extensions).
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div >
  );
}
