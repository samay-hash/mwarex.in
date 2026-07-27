"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Video, Scissors, Folder, Puzzle, CreditCard, Settings, LogOut,
    Search, Bell, ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward,
    Volume2, Undo2, Redo2, ZoomIn, ZoomOut, Crop, Type, MessageSquare,
    Image as ImageIcon, LayoutTemplate, Maximize, Minimize, LayoutGrid, Wand2,
    ChevronDown, Zap, Activity, AlertCircle, CheckCircle2
} from "lucide-react";
import { videoAPI, s3API } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getUserData } from "@/lib/auth";
import { toast } from "sonner";

export default function ClipEditorWorkspace() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const clipId = params.clipId as string;

    const [video, setVideo] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [signedVideoSrc, setSignedVideoSrc] = useState<string>("");
    
    // Editor State
    const [activeTool, setActiveTool] = useState("viral-director");
    
    // Video Player State
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    useEffect(() => {
        const data = getUserData();
        setUserData(data);
        fetchVideo();
    }, [id]);

    const fetchVideo = async () => {
        try {
            const res = await videoAPI.getVideo(id);
            setVideo(res.data);
            const isRaw = (res.data.status === "raw_uploaded" || res.data.status === "editing_in_progress") && !!res.data.rawFileUrl;
            const targetUrl = isRaw ? res.data.rawFileUrl : res.data.fileUrl;
            if (targetUrl && targetUrl.includes("amazonaws.com")) {
                const s3Res = await s3API.getDownloadUrl(id, isRaw);
                setSignedVideoSrc(s3Res.data.signedUrl);
            } else {
                setSignedVideoSrc(getVideoUrl(targetUrl || ""));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getVideoUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http") || path.startsWith("blob")) return path;
        const cleanPath = path.replace(/\\/g, "/");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const safeBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const safePath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
        return `${safeBase}${safePath}`;
    };

    // Player Controls
    const togglePlay = () => {
        if (videoRef.current && previewRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                previewRef.current.pause();
            } else {
                videoRef.current.play();
                previewRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            // Sync preview
            if (previewRef.current && Math.abs(previewRef.current.currentTime - videoRef.current.currentTime) > 0.5) {
                previewRef.current.currentTime = videoRef.current.currentTime;
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration || 60);
        }
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (timelineRef.current && videoRef.current && previewRef.current && duration > 0) {
            const rect = timelineRef.current.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const newTime = percentage * duration;
            videoRef.current.currentTime = newTime;
            previewRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor((seconds || 0) / 60);
        const s = Math.floor((seconds || 0) % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans h-screen overflow-hidden">
            {/* Top Navigation */}
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <button onClick={() => router.push('/dashboard/creator')} className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors">
                        <Home className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => router.push('/dashboard/creator')}>Home</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => router.push(`/dashboard/video/${id}`)}>Project</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground truncate max-w-[150px]">{video?.title || "AI Clip Editor"}</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm font-medium">
                        <span className="text-primary">⚡</span>
                        <span>2,450 <span className="text-muted-foreground font-normal">credits</span></span>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors border border-border">
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors border border-border">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm cursor-pointer ml-2">
                        {userData?.name?.[0]?.toUpperCase() || "Y"}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Global Left Sidebar */}
                <aside className="w-16 border-r border-border bg-card/30 flex flex-col items-center py-6 gap-6 z-10 shrink-0">
                    <button className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                        <Home className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm transition-all">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                        <Scissors className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1" />
                    <button onClick={() => router.push('/dashboard/creator')} className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <LogOut className="w-5 h-5" />
                    </button>
                </aside>

                {/* Main Editor Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Toolbar / Breadcrumbs */}
                    <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-border/50">
                        <div className="flex items-center gap-3 text-sm font-semibold">
                            <button onClick={() => router.push(`/dashboard/video/${id}`)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                            </button>
                            <span className="text-foreground">Clip Editor: AI Extraction</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors text-sm font-bold">
                                Save <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="px-6 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-bold">
                                Publish
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Center Canvases & Bottom Timeline */}
                        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                            
                            {/* Dual Canvas Area */}
                            <div className="flex-1 flex gap-6 overflow-hidden min-h-[300px]">
                                {/* Canvas 1: Raw Editor */}
                                <div className="flex-1 bg-card/40 border border-border rounded-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-sm group">
                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur text-white text-xs font-semibold border border-white/10">
                                            Source Footage
                                        </div>
                                    </div>

                                    <div className="relative w-full max-w-[600px] aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center group-hover:border-primary/50 transition-colors border border-transparent">
                                        {signedVideoSrc ? (
                                            <video 
                                                ref={videoRef}
                                                src={signedVideoSrc} 
                                                className="w-full h-full object-contain" 
                                                onTimeUpdate={handleTimeUpdate}
                                                onLoadedMetadata={handleLoadedMetadata}
                                            />
                                        ) : (
                                            <div className="text-muted-foreground text-sm font-medium flex flex-col items-center">
                                                <Activity className="w-8 h-8 animate-pulse mb-2 text-primary/50" />
                                                Loading Video...
                                            </div>
                                        )}
                                        
                                        {/* Crop Box Overlay (Visual only) */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[90%] aspect-[9/16] border-2 border-primary border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
                                            <div className="absolute top-0 left-0 w-2 h-2 bg-primary -translate-x-1/2 -translate-y-1/2 rounded-full" />
                                            <div className="absolute top-0 right-0 w-2 h-2 bg-primary translate-x-1/2 -translate-y-1/2 rounded-full" />
                                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary -translate-x-1/2 translate-y-1/2 rounded-full" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary translate-x-1/2 translate-y-1/2 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                {/* Canvas 2: Live Preview */}
                                <div className="flex-1 bg-card/40 border border-border rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm relative">
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1.5 backdrop-blur">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Output Ready
                                        </div>
                                    </div>
                                    <div className="relative h-full max-h-[500px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center border border-white/5">
                                        {signedVideoSrc ? (
                                            <video 
                                                ref={previewRef}
                                                src={signedVideoSrc} 
                                                className="w-full h-full object-cover scale-150" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#1a1a1a]" />
                                        )}
                                        
                                        {/* Overlay Captions */}
                                        <div className="absolute bottom-20 inset-x-4 text-center">
                                            <span className="bg-yellow-400 text-black font-black text-2xl px-2 py-1 uppercase italic -skew-x-6 drop-shadow-md inline-block">
                                                VIRAL
                                            </span>
                                            <span className="bg-white text-black font-black text-2xl px-2 py-1 uppercase italic -skew-x-6 drop-shadow-md inline-block ml-1">
                                                CLIP!
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Timeline */}
                            <div className="h-[220px] bg-card/40 border border-border rounded-2xl flex flex-col p-4 shadow-sm shrink-0">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-3 w-[200px]">
                                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><ZoomOut className="w-4 h-4" /></button>
                                        <input type="range" className="flex-1 accent-primary h-1 bg-secondary rounded-lg appearance-none cursor-pointer" />
                                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><ZoomIn className="w-4 h-4" /></button>
                                    </div>
                                    
                                    {/* Playback Controls */}
                                    <div className="flex items-center gap-6">
                                        <span className="font-mono text-xs font-semibold w-24 text-right">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                        <div className="flex items-center gap-3">
                                            <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" onClick={() => {if(videoRef.current) videoRef.current.currentTime -= 5;}}><SkipBack className="w-4 h-4" /></button>
                                            <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-all shadow-lg">
                                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                            </button>
                                            <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" onClick={() => {if(videoRef.current) videoRef.current.currentTime += 5;}}><SkipForward className="w-4 h-4" /></button>
                                        </div>
                                        <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Volume2 className="w-4 h-4" /></button>
                                    </div>

                                    <div className="flex items-center gap-3 w-[200px] justify-end">
                                        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Undo2 className="w-4 h-4" /></button>
                                        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Redo2 className="w-4 h-4" /></button>
                                        <button className="px-5 py-2 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity shadow-md">Apply Edits</button>
                                    </div>
                                </div>

                                {/* Tracks Container */}
                                <div className="flex-1 bg-background rounded-xl border border-border relative flex flex-col overflow-hidden">
                                    <div className="flex justify-between text-[10px] text-muted-foreground px-4 py-1.5 border-b border-border font-mono bg-card/30">
                                        <span>00:00</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                    
                                    <div 
                                        className="flex-1 relative cursor-text group"
                                        ref={timelineRef}
                                        onClick={handleTimelineClick}
                                    >
                                        {/* Mock Track UI */}
                                        <div className="absolute inset-x-4 top-2 h-10 rounded-lg bg-primary/10 border border-primary/20 overflow-hidden flex items-center group-hover:border-primary/40 transition-colors">
                                            <div className="w-full h-full flex items-center opacity-30 px-2 gap-1">
                                                {[...Array(100)].map((_, i) => <div key={i} className="flex-1 bg-primary rounded-full" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />)}
                                            </div>
                                        </div>

                                        <div className="absolute inset-x-4 top-14 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 overflow-hidden flex items-center px-3">
                                            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">Captions Track</span>
                                        </div>

                                        {/* Playhead */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-px bg-white z-10 shadow-[0_0_15px_rgba(255,255,255,1)] pointer-events-none transition-all duration-75 ease-linear"
                                            style={{ left: `calc(1rem + ${progressPercentage}%)` }}
                                        >
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm bg-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Dynamic Tool Panel */}
                        <div className="w-[320px] bg-[#111111] border-l border-white/5 flex flex-col shrink-0 relative shadow-2xl z-20 transition-all">
                            {/* Panel Header */}
                            <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0 bg-[#151515]">
                                {activeTool === 'viral-director' && <h2 className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" /> AI Viral Director</h2>}
                                {activeTool === 'reframe' && <h2 className="text-sm font-bold text-white flex items-center gap-2"><Crop className="w-4 h-4 text-primary" /> Auto Reframe</h2>}
                                {activeTool === 'text' && <h2 className="text-sm font-bold text-white flex items-center gap-2"><Type className="w-4 h-4 text-primary" /> Text & Captions</h2>}
                            </div>

                            {/* Panel Body */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTool === 'viral-director' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                                            {/* Viral Score Meter */}
                                            <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 relative overflow-hidden">
                                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/20 blur-2xl rounded-full" />
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">Viral Score</span>
                                                    <span className="text-2xl font-black text-white">92<span className="text-sm text-zinc-500">/100</span></span>
                                                </div>
                                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-3">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                                                </div>
                                                <p className="text-[10px] text-zinc-400 leading-relaxed">
                                                    High retention probability! Great hook, but pacing dips in the middle.
                                                </p>
                                            </div>

                                            {/* AI Insights & Actions */}
                                            <div className="space-y-3">
                                                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">Actionable Insights</h3>
                                                
                                                <div className="p-4 rounded-xl bg-card border border-border group hover:border-primary/30 transition-colors">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                                                            <AlertCircle className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-white mb-1">2.4s Dead Air</p>
                                                            <p className="text-[10px] text-zinc-400 mb-3">At 00:14, there is a silence gap. Viewers usually scroll here.</p>
                                                            <button onClick={() => toast.success("Dead air removed!")} className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors border border-white/10">
                                                                Smart Cut
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-card border border-border group hover:border-primary/30 transition-colors">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                                                            <ImageIcon className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-white mb-1">Visual Reset Needed</p>
                                                            <p className="text-[10px] text-zinc-400 mb-3">Speaker is static for 12s. Add B-Roll to regain attention.</p>
                                                            <button onClick={() => toast.success("AI B-Roll Added!")} className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors border border-white/10">
                                                                Auto B-Roll
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* God Mode Auto-Fix */}
                                            <button className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all transform hover:-translate-y-0.5">
                                                <Wand2 className="w-4 h-4" /> ONE-CLICK AUTO FIX
                                            </button>
                                        </motion.div>
                                    )}

                                    {activeTool === 'reframe' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-sm">
                                            <p className="mb-4">Automatically tracks the main subject and keeps them in the center of the frame.</p>
                                            <button className="w-full py-2 bg-primary/20 text-primary font-bold rounded-lg border border-primary/30">Enable Smart Tracking</button>
                                        </motion.div>
                                    )}

                                    {activeTool === 'text' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 text-sm space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-white mb-2 block">Caption Style</label>
                                                <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-primary">
                                                    <option>Hormozi Style (Bold & Fast)</option>
                                                    <option>Minimal (Clean & Subtle)</option>
                                                    <option>Karaoke (Word by Word)</option>
                                                </select>
                                            </div>
                                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors">Regenerate Captions</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Far Right Global Sidebar */}
                        <div className="w-20 border-l border-border bg-card/30 flex flex-col items-center py-6 gap-3 overflow-y-auto custom-scrollbar shrink-0 z-30 shadow-[-10px_0_20px_rgba(0,0,0,0.2)]">
                            <ToolIcon icon={<Zap />} label="Viral AI" active={activeTool === 'viral-director'} onClick={() => setActiveTool('viral-director')} activeColor="text-yellow-400" />
                            <div className="w-8 h-px bg-white/10 my-2" />
                            <ToolIcon icon={<Crop />} label="Reframe" active={activeTool === 'reframe'} onClick={() => setActiveTool('reframe')} />
                            <ToolIcon icon={<Type />} label="Text" active={activeTool === 'text'} onClick={() => setActiveTool('text')} />
                            <ToolIcon icon={<MessageSquare />} label="Captions" active={activeTool === 'caption'} onClick={() => setActiveTool('caption')} />
                            <ToolIcon icon={<ImageIcon />} label="Thumbnail" active={activeTool === 'thumbnail'} onClick={() => setActiveTool('thumbnail')} />
                            <ToolIcon icon={<LayoutTemplate />} label="Templates" active={activeTool === 'template'} onClick={() => setActiveTool('template')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToolIcon({ icon, label, active, onClick, activeColor = "text-foreground" }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-[60px] h-[60px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all relative group",
                active ? "bg-[#1A1A1A] shadow-md border border-white/5" : "hover:bg-secondary border border-transparent"
            )}
        >
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
            <div className={cn("transition-colors", active ? activeColor : "text-muted-foreground group-hover:text-foreground")}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <span className={cn("text-[9px] font-bold tracking-wide transition-colors", active ? "text-white" : "text-muted-foreground")}>
                {label}
            </span>
        </button>
    );
}
