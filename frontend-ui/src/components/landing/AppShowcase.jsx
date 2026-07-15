import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Timer,
} from "lucide-react";

const MotionDiv = motion.div;
const MotionCircle = motion.circle;
const MotionSpan = motion.span;

// ----------------------------------------------------
// 6. AppShowcase Component (Tabbed SaaS Mockup - Light Theme & Responsive)
// ----------------------------------------------------
export default function AppShowcase() {
  const [activeTab, setActiveTab] = useState("timer");

  // Timer tab states
  const [timerVal, setTimerVal] = useState(1500); // 25:00
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusTag, setFocusTag] = useState("Coding");

  // Leaderboard tab states
  const [searchQuery, setSearchQuery] = useState("");
  const [lbFilter, setLbFilter] = useState("Weekly");

  useEffect(() => {
    let t;
    if (timerRunning && timerVal > 0) {
      t = setInterval(() => {
        setTimerVal((prev) => prev - 1);
      }, 1000);
    } else if (timerVal === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(t);
  }, [timerRunning, timerVal]);

  const handleStartStop = () => setTimerRunning(!timerRunning);
  const handleReset = () => {
    setTimerRunning(false);
    setTimerVal(1500);
  };

  const formatShowcaseTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const tagColor = {
    Coding: {
      accent: "text-indigo-600",
      bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      hover: "hover:bg-indigo-100",
      pulse: "bg-indigo-500",
      stroke: "#4f46e5",
    },
    Design: {
      accent: "text-rose-600",
      bg: "bg-rose-55 bg-rose-50 text-rose-600 border-rose-200",
      hover: "hover:bg-rose-100",
      pulse: "bg-rose-500",
      stroke: "#e11d48",
    },
    Study: {
      accent: "text-emerald-600",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      hover: "hover:bg-emerald-100",
      pulse: "bg-emerald-500",
      stroke: "#059669",
    },
  };

  const currentTheme = tagColor[focusTag];
  const progress = (timerVal / 1500) * 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const weeklyRankings = [
    { rank: 1, name: "Maya", time: "28h 12m", streak: "21d", active: true },
    { rank: 2, name: "Aarav", time: "24h 45m", streak: "16d", active: false },
    { rank: 3, name: "Sam", time: "21h 10m", streak: "9d", active: true },
    { rank: 4, name: "Liam", time: "18h 50m", streak: "5d", active: false },
    { rank: 5, name: "Sophia", time: "15h 30m", streak: "12d", active: true },
    { rank: 6, name: "Daniel", time: "12h 15m", streak: "7d", active: false },
  ];

  const monthlyRankings = [
    { rank: 1, name: "Maya", time: "112h 45m", streak: "21d", active: true },
    { rank: 2, name: "Sam", time: "96h 20m", streak: "9d", active: true },
    { rank: 3, name: "Aarav", time: "92h 15m", streak: "16d", active: false },
    { rank: 4, name: "Liam", time: "84h 10m", streak: "5d", active: false },
    { rank: 5, name: "Sophia", time: "78h 50m", streak: "12d", active: true },
    { rank: 6, name: "Daniel", time: "64h 30m", streak: "7d", active: false },
  ];

  const activeRankings =
    lbFilter === "Weekly" ? weeklyRankings : monthlyRankings;
  const filteredRankings = activeRankings.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-neutral-200/80 bg-neutral-50/65 p-2 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur relative overflow-hidden">
      <div className="rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 text-left relative overflow-hidden">
        {/* Mock Browser Frame Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-4 gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider ml-1 sm:ml-2">
                timmo.app/dashboard
              </span>
            </div>
          </div>

          {/* Tab Selector (Responsive Scroll/Pill Bar) */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-full border border-neutral-200/60 self-center max-w-full overflow-x-auto no-scrollbar whitespace-nowrap">
            {[
              { id: "timer", label: "Focus Timer", icon: Timer },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
              { id: "leaderboard", label: "Leaderboard", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  id={`showcase-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-350 cursor-pointer ${
                    isSelected
                      ? "text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {isSelected && (
                    <MotionDiv
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white shadow-sm border border-neutral-200/35 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab View Container */}
        <div className="min-h-[340px] sm:min-h-[360px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "timer" && (
              <MotionDiv
                key="timerTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 sm:p-6 flex flex-col items-center relative w-full overflow-hidden">
                  {/* Category Chips */}
                  <div className="flex gap-1.5 sm:gap-2 self-start mb-6 w-full overflow-x-auto no-scrollbar whitespace-nowrap">
                    {["Coding", "Design", "Study"].map((cat) => (
                      <button
                        id={`category-chip-${cat}`}
                        key={cat}
                        onClick={() => setFocusTag(cat)}
                        className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
                          focusTag === cat
                            ? currentTheme.bg
                            : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Scalable Circle Timer Display */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mb-6">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 192 192"
                    >
                      <circle
                        cx="96"
                        cy="96"
                        r={radius}
                        className="stroke-neutral-100"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <MotionCircle
                        cx="96"
                        cy="96"
                        r={radius}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{
                          strokeDashoffset,
                          stroke: currentTheme.stroke,
                        }}
                        transition={{ duration: 0.5, ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                        {formatShowcaseTime(timerVal)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-1 text-neutral-400">
                        {focusTag}
                      </span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full max-w-xs justify-center font-sans">
                    <button
                      id="showcase-play-btn"
                      onClick={handleStartStop}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-white py-2.5 sm:py-3 text-xs font-bold transition shadow shadow-neutral-950/5 active:scale-95 cursor-pointer"
                    >
                      {timerRunning ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      {timerRunning ? "Pause" : "Start Session"}
                    </button>
                    <button
                      id="showcase-reset-btn"
                      onClick={handleReset}
                      className="rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-855 p-2.5 sm:p-3 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-snug">
                    Workspace setup that fits your flow.
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-medium">
                    Commit to deep study sprints, track code blocks, or catalog
                    layout design blocks. Switch tags instantly to align your
                    workspace palette with your current active focus task.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-1 sm:pt-2 font-sans">
                    <div className="border border-neutral-200 bg-neutral-50/40 p-3 rounded-xl">
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-800">
                        Full Screen Mode
                      </span>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 font-semibold leading-tight">
                        Quiet full-screen clock for study, work blocks, and deep
                        focus rituals.
                      </p>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            )}

            {activeTab === "analytics" && (
              <MotionDiv
                key="analyticsTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 w-full overflow-hidden">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Performance Insights
                      </span>
                      <p className="text-sm sm:text-base font-bold text-neutral-900 mt-0.5">
                        Focus Duration Chart
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-neutral-200 shadow-sm whitespace-nowrap">
                      Last 12 days
                    </span>
                  </div>

                  {/* Responsive flex-basis bar graph */}
                  <div className="flex h-44 sm:h-52 items-end gap-1.5 sm:gap-2 px-1 w-full">
                    {[
                      { l: "Mon", v: 34 },
                      { l: "Tue", v: 58 },
                      { l: "Wed", v: 42 },
                      { l: "Thu", v: 78 },
                      { l: "Fri", v: 64 },
                      { l: "Sat", v: 88 },
                      { l: "Sun", v: 55 },
                      { l: "Mon", v: 46 },
                      { l: "Tue", v: 72 },
                      { l: "Wed", v: 90 },
                      { l: "Thu", v: 61 },
                      { l: "Fri", v: 80 },
                    ].map((b, idx) => (
                      <div
                        key={idx}
                        className="w-full flex flex-col items-center gap-1.5 group/shbar"
                      >
                        <div className="relative w-full h-28 sm:h-36 flex items-end">
                          <MotionSpan
                            initial={{ height: 0 }}
                            animate={{ height: `${b.v}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.03 }}
                            className="w-full rounded-t-sm bg-neutral-900 hover:bg-indigo-650 hover:bg-indigo-600 transition-colors duration-250 cursor-pointer"
                          />
                          <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/shbar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {(b.v / 10).toFixed(1)}h
                          </div>
                        </div>
                        <span className="text-[9px] text-neutral-450 font-bold">
                          {b.l.substring(0, 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 font-sans">
                    {[
                      {
                        title: "Total focus",
                        val: "142.5h",
                        diff: "+12.4%",
                        desc: "vs last week",
                      },
                      {
                        title: "Daily avg",
                        val: "4.5h",
                        diff: "+5.1%",
                        desc: "vs last month",
                      },
                      {
                        title: "Streak",
                        val: "14 Days",
                        diff: "Active",
                        desc: "Claimed today",
                      },
                      {
                        title: "Efficiency",
                        val: "94%",
                        diff: "Optimal",
                        desc: "Steady flow",
                      },
                    ].map((stat, idx) => (
                      <div
                        key={idx}
                        className="border border-neutral-200 bg-white p-3 sm:p-4 rounded-xl flex flex-col justify-between shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:shadow transition-shadow"
                      >
                        <span className="text-[9px] sm:text-[10px] text-neutral-450 font-bold uppercase tracking-wider">
                          {stat.title}
                        </span>
                        <div className="flex items-baseline justify-between mt-1.5 sm:mt-2 gap-1.5">
                          <span className="text-base sm:text-xl font-extrabold text-neutral-900">
                            {stat.val}
                          </span>
                          <span
                            className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              stat.diff.startsWith("+")
                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100/50"
                                : "bg-neutral-50 text-neutral-500 border border-neutral-200/50"
                            }`}
                          >
                            {stat.diff}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-neutral-400 mt-1 font-semibold leading-tight">
                          {stat.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            )}

            {activeTab === "leaderboard" && (
              <MotionDiv
                key="leaderboardTab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] items-center"
              >
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-3 sm:p-4 w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                    <div className="relative w-full sm:w-52">
                      <Search className="w-3.5 h-3.5 text-neutral-450 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="showcase-search-leaderboard"
                        type="text"
                        placeholder="Search focusers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-xs text-neutral-900 pl-9 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-neutral-450 placeholder:text-neutral-400 font-sans"
                      />
                    </div>

                    <div className="flex bg-neutral-100 border border-neutral-200/80 p-0.5 rounded-lg w-full sm:w-auto justify-center">
                      {["Weekly", "Monthly"].map((filter) => (
                        <button
                          id={`showcase-filter-${filter}`}
                          key={filter}
                          onClick={() => setLbFilter(filter)}
                          className={`px-3 py-1 sm:py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer w-1/2 sm:w-auto ${
                            lbFilter === filter
                              ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/30"
                              : "text-neutral-400 hover:text-neutral-600"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-[200px] sm:max-h-[250px] overflow-y-auto pr-1 no-scrollbar font-sans w-full">
                    <AnimatePresence mode="popLayout">
                      {filteredRankings.length > 0 ? (
                        filteredRankings.map((user) => (
                          <MotionDiv
                            layout
                            key={user.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-[28px_1fr_75px_50px] sm:grid-cols-[36px_1fr_90px_60px] items-center gap-2 p-2 rounded-xl bg-white hover:bg-neutral-50/50 transition border border-neutral-200/50 shadow-[0_1px_4px_rgba(0,0,0,0.01)] w-full"
                          >
                            <span
                              className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-extrabold border ${
                                user.rank === 1
                                  ? "bg-yellow-50 text-yellow-805 text-yellow-800 border-yellow-250 border-yellow-200"
                                  : user.rank === 2
                                    ? "bg-neutral-105 bg-neutral-100 text-neutral-800 border-neutral-200"
                                    : "bg-orange-50 text-orange-850 border-orange-200"
                              }`}
                            >
                              #{user.rank}
                            </span>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-bold text-neutral-900 truncate">
                                {user.name}
                              </span>
                              {user.active && (
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <span className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
                              {user.time}
                            </span>
                            <span className="text-[9px] text-neutral-400 font-bold whitespace-nowrap">
                              {user.streak}
                            </span>
                          </MotionDiv>
                        ))
                      ) : (
                        <div className="text-center py-8 text-neutral-400 text-xs font-bold font-sans">
                          No focusers found matching query.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                    Healthy competition, zero distraction.
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-medium">
                    Compete on streaks and cumulative focus hours. Keep each
                    other accountable without messaging clutter. Learn and grow
                    alongside builders worldwide.
                  </p>
                  <div className="border border-neutral-200 bg-neutral-50/30 p-3 sm:p-4 rounded-xl flex items-center gap-3">
                    <Award className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-950/80 shrink-0" />
                    <div>
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-850 block">
                        Top 5% Global Index
                      </span>
                      <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 font-sans font-semibold leading-tight">
                        Average focus session of 92 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
