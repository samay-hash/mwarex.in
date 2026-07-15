import React, { useState, useEffect } from "react";
import { 
  User, Mail, Calendar, Edit3, Check, X, Lock, 
  Flame, Award, Clock, Sparkles, Trophy, ShieldAlert,
  Loader2, PlayCircle, Star, CheckCircle2, Heart, Activity, Timer, Sun,
  Zap, Target, Leaf, Crown, HeartCrack, LifeBuoy, Ghost
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setProfile(res.data.profile);
        setNewName(res.data.profile.name);
      }
    } catch (err) {
      console.error("Failed to fetch profile details:", err);
      toast.error("Failed to load profile statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(" ");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Check if name is change-restricted (7 days limit)
  const getNameLockoutInfo = () => {
    if (!profile?.lastNameUpdateAt) return { isLocked: false };
    const lastUpdate = new Date(profile.lastNameUpdateAt).getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const timeElapsed = Date.now() - lastUpdate;
    if (timeElapsed < sevenDaysInMs) {
      const nextAvailableDate = new Date(lastUpdate + sevenDaysInMs);
      const daysRemaining = Math.ceil((sevenDaysInMs - timeElapsed) / (24 * 60 * 60 * 1000));
      return { 
        isLocked: true, 
        daysRemaining, 
        nextAvailableDate: nextAvailableDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
      };
    }
    return { isLocked: false };
  };

  const lockout = getNameLockoutInfo();

  const handleUpdateName = async () => {
    const trimmed = newName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      toast.error("Name must be between 2 and 30 characters");
      return;
    }
    const alphaNumericSpacePattern = /^[a-zA-Z0-9 ]+$/;
    if (!alphaNumericSpacePattern.test(trimmed)) {
      toast.error("Name can only contain letters, numbers, and spaces");
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/user/update-profile", 
        { name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        toast.success(res.data.msg);
        setProfile(prev => ({
          ...prev,
          name: res.data.user.name,
          lastNameUpdateAt: new Date().toISOString()
        }));
        setEditingName(false);
        // Sync the sidebar immediately
        window.dispatchEvent(new CustomEvent("profileUpdated", { detail: res.data.user }));
      }
    } catch (err) {
      console.error("Error updating name:", err);
      toast.error(err.response?.data?.msg || "Failed to update profile name");
    } finally {
      setUpdating(false);
    }
  };

  const badgeDefinitions = [
    {
      id: "newbie",
      name: "Touched the Timer",
      description: "Log your first focus session. Look at you go, using the mouse.",
      icon: Zap,
      color: "from-green-500/10 to-lime-500/20 text-lime-400 border-lime-500/30",
      iconBg: "bg-lime-400 border-lime-400 text-black",
      // glow: "shadow-emerald-500/10"
    },
    {
      id: "locked_in",
      name: "Locked In",
      description: "Achieve a 7-day daily focus streak. The grind is real.",
      icon: Target,
      color: "from-orange-500/10 to-red-500/20 text-orange-400 border-red-500/30",
      iconBg: "bg-orange-400 border-orange-400 text-black",
      // glow: "shadow-orange-500/10"
    },
    {
      id: "unstoppable",
      name: "Touch Grass Pls",
      description: "Achieve a 30-day daily focus streak. The outside world has trees.",
      icon: Leaf,
      color: "from-green-500/10 to-teal-500/20 text-blue-400 border-blue-500/30",
      iconBg: "bg-emerald-400 border-emerald-400 text-black",
      // glow: "shadow-blue-500/10"
    },
    {
      id: "elite",
      name: "Has No Life",
      description: "Accumulate 50 hours of all-time focus. We are concerned.",
      icon: Crown,
      color: "from-purple-500/10 to-pink-500/20 text-purple-400 border-purple-500/30",
      iconBg: "bg-purple-400 border-purple-400 text-black",
      // glow: "shadow-purple-500/10"
    },
    {
      id: "day_conqueror",
      name: "No Grass Toucher",
      description: "Focus for 8+ hours in a single day. Your chair has a body shape now.",
      icon: Trophy,
      color: "from-yellow-500/20 to-amber-600/10 text-yellow-400 border-yellow-500/30",
      iconBg: "bg-yellow-400 border-yellow-400 text-black",
      // glow: "shadow-yellow-500/10"
    },
    {
      id: "okay_at_home",
      name: "Everything Okay At Home?",
      description: "Focus for 12+ hours in a single day. Do we need to call someone?",
      icon: ShieldAlert,
      color: "from-red-500/10 to-rose-500/20 text-red-400 border-red-500/30",
      iconBg: "bg-red-400 border-red-400 text-black",
      // glow: "shadow-red-500/10"
    },
    {
      id: "who_hurt_you",
      name: "Who Hurt You?",
      description: "Achieve a 365-day daily focus streak. Who broke your heart?",
      icon: HeartCrack,
      color: "from-rose-500/10 to-pink-500/20 text-rose-400 border-rose-500/30",
      iconBg: "bg-rose-400 border-rose-400 text-black",
      // glow: "shadow-rose-500/10"
    },
    {
      id: "seek_help",
      name: "Seek Professional Help",
      description: "Accumulate 100 hours of focus. Seriously, there is therapy for this.",
      icon: LifeBuoy,
      color: "from-teal-500/15 to-cyan-500/20 text-teal-400 border-teal-500/30",
      iconBg: "bg-teal-400 border-teal-400 text-black",
      // glow: "shadow-teal-500/10"
    },
    {
      id: "sunlight_allergic",
      name: "Allergic to Sunlight",
      description: "Achieve a 500-day focus streak. The sun is a myth.",
      icon: Ghost,
      color: "from-amber-500/10 to-yellow-500/20 text-amber-400 border-amber-500/30",
      iconBg: "bg-amber-400 border-amber-400 text-black",
      // glow: "shadow-amber-550/10"
    }
  ];

  if (loading) {
    return (
      <div className="h-screen w-screen bg-neutral-900 px-4 py-8 font-poppins overflow-y-auto sm:px-6 lg:px-10 flex justify-center">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-6 animate-pulse">
          <div className="h-44 w-full rounded-2xl bg-neutral-800/40 border border-white/5" />
          <div className="h-24 w-full rounded-2xl bg-neutral-800/40 border border-white/5" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-neutral-800/40 border border-white/5" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-6 w-36 bg-neutral-800/60 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-neutral-800/40 border border-white/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-neutral-900 px-4 py-8 font-poppins overflow-y-auto sm:px-6 lg:px-10 text-white"
         style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4">

        {/* Profile Identity Card */}
        <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden shadow-lg">
          <div className="relative group shrink-0">
            {profile?.picture ? (
              <img 
                src={profile.picture} 
                alt={profile.name} 
                className="size-24 rounded-full object-cover border border-white/10 shadow-lg transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="size-24 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center font-bold text-4xl text-neutral-300 shadow-lg">
                {profile?.name ? profile.name[0].toUpperCase() : "?"}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1.5 text-neutral-900 border-2 border-neutral-900 flex items-center justify-center shadow-md select-none">
              <Sparkles className="size-3.5 fill-neutral-900 text-neutral-900" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start w-full">
            <div className="flex items-center gap-2">
              {editingName ? (
                <div className="flex items-center gap-1.5 w-full max-w-xs justify-center md:justify-start">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-44 bg-neutral-900 border border-neutral-700/80 rounded px-2 py-1 text-white text-sm font-semibold outline-none focus:border-yellow-500/80 transition-all font-poppins"
                    placeholder="Enter display name"
                    maxLength={30}
                    disabled={updating}
                  />
                  <button 
                    onClick={handleUpdateName}
                    disabled={updating}
                    className="p-1.5 bg-yellow-500 hover:bg-yellow-400 text-neutral-900 rounded cursor-pointer transition active:scale-95 flex items-center justify-center shadow-sm"
                  >
                    {updating ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5 font-bold" />}
                  </button>
                  <button 
                    onClick={() => {
                      setNewName(profile.name);
                      setEditingName(false);
                    }}
                    disabled={updating}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded cursor-pointer transition active:scale-95 border border-white/5"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold text-white tracking-tight leading-none">
                    {profile?.name}
                  </h1>
                  <button
                    onClick={() => {
                      if (lockout.isLocked) {
                        toast.error(`Name change is locked. You can change it again on ${lockout.nextAvailableDate}`);
                      } else {
                        setEditingName(true);
                      }
                    }}
                    className="text-neutral-500 hover:text-white transition cursor-pointer active:scale-95 p-0.5"
                    title={lockout.isLocked ? `Locked until ${lockout.nextAvailableDate}` : "Edit Display Name"}
                  >
                    <Edit3 className="size-4" />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-3 text-xs text-neutral-400 font-medium w-full items-center md:items-start">
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-neutral-500" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-neutral-500" />
                <span>Joined {formatDate(profile?.joiningDate)}</span>
              </div>
            </div>

            {lockout.isLocked && (
              <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/25 bg-yellow-500/5 text-yellow-400/90 text-xs  leading-none mt-4">
                <ShieldAlert className="size-3.5 flex-shrink-0" />
                <span>Name change locked. You can edit it again on <strong className="text-yellow-400">{lockout.nextAvailableDate}</strong> (in {lockout.daysRemaining} days).</span>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Trophy Card */}
        <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-5 flex items-center gap-4 relative overflow-hidden shadow-lg hover:bg-neutral-950/30 transition-all duration-200">
          <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl text-yellow-500 shadow-md flex items-center justify-center shrink-0">
            <Trophy className="size-6 text-yellow-400" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] text-neutral-500  uppercase tracking-wider">All-Time Milestone Record</span>
            <h3 className="text-base sm:text-lg  text-white tracking-tight mt-1 truncate">
              {profile?.bestFocusDay && profile.bestFocusDay.time > 0 ? (
                <>
                  Focused for <span className="text-yellow-400 font-medium">{formatDuration(profile.bestFocusDay.time)}</span> in a single day
                </>
              ) : (
                "No focus logged yet"
              )}
            </h3>
            <span className="text-[11px] text-neutral-400 mt-1  leading-none">
              {profile?.bestFocusDay && profile.bestFocusDay.time > 0 ? (
                `Achieved on ${formatDate(profile.bestFocusDay.date)}`
              ) : (
                "Log daily stopwatch or countdown focus sessions to set records."
              )}
            </span>
          </div>
        </div>

        {/* 4-Column Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Today's Focus */}
          <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-4 flex flex-col justify-between shadow-md min-h-24 hover:bg-neutral-950/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500  uppercase tracking-wider">Today's Focus</span>
              <Clock className="size-4.5 text-blue-400" />
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-medium text-white leading-none">
                {formatDuration(profile?.todayTime)}
              </h3>
              <p className="text-[10px] text-neutral-400  mt-1">Logged today</p>
            </div>
          </div>

          {/* Current Streak */}
          <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-4 flex flex-col justify-between shadow-md min-h-24 hover:bg-neutral-950/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500  uppercase tracking-wider">Current Streak</span>
              <Flame className="size-4.5 text-orange-400" />
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-medium text-white leading-none">
                {profile?.currentStreak || 0} <span className="text-xs text-neutral-550  font-poppins">days</span>
              </h3>
              <p className="text-[10px] text-neutral-400  mt-1">Keep it consistent</p>
            </div>
          </div>

          {/* Best Streak */}
          <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-4 flex flex-col justify-between shadow-md min-h-24 hover:bg-neutral-950/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500  uppercase tracking-wider">Best Streak</span>
              <Award className="size-4.5 text-yellow-400" />
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-medium text-white leading-none">
                {profile?.bestStreak || 0} <span className="text-xs text-neutral-550  font-poppins">days</span>
              </h3>
              <p className="text-[10px] text-neutral-400  mt-1">All-time record</p>
            </div>
          </div>

          {/* All-Time Focus */}
          <div className="rounded-2xl border-2 border-white/5 bg-neutral-950/45 p-4 flex flex-col justify-between shadow-md min-h-24 hover:bg-neutral-950/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-500  uppercase tracking-wider">All-Time Focus</span>
              <PlayCircle className="size-4.5 text-purple-400" />
            </div>
            <div className="mt-3">
              <h3 className="text-xl sm:text-2xl font-medium text-white leading-none">
                {formatDuration(profile?.totalFocusTime)}
              </h3>
              <p className="text-[10px] text-neutral-400  mt-1">Across {profile?.totalSessions || 0} sessions</p>
            </div>
          </div>
        </div>

        {/* Achievements & Badges area */}
        <div className="space-y-4 mt-2">
          <h2 className="text-lg  text-white tracking-tight border-b border-white/5 pb-2">
            Achievements & Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeDefinitions.map((badge) => {
              const isUnlocked = profile?.badges?.includes(badge.id);
              // const isUnlocked = true  // tesing all unloacked in ui
              const IconComponent = badge.icon;
              return (
                <div 
                  key={badge.id}
                  className={`rounded-2xl border-2 p-4 flex items-start gap-4 relative overflow-hidden transition-all duration-200 group/badge hover:-translate-y-0.5 ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${badge.color} border-white/15 shadow-md ${badge.glow}`
                      : "bg-white/1 border-white/5 text-neutral-600 opacity-40 hover:opacity-50"
                  }`}
                >
                  {/* Badge Icon Block */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 h-fit transition-all duration-200 ${
                    isUnlocked 
                      ? `${badge.iconBg}` 
                      : "bg-neutral-950/20 border-white/5 text-neutral-600/40"
                  }`}>
                    {isUnlocked ? (
                      <IconComponent className="size-6 text-black drop-shadow-sm" />
                    ) : (
                      <IconComponent className="size-6 text-neutral-600/40" />
                    )}
                  </div>

                  {/* Badge Details Block */}
                  <div className="flex flex-col min-w-0 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm  tracking-tight ${isUnlocked ? "text-white" : "text-neutral-500"}`}>
                        {badge.name}
                      </span>
                      {isUnlocked && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white  select-none border border-white/5 tracking-wider">
                          EARNED
                        </span>
                      )}
                    </div>
                    <p className={`text-xs  mt-1 leading-relaxed ${
                      isUnlocked ? "text-neutral-400" : "text-neutral-550 text-neutral-500"
                    }`}>
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
