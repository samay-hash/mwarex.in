"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home, Video, Scissors, Folder, Settings, Search, Play, Pause, SkipBack, SkipForward,
    ZoomIn, ZoomOut, ChevronDown, Sparkles, Type, AudioLines, SlidersHorizontal, Image as ImageIcon,
    Share2, Monitor, Smartphone, Music, Layers, Undo2, Redo2, Trash2, X, Plus, 
    Copy, Save, MousePointer2, Move, LayoutTemplate, Eye, RefreshCw, BoxSelect,
    MessageSquare, Upload, Maximize, Loader2, Crop, Filter, LockKeyhole,
    Cloud, ChevronRight, SplitSquareHorizontal, Wand2, Instagram, Youtube, Zap, Volume2
} from "lucide-react";
import { videoAPI, s3API } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getUserData } from "@/lib/auth";

export default function ProjectWorkspace() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [video, setVideo] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [signedVideoSrc, setSignedVideoSrc] = useState<string>("");

    // Layout & UI State
    const [activeMediaTab, setActiveMediaTab] = useState<"all" | "videos" | "images" | "audio">("all");
    const [activeInspectorTab, setActiveInspectorTab] = useState<"video" | "audio" | "effects" | "adjust">("video");
    const [activeGlobalTool, setActiveGlobalTool] = useState<string>("media");
    
    // Canvas & Player State
    const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
    const videoRef = useRef<HTMLVideoElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [clips, setClips] = useState<any[]>([]);

    // History for Undo/Redo
    const [history, setHistory] = useState<any[][]>([]);
    const [future, setFuture] = useState<any[][]>([]);

    // AI Copilot State
    const [showComments, setShowComments] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [isAITyping, setIsAITyping] = useState(false);
    
    // Timeline Edits Tracking (For AI Demo)
    const [timelineEffects, setTimelineEffects] = useState<any[]>([
        { id: 1, type: "audio", name: "Chill Background", start: 0, duration: 100, track: "audio", color: "emerald" },
        { id: 2, type: "text", name: "Hook Caption", start: 5, duration: 15, track: "text", color: "purple" }
    ]);

    // Autosave & Export State
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const data = getUserData();
        setUserData(data);
        fetchVideo();
        setLastSaved("Autosaved just now");
    }, [id]);

    const fetchVideo = async () => {
        try {
            const res = await videoAPI.getVideo(id);
            const vData = res.data;
            setVideo(vData);

            if (vData.comments) setComments(vData.comments);
            if (vData.editSettings?.nleState?.clips) {
                setClips(vData.editSettings.nleState.clips);
            } else {
                setClips([{ id: "c1", title: "Project_Main.mp4", duration: "04:12" }]);
            }

            const isRaw = (vData.status === "raw_uploaded" || vData.status === "editing_in_progress") && !!vData.rawFileUrl;
            const targetUrl = isRaw ? vData.rawFileUrl : vData.fileUrl;
            if (targetUrl && targetUrl.includes("amazonaws.com")) {
                const s3Res = await s3API.getDownloadUrl(id, isRaw);
                setSignedVideoSrc(s3Res.data.signedUrl);
            } else {
                setSignedVideoSrc(getVideoUrl(targetUrl || ""));
            }
        } catch (error) { console.error(error); }
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

    // --- Player Controls ---
    const togglePlay = () => {
        if (videoRef.current) {
            isPlaying ? videoRef.current.pause() : videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(videoRef.current.duration || 300);
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (timelineRef.current && videoRef.current && duration > 0) {
            const rect = timelineRef.current.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const newTime = percentage * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor((seconds || 0) / 60);
        const s = Math.floor((seconds || 0) % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // --- AI Copilot Chat Engine ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;
        
        const newMsg = { text: chatMessage, isAI: false };
        setComments(prev => [...prev, newMsg]);
        const prompt = chatMessage.toLowerCase();
        setChatMessage("");
        setIsAITyping(true);

        setTimeout(() => {
            let aiResponse = "I've updated the project settings for you.";
            let newEffect = null;

            if (prompt.includes("b-roll") || prompt.includes("broll") || prompt.includes("nature")) {
                aiResponse = "Added a cinematic nature B-roll clip at the current playhead.";
                newEffect = { id: Date.now(), type: "video", name: "Cinematic B-Roll", start: progressPercentage, duration: 15, track: "video", color: "blue" };
            } else if (prompt.includes("zoom") || prompt.includes("reframe")) {
                aiResponse = "Applied Smart Zoom to keep the subject centered.";
                newEffect = { id: Date.now(), type: "effect", name: "Smart Zoom", start: progressPercentage, duration: 20, track: "effect", color: "yellow" };
            } else if (prompt.includes("music") || prompt.includes("audio")) {
                aiResponse = "Added trending background music and ducked the main audio.";
                newEffect = { id: Date.now(), type: "audio", name: "Trending Beat", start: 0, duration: 100, track: "audio", color: "emerald" };
            } else if (prompt.includes("caption") || prompt.includes("text")) {
                aiResponse = "Generated dynamic captions with highlights.";
                newEffect = { id: Date.now(), type: "text", name: "Dynamic Captions", start: 0, duration: 100, track: "text", color: "purple" };
            }

            setComments(prev => [...prev, { text: aiResponse, isAI: true }]);
            if (newEffect) {
                setTimelineEffects(prev => [...prev, newEffect]);
                toast.success(aiResponse);
            }
            setIsAITyping(false);
        }, 1500);
    };

    return (
        <div className="h-screen bg-[#0A0A0A] text-zinc-300 flex flex-col font-sans overflow-hidden selection:bg-[#8B5CF6]/30">
            
            {/* 1. TOP BAR */}
            <header className="h-[60px] shrink-0 border-b border-white/5 bg-[#111111] flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <img src="/mwarexlogo.png" alt="Logo" className="h-6 mr-2 cursor-pointer" onClick={() => router.push('/dashboard/creator')} />
                    <span className="text-xs text-zinc-500 font-medium">Project</span>
                    <button className="text-sm font-semibold text-white flex items-center gap-1 hover:bg-white/5 px-2 py-1 rounded transition-colors">{video?.title || 'Untitled Project'} <ChevronDown className="w-4 h-4 text-zinc-500" /></button>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 ml-4 px-2 py-1 bg-white/5 rounded-full border border-white/5">
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3 text-primary" />}
                        <span>{lastSaved}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#161616] rounded-lg p-1 border border-white/5">
                        <button className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-white/5 transition-colors"><Undo2 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-zinc-500 hover:text-white rounded hover:bg-white/5 transition-colors"><Redo2 className="w-4 h-4" /></button>
                    </div>

                    <button 
                        onClick={() => setShowComments(!showComments)} 
                        className={cn("h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all border", showComments ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 hover:bg-white/10 text-white border-white/10")}
                    >
                        <Wand2 className="w-4 h-4" /> AI Copilot
                    </button>
                    
                    <button 
                        onClick={() => toast.success("Project exported successfully!")} 
                        className="h-9 px-6 rounded-lg bg-foreground hover:bg-zinc-200 text-background text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        <Upload className="w-4 h-4" /> Export
                    </button>
                    <div className="w-8 h-8 rounded-full ml-2 overflow-hidden border border-white/10 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs">
                        {userData?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                </div>
            </header>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* 2. PRIMARY SIDEBAR (Far Left) */}
                <aside className="w-16 bg-[#111111] border-r border-white/5 flex flex-col items-center py-6 shrink-0 z-10 gap-3">
                    <GlobalTool icon={<Folder />} label="Media" active={activeGlobalTool === 'media'} onClick={() => setActiveGlobalTool('media')} />
                    <GlobalTool icon={<Music />} label="Audio" active={activeGlobalTool === 'audio'} onClick={() => setActiveGlobalTool('audio')} />
                    <GlobalTool icon={<Type />} label="Text" active={activeGlobalTool === 'text'} onClick={() => setActiveGlobalTool('text')} />
                    <GlobalTool icon={<Layers />} label="Elements" active={activeGlobalTool === 'elements'} onClick={() => setActiveGlobalTool('elements')} />
                    <GlobalTool icon={<Sparkles />} label="Effects" active={activeGlobalTool === 'effects'} onClick={() => setActiveGlobalTool('effects')} />
                    <div className="flex-1" />
                    <GlobalTool icon={<Settings />} label="Settings" active={activeGlobalTool === 'settings'} onClick={() => setActiveGlobalTool('settings')} />
                </aside>

                {/* 3. SECONDARY MEDIA / TOOLS PANEL */}
                <aside className="hidden md:flex w-[300px] bg-[#161616] border-r border-white/5 flex-col shrink-0">
                    <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#111111]">
                        <h2 className="text-sm font-bold text-white capitalize">{activeGlobalTool}</h2>
                        <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Plus className="w-4 h-4 text-white" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                        {/* If Media is active, show tabs */}
                        {activeGlobalTool === 'media' && (
                            <>
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <MediaTab label="Project" active={activeMediaTab === 'all'} onClick={() => setActiveMediaTab('all')} />
                                    <MediaTab label="AI Clips" active={activeMediaTab === 'videos'} onClick={() => setActiveMediaTab('videos')} />
                                </div>

                                {activeMediaTab === 'all' && (
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                                            <input type="text" placeholder="Search project media..." className="w-full bg-[#0A0A0A] border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-primary/50" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 cursor-pointer hover:border-white/20 transition-colors group">
                                            <div className="flex items-center gap-3"><Video className="w-4 h-4 text-primary" /><span className="text-xs font-semibold text-white">Main_Recording.mp4</span></div>
                                            <span className="text-[10px] text-zinc-500">04:12</span>
                                        </div>
                                    </div>
                                )}

                                {activeMediaTab === 'videos' && (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((clip, i) => (
                                            <div key={i} className="group rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-primary/30 transition-all flex flex-col relative">
                                                <div className="aspect-[9/16] bg-zinc-900 relative">
                                                    <img src={`https://source.unsplash.com/random/400x700?portrait&sig=${i}`} className="w-full h-full object-cover opacity-80" alt="" />
                                                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white backdrop-blur-sm">00:{15 + i*5}</div>
                                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-green-500/90 text-[9px] font-bold text-white backdrop-blur-sm">Score: {95 - i}</div>
                                                    
                                                    {/* Quick Export Overlay */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                                        <button onClick={() => toast.success("Exporting for YT Shorts!")} className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors" title="Export to YT Shorts"><Youtube className="w-4 h-4" /></button>
                                                        <button onClick={() => toast.success("Exporting for Instagram!")} className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white transition-colors" title="Export to Instagram"><Instagram className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-[11px] font-semibold text-zinc-300 mb-1 truncate">Viral Hook Clip #{i+1}</p>
                                                    <button onClick={() => router.push(`/dashboard/video/${id}/clip/clip_${i}`)} className="w-full py-1.5 mt-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all">
                                                        <Scissors className="w-3 h-3" /> Open in Editor
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeGlobalTool !== 'media' && (
                            <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                                <Wand2 className="w-8 h-8 text-zinc-500 mb-3" />
                                <p className="text-xs text-zinc-400 font-medium">Select an item on the timeline<br/>to edit {activeGlobalTool}.</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* 4. MAIN PLAYER CANVAS */}
                <div className="flex-1 flex flex-col bg-[#0A0A0A] relative overflow-hidden">
                    
                    {/* Top Canvas Header (Aspect Ratio) */}
                    <div className="h-14 flex items-center justify-between px-6 z-10 shrink-0 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur">
                        <div className="flex bg-[#161616] p-1 rounded-lg border border-white/5">
                            <AspectBtn icon={<Monitor className="w-4 h-4" />} label="16:9" active={aspectRatio === "16:9"} onClick={() => setAspectRatio("16:9")} />
                            <AspectBtn icon={<Smartphone className="w-4 h-4" />} label="9:16" active={aspectRatio === "9:16"} onClick={() => setAspectRatio("9:16")} />
                            <AspectBtn icon={<SplitSquareHorizontal className="w-4 h-4" />} label="1:1" active={aspectRatio === "1:1"} onClick={() => setAspectRatio("1:1")} />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white transition-colors">Fit Canvas <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /></button>
                        </div>
                    </div>

                    {/* The Player Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-hidden">
                        
                        {/* Dynamic Aspect Ratio Wrapper */}
                        <div 
                            className={cn(
                                "bg-black rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative group transition-all duration-500 ease-in-out",
                                aspectRatio === "16:9" ? "w-full max-w-5xl aspect-video" : 
                                aspectRatio === "9:16" ? "h-full max-h-[700px] aspect-[9/16]" : 
                                "h-full max-h-[600px] aspect-square"
                            )}
                        >
                            {signedVideoSrc ? (
                                <video 
                                    ref={videoRef} 
                                    src={signedVideoSrc} 
                                    className="w-full h-full object-cover" 
                                    onTimeUpdate={handleTimeUpdate} 
                                    onLoadedMetadata={handleLoadedMetadata} 
                                    onClick={togglePlay}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-[#111]">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                                    <span className="text-xs font-semibold text-zinc-400">Loading Source Video...</span>
                                </div>
                            )}
                            
                            {/* Overlay Controls */}
                            <div className={cn(
                                "absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end px-6 pb-4 transition-opacity duration-300 pointer-events-none",
                                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                            )}>
                                <div className="flex items-center justify-between w-full text-white pointer-events-auto">
                                    <span className="text-xs font-mono font-medium tracking-wide bg-black/50 px-2 py-1 rounded backdrop-blur">{formatTime(currentTime)} <span className="text-zinc-400">/ {formatTime(duration)}</span></span>
                                    <div className="flex items-center gap-4">
                                        <button className="text-zinc-300 hover:text-white transition-colors" onClick={() => {if(videoRef.current) videoRef.current.currentTime -= 5}}><SkipBack className="w-5 h-5 fill-current" /></button>
                                        <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(var(--primary),0.4)]">
                                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                        </button>
                                        <button className="text-zinc-300 hover:text-white transition-colors" onClick={() => {if(videoRef.current) videoRef.current.currentTime += 5}}><SkipForward className="w-5 h-5 fill-current" /></button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="text-zinc-300 hover:text-white"><Volume2 className="w-5 h-5" /></button>
                                        <button className="text-zinc-300 hover:text-white"><Maximize className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Copilot Side Panel (Slides in) */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 340, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="bg-[#111111] border-l border-white/5 z-40 flex flex-col shadow-2xl shrink-0 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#151515] shrink-0 w-[340px]">
                                <h2 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 className="w-4 h-4 text-primary" /> AI Copilot</h2>
                                <button onClick={() => setShowComments(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar w-[340px]">
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-xs font-semibold text-white">How can I help edit?</p>
                                    <p className="text-[10px] text-zinc-500 mt-1">Try saying "Add nature b-roll" or "Make it cinematic"</p>
                                </div>

                                {comments.map((c, i) => (
                                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className={cn("flex flex-col max-w-[85%]", c.isAI ? "items-start" : "items-end ml-auto")}>
                                        <div className={cn("px-3 py-2 text-xs leading-relaxed", c.isAI ? "bg-white/10 text-zinc-200 rounded-2xl rounded-tl-none border border-white/5" : "bg-primary text-primary-foreground font-medium rounded-2xl rounded-tr-none shadow-md")}>
                                            {c.text}
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {isAITyping && (
                                    <div className="flex items-start max-w-[85%]">
                                        <div className="px-4 py-3 bg-white/5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#0A0A0A] shrink-0 w-[340px]">
                                <div className="relative flex items-center">
                                    <input 
                                        type="text" 
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Prompt to edit..." 
                                        className="w-full bg-[#161616] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white outline-none focus:border-primary/50 placeholder:text-zinc-500 shadow-inner" 
                                    />
                                    <button type="submit" disabled={!chatMessage.trim() || isAITyping} className="absolute right-1.5 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 5. ADVANCED BOTTOM TIMELINE */}
            <div className="h-[260px] shrink-0 bg-[#0A0A0A] border-t border-white/5 flex flex-col z-20">
                
                {/* Timeline Tools Header */}
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-[#111111]">
                    <div className="flex items-center gap-3 text-zinc-400">
                        <button className="hover:text-white transition-colors" title="Split"><Scissors className="w-4 h-4" /></button>
                        <button className="hover:text-white transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <button className="hover:text-white transition-colors text-xs font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Remove Silences</button>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                        <ZoomOut className="w-4 h-4" />
                        <input type="range" className="w-24 accent-primary h-1 bg-[#161616] rounded-full appearance-none cursor-pointer" />
                        <ZoomIn className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden relative">
                    
                    {/* Track Headers (Left Side) */}
                    <div className="hidden md:flex w-[160px] lg:w-[200px] bg-[#111111] border-r border-white/5 flex-col z-10 shrink-0">
                        <div className="h-8 border-b border-white/5 bg-[#0A0A0A]" /> {/* Ruler Spacer */}
                        
                        <div className="flex-1 flex flex-col pt-2 space-y-1 px-2">
                            <TrackHeader icon={<Video />} label="Main Video" />
                            <TrackHeader icon={<Layers />} label="B-Roll / Effects" />
                            <TrackHeader icon={<Type />} label="Text" />
                            <TrackHeader icon={<Music />} label="Audio" />
                        </div>
                    </div>

                    {/* Timeline Grid & Tracks */}
                    <div className="flex-1 bg-[#0A0A0A] relative flex flex-col overflow-x-auto overflow-y-hidden custom-scrollbar">
                        
                        {/* Ruler */}
                        <div className="h-8 border-b border-white/5 relative min-w-[800px] w-full shrink-0">
                            <div className="absolute inset-0 flex justify-between text-[10px] text-zinc-600 font-mono items-end pb-1 px-4 select-none">
                                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
                                    <span key={p}>{formatTime((duration * p) / 100)}</span>
                                ))}
                            </div>
                        </div>

                        {/* Tracks Area */}
                        <div 
                            className="flex-1 relative pt-2 min-w-[800px] w-full cursor-text"
                            ref={timelineRef}
                            onClick={handleTimelineClick}
                        >
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                                {[...Array(11)].map((_, i) => <div key={i} className="w-px h-full bg-white/[0.02]" />)}
                            </div>

                            {/* Track 1: Main Video */}
                            <div className="h-14 relative px-4 flex items-center group">
                                <div className="absolute left-4 right-4 h-12 rounded-lg border-2 border-primary overflow-hidden flex bg-zinc-900 shadow-[0_0_15px_rgba(var(--primary),0.1)] group-hover:border-primary/80 transition-colors">
                                    <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&h=100&auto=format&fit=crop')] bg-repeat-x" />
                                    <span className="absolute left-2 top-1 text-[10px] font-bold text-white bg-black/60 px-1 rounded backdrop-blur">Source.mp4</span>
                                </div>
                            </div>

                            {/* Track 2: B-Roll / Effects */}
                            <div className="h-10 relative px-4 flex items-center mt-1">
                                <AnimatePresence>
                                    {timelineEffects.filter(e => e.track === 'video' || e.track === 'effect').map(effect => (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            key={effect.id} 
                                            className={cn("absolute h-8 rounded-md flex items-center px-2 shadow-md border", `bg-${effect.color}-500/20 border-${effect.color}-500/40 text-${effect.color}-400`)}
                                            style={{ left: `calc(1rem + ${effect.start}%)`, width: `${effect.duration}%` }}
                                        >
                                            <span className="text-[10px] font-bold truncate">{effect.name}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Track 3: Text */}
                            <div className="h-10 relative px-4 flex items-center mt-1">
                                <AnimatePresence>
                                    {timelineEffects.filter(e => e.track === 'text').map(effect => (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            key={effect.id} 
                                            className={cn("absolute h-8 rounded-md flex items-center px-2 shadow-md border", `bg-${effect.color}-500/20 border-${effect.color}-500/40 text-${effect.color}-400`)}
                                            style={{ left: `calc(1rem + ${effect.start}%)`, width: `${effect.duration}%` }}
                                        >
                                            <Type className="w-3 h-3 mr-1 shrink-0" />
                                            <span className="text-[10px] font-bold truncate">{effect.name}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Track 4: Audio */}
                            <div className="h-10 relative px-4 flex items-center mt-1">
                                <AnimatePresence>
                                    {timelineEffects.filter(e => e.track === 'audio').map(effect => (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            key={effect.id} 
                                            className={cn("absolute h-8 rounded-md flex items-center px-2 shadow-md border overflow-hidden", `bg-${effect.color}-500/20 border-${effect.color}-500/40 text-${effect.color}-400`)}
                                            style={{ left: `calc(1rem + ${effect.start}%)`, width: `${effect.duration}%` }}
                                        >
                                            <span className="text-[10px] font-bold truncate z-10 absolute left-2">{effect.name}</span>
                                            {/* Mock Waveform */}
                                            <div className="absolute inset-0 flex items-center opacity-30 px-2 gap-0.5 pt-3">
                                                {[...Array(50)].map((_, i) => <div key={i} className={cn("flex-1 rounded-full", `bg-${effect.color}-500`)} style={{ height: `${Math.max(20, Math.random() * 80)}%` }} />)}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* THE PLAYHEAD */}
                            <div 
                                className="absolute top-0 bottom-0 w-px bg-white z-30 pointer-events-none transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                                style={{ left: `calc(1rem + ${progressPercentage}%)` }}
                            >
                                <div className="absolute -top-2 -translate-x-1/2 w-3 h-4 bg-white rounded-sm flex items-center justify-center shadow-md">
                                    <div className="w-px h-2 bg-black/30" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function GlobalTool({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn("w-[52px] h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group", active ? "bg-[#1A1A1A] border border-white/10" : "hover:bg-white/5 border border-transparent")}
        >
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />}
            <div className={cn("transition-colors", active ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300")}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <span className={cn("text-[9px] font-bold tracking-wide transition-colors", active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")}>
                {label}
            </span>
        </button>
    );
}

function AspectBtn({ icon, label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn("px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all", active ? "bg-[#222] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
        >
            {React.cloneElement(icon, { className: active ? "text-primary" : "text-inherit" })}
            {label}
        </button>
    );
}

function MediaTab({ label, active, onClick }: any) {
    return (
        <button 
            onClick={onClick} 
            className={cn("px-1 py-1.5 text-xs font-bold relative transition-colors", active ? "text-white" : "text-zinc-500 hover:text-zinc-300")}
        >
            {label}
            {active && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />}
        </button>
    );
}

function TrackHeader({ icon, label }: any) {
    return (
        <div className="h-10 rounded-lg bg-transparent flex items-center px-3 gap-2.5 group hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            {React.cloneElement(icon, { className: "w-3.5 h-3.5 text-zinc-500" })}
            <span className="text-[11px] font-semibold text-zinc-400 flex-1 group-hover:text-zinc-200 transition-colors">{label}</span>
            <div className="flex gap-1.5 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all">
                <LockKeyhole className="w-3 h-3 hover:text-white cursor-pointer" />
                <Eye className="w-3 h-3 hover:text-white cursor-pointer" />
            </div>
        </div>
    );
}
