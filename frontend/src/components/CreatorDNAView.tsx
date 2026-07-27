"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Dna, Target, Activity, Zap, TrendingUp, Sparkles, AlertCircle, Heart, XCircle, ChevronRight, Fingerprint, Radar, RefreshCw, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeAPI } from "@/lib/api";

interface CreatorDNAViewProps {
    isYoutubeConnected?: boolean;
}

export default function CreatorDNAView({ isYoutubeConnected }: CreatorDNAViewProps) {
    const [dnaData, setDnaData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (isYoutubeConnected) {
            fetchDNA();
        } else {
            setIsLoading(false);
        }
    }, [isYoutubeConnected]);

    const fetchDNA = async () => {
        try {
            const res = await youtubeAPI.getDNA();
            setDnaData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch DNA:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setErrorMsg(null);
        try {
            const res = await youtubeAPI.analyze();
            setDnaData(res.data.data);
        } catch (error: any) {
            console.error("Failed to analyze:", error);
            setErrorMsg(error.response?.data?.error || "AI Analysis failed. Please check API quota or try again later.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isYoutubeConnected) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Connect YouTube First</h2>
                <p className="text-muted-foreground max-w-md">
                    Creator DNA requires access to your YouTube channel to analyze your performance and generate insights. Go to <strong>Integrations</strong> to connect.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center relative z-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-full p-8 md:p-12 relative max-w-7xl mx-auto">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">AI Intelligence Layer</span>
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6"
                    style={{ textShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                >
                    CREATOR<span className="text-primary font-light">DNA</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed mb-8"
                >
                    {dnaData ? `Insights generated for ${dnaData.channelName}` : "Analyze your channel to generate insights."}
                </motion.p>

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-white/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isAnalyzing ? "Analyzing Channel..." : (dnaData ? "Sync & Re-Analyze" : "Run AI Analysis")}
                </motion.button>
                
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl max-w-lg text-sm flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-left">{errorMsg}</span>
                    </motion.div>
                )}
            </div>

            {dnaData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    
                    {/* 1. CHANNEL DNA */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-1 rounded-3xl p-6 bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
                        
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                <Dna className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Channel DNA</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Heart className="w-3.5 h-3.5" /> Audience Loves
                                </h3>
                                <ul className="space-y-2">
                                    {dnaData.audienceDNA?.loves?.map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-2 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <XCircle className="w-3.5 h-3.5" /> Audience Ignores
                                </h3>
                                <ul className="space-y-2">
                                    {dnaData.audienceDNA?.ignores?.map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-zinc-300 bg-white/5 px-3 py-2 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Center Message */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="hidden lg:flex flex-col items-center justify-center text-center p-8 border-x border-white/5 relative"
                    >
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />
                        
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Every Channel<br/>Has A DNA.</h2>
                        <p className="text-primary font-bold tracking-widest">WE DECODE IT.</p>

                        <div className="mt-8 pt-6 border-t border-white/10 w-full">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Total Scanned</span>
                            <div className="text-3xl font-black text-white mt-1">{dnaData.videosAnalyzed || 0} Videos</div>
                        </div>
                    </motion.div>

                    {/* 2. NEXT MOVE ENGINE */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-1 rounded-3xl p-6 bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Next Move Engine</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Recommended Next Topic</h3>
                                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                                    <span className="text-lg font-bold text-white">"{dnaData.nextMoveEngine?.topic}"</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between bg-white/5 rounded-xl p-4">
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Confidence</h3>
                                    <div className="text-4xl font-black text-green-400">{dnaData.nextMoveEngine?.confidence || 0}%</div>
                                </div>
                                <div className="w-24 h-12 relative flex items-end justify-between gap-1">
                                    {[30, 40, 50, 60, 70, 85, 95].map((h, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: 0.6 + (i * 0.1) }}
                                            className={cn("w-full rounded-t-sm", i === 6 ? "bg-green-400" : "bg-green-400/20")} 
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-4 italic">
                                Angle: {dnaData.nextMoveEngine?.angle}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-4 border-t border-white/5 pt-4">
                                <div>
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Viral Prob.</h3>
                                    <div className={cn("text-lg font-black", dnaData.uploadPredictor?.viralProbability === "High" ? "text-green-400" : "text-yellow-400")}>
                                        {dnaData.uploadPredictor?.viralProbability || "Medium"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Best Time</h3>
                                    <div className="text-sm font-bold text-white">
                                        {dnaData.uploadPredictor?.bestUploadTime || "Check Analytics"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. VIDEO AUTOPSY (High vs Low Performer) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 rounded-3xl p-6 bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                <Activity className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Video Autopsy</h2>
                        </div>

                        {dnaData.performanceComparison ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* High Performer */}
                                <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded uppercase tracking-wider font-bold">High Performer</span>
                                            <h3 className="text-sm font-bold text-white mt-2 line-clamp-2">{dnaData.performanceComparison.highPerformer?.videoTitle}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0">
                                            <span className="text-lg font-black text-green-400">{dnaData.performanceComparison.highPerformer?.dnaScore}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-4 text-xs text-zinc-400 border-b border-green-500/10 pb-4">
                                        <div><span className="block text-white font-bold">{dnaData.performanceComparison.highPerformer?.views}</span> Views</div>
                                        <div><span className="block text-white font-bold">{dnaData.performanceComparison.highPerformer?.engagement}</span> Eng.</div>
                                    </div>
                                    <h4 className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Why it worked?</h4>
                                    <ul className="space-y-1">
                                        {dnaData.performanceComparison.highPerformer?.reasonsWorked?.map((reason: string, i: number) => (
                                            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                                <CheckCircleIcon className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Low Performer */}
                                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded uppercase tracking-wider font-bold">Low Performer</span>
                                            <h3 className="text-sm font-bold text-white mt-2 line-clamp-2">{dnaData.performanceComparison.lowPerformer?.videoTitle}</h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0">
                                            <span className="text-lg font-black text-red-400">{dnaData.performanceComparison.lowPerformer?.dnaScore}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mb-4 text-xs text-zinc-400 border-b border-red-500/10 pb-4">
                                        <div><span className="block text-white font-bold">{dnaData.performanceComparison.lowPerformer?.views}</span> Views</div>
                                        <div><span className="block text-white font-bold">{dnaData.performanceComparison.lowPerformer?.engagement}</span> Eng.</div>
                                    </div>
                                    <h4 className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Why it underperformed?</h4>
                                    <ul className="space-y-1">
                                        {dnaData.performanceComparison.lowPerformer?.reasonsUnderperformed?.map((reason: string, i: number) => (
                                            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                                <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Best Performer</h3>
                                <p className="text-sm text-white mb-4">"{dnaData.videoAutopsy?.videoTitle}"</p>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Viral Signals Detected</h3>
                                <ul className="space-y-3">
                                    {dnaData.videoAutopsy?.signals?.map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                <CheckCircleIcon className="w-3 h-3" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>

                    {/* 4. CRITICAL MISTAKES (NEW) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="rounded-3xl p-6 bg-red-950/20 backdrop-blur-xl border border-red-500/20 shadow-2xl relative overflow-hidden group hover:border-red-500/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full" />
                        <div className="flex items-center gap-3 mb-6 border-b border-red-500/10 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Critical Mistakes</h2>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {dnaData.criticalMistakes?.length > 0 ? (
                                <ul className="space-y-3">
                                    {dnaData.criticalMistakes.map((mistake: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-200 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            <span>{mistake}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-zinc-400">No major critical mistakes detected. Keep it up!</p>
                            )}
                        </div>
                    </motion.div>

                    {/* 5. OPPORTUNITY RADAR */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="rounded-3xl p-6 bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Opportunity Radar</h2>
                        </div>

                        <div className="space-y-6">
                            {dnaData.opportunities?.map((opp: any, i: number) => (
                                <div key={i}>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Emerging Topic</h3>
                                    <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                                        <span className="text-base font-bold text-white">{opp.topic}</span>
                                    </div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Competition</h3>
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                                        <span className={cn("text-xl font-black", opp.competition === 'Low' ? 'text-green-400' : 'text-yellow-400')}>{opp.competition}</span>
                                        <div className="flex-1 flex justify-end">
                                            <Radar className="w-6 h-6 text-green-400 animate-spin" style={{ animationDuration: '3s' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 6. CREATOR STYLE DNA */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="rounded-3xl p-6 bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                                <Fingerprint className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Creator Style DNA</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hook Patterns</h3>
                                <ul className="space-y-2">
                                    {dnaData.styleDNA?.hookPatterns?.map((hook: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <span>{hook}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Story Structure</h3>
                                <ul className="space-y-2">
                                    {dnaData.styleDNA?.storyStructure?.map((story: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <span>{story}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function StyleRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-zinc-400">{label}</span>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
