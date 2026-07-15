import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import { Button } from "./ui/button";
import { AnimatedList } from "./ui/animated-list";
import { Globe } from "./ui/globe";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { CTA11 } from "./ui/cta-11";
import { Footer } from "./footer";
import {
  Flame,
  Laptop,
  Palette,
  BookOpen,
  PenTool,
  BarChart2,
  CheckCircle,
  ArrowUpRight,
  Clock,
  Timer,
  Activity,
  Play,
  Pause,
  Square,
} from "lucide-react";

const FOCUS_NOTIFICATIONS = [
  {
    name: "Session complete",
    description: "2h 15m deep work logged",
    time: "2m ago",
    icon: "✅",
    color: "#359462",
  },
  {
    name: "Streak claimed",
    description: "14-day focus streak",
    time: "8m ago",
    icon: "🔥",
    color: "#f59e0b",
  },
  {
    name: "Leaderboard climb",
    description: "You moved up to #3",
    time: "15m ago",
    icon: "🏆",
    color: "#0ea5e9",
  },
  {
    name: "New personal best",
    description: "Longest focus block today",
    time: "32m ago",
    icon: "⚡",
    color: "#8b5cf6",
  },
  {
    name: "Timer finished",
    description: "Pomodoro cycle complete",
    time: "1h ago",
    icon: "⏱️",
    color: "#ef4444",
  },
];

function NotificationCard({ name, description, icon, color, time }) {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full cursor-pointer overflow-hidden rounded-2xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: color }}
        >
          <span className="text-base">{icon}</span>
        </div>
        <div className="flex min-w-0 flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center gap-1 text-sm font-semibold text-neutral-900">
            <span className="truncate">{name}</span>
            <span className="text-neutral-300">·</span>
            <span className="shrink-0 text-[11px] font-medium text-neutral-400">
              {time}
            </span>
          </figcaption>
          <p className="truncate text-xs font-medium text-neutral-500">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

// GitHub-style contribution levels tuned to the warm orange bento palette
const HEAT_LEVELS = [
  "bg-[#f0e4d2]", // empty
  "bg-[#f5c9a8]", // low
  "bg-[#e8956a]", // mid
  "bg-[#d96a3a]", // high
  "bg-[#c64e27]", // max
];

const LEVEL_MINS = [0, 30, 60, 120, 180];

function buildContributionWeeks(weekCount = 14) {
  // Deterministic pseudo-random so the demo graph looks the same every render
  let seed = 42;
  const next = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Align to start of week (Sunday), then go back weekCount weeks
  const end = new Date(today);
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (weekCount - 1) * 7);

  const weeks = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const week = [];
    for (let day = 0; day < 7; day++) {
      if (cursor > end) {
        week.push(null);
      } else {
        // Bias toward some activity so the graph feels realistic
        const roll = next();
        let level = 0;
        if (roll > 0.35) level = 1;
        if (roll > 0.55) level = 2;
        if (roll > 0.75) level = 3;
        if (roll > 0.9) level = 4;

        // Slight weekday boost (Mon–Fri)
        if (day >= 1 && day <= 5 && level > 0 && next() > 0.5) {
          level = Math.min(4, level + 1);
        }

        week.push({
          level,
          mins: LEVEL_MINS[level],
          date: cursor.toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function ContributionGraph({ weeks }) {
  const dayLabels = ["", "M", "", "W", "", "F", ""];

  return (
    <div className="mt-5 w-full">
      <TooltipProvider delayDuration={100}>
        <div className="flex gap-1.5">
          {/* Day-of-week labels (GitHub style) */}
          <div className="grid grid-rows-7 gap-[3px] pr-0.5">
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className="flex h-[11px] w-3 items-center justify-end text-[8px] font-medium leading-none text-[#b08968]"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Weeks as columns, days as rows */}
          <div className="flex min-w-0 flex-1 justify-between gap-[3px] overflow-hidden">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-[3px]">
                {week.map((cell, dayIndex) =>
                  cell ? (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${cell.date}: ${cell.mins} mins`}
                          className={`h-[11px] w-[11px] rounded-[2px] transition-transform duration-150 hover:scale-125 hover:ring-1 hover:ring-[#c64e27]/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c64e27]/50 ${HEAT_LEVELS[cell.level]}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        sideOffset={6}
                        className="border-0 bg-neutral-900 px-2.5 py-1.5 text-[11px] text-white"
                      >
                        <span className="font-semibold">{cell.date}</span>
                        <span className="ml-1.5 text-neutral-300">
                          {cell.mins === 0
                            ? "No activity"
                            : `${cell.mins} mins`}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={dayIndex} className="h-[11px] w-[11px]" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Less / More legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[9px] font-medium text-[#b08968]">
        <span>Less</span>
        {HEAT_LEVELS.map((color, i) => (
          <span
            key={i}
            className={`h-[10px] w-[10px] rounded-[2px] ${color}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

const SIDEBAR_ITEMS = [
  { id: "clock", label: "Clock", Icon: Clock },
  { id: "stopwatch", label: "Stopwatch", Icon: Timer },
  { id: "countdown", label: "Countdown", Icon: Clock },
  { id: "analytics", label: "Analytics", Icon: BarChart2 },
];

function PreviewClock() {
  const [time, setTime] = useState("");
  const [ampm, setAmpm] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const parts = formatted.split(" ");
      setTime(parts[0]);
      setAmpm(parts[1] || "");
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-[330px] flex-col items-center justify-center sm:h-auto sm:min-h-[640px]">
      <div className="flex items-baseline gap-1.5 sm:gap-4">
        <p className="font-gothic text-[2.4rem] leading-none tabular-nums text-white sm:text-7xl md:text-9xl">{time}</p>
        <p className="font-gothic text-sm tracking-wider text-white/50 sm:text-2xl md:text-3xl">{ampm}</p>
      </div>
      <p className="mt-3 font-poppins text-[10px] tracking-[0.15em] text-neutral-500 sm:mt-4 sm:text-xs">LIVE PREVIEW</p>
    </div>
  );
}

function PreviewStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  const totalSec = Math.floor(elapsed / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");

  return (
    <div className="flex h-[330px] flex-col items-center justify-center gap-4 sm:h-auto sm:min-h-[640px] sm:gap-6">
      <p className="font-gothic text-[2.2rem] leading-none tabular-nums text-white sm:text-6xl md:text-8xl">{h}:{m}:{s}</p>
      <div className="flex gap-3 sm:gap-4">
        {running ? (
          <button onClick={() => { setRunning(false); startRef.current = null; }} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-6 sm:py-3 sm:text-sm">
            <Pause className="size-3.5 sm:size-4" /> Pause
          </button>
        ) : (
          <button onClick={() => { startRef.current = Date.now() - elapsed; setRunning(true); }} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-6 sm:py-3 sm:text-sm">
            <Play className="size-3.5 sm:size-4" /> Start
          </button>
        )}
        <button onClick={() => { setRunning(false); setElapsed(0); startRef.current = null; }} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-6 sm:py-3 sm:text-sm">
          <Square className="size-3.5 sm:size-4" /> Reset
        </button>
      </div>
    </div>
  );
}

function PreviewCountdown() {
  const [total, setTotal] = useState(1500);
  const [remaining, setRemaining] = useState(1500);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState({ h: 0, m: 25, s: 0 });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { setRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const display = running ? remaining : total;
  const hh = String(Math.floor(display / 3600)).padStart(2, "0");
  const mm = String(Math.floor((display % 3600) / 60)).padStart(2, "0");
  const ss = String(display % 60).padStart(2, "0");

  return (
    <div className="flex h-[330px] flex-col items-center justify-center gap-3 sm:h-auto sm:min-h-[640px] sm:gap-4">
      <p className="font-gothic text-[2.2rem] leading-none tabular-nums text-white sm:text-6xl md:text-8xl">{hh}:{mm}:{ss}</p>
      {!running && (
        <div className="flex gap-2">
          {["h", "m", "s"].map((unit) => (
            <input
              key={unit}
              type="number"
              min="0"
              max={unit === "h" ? 11 : 59}
              placeholder={unit}
              value={input[unit]}
              onChange={(e) => {
                const val = Math.max(0, Math.min(unit === "h" ? 11 : 59, Number(e.target.value)));
                const next = { ...input, [unit]: val };
                setInput(next);
                const secs = next.h * 3600 + next.m * 60 + next.s;
                setTotal(secs || 1500);
                setRemaining(secs || 1500);
              }}
              className="w-12 h-9 rounded border border-neutral-700 bg-neutral-800 text-center font-poppins text-xs text-white sm:w-14 sm:h-10 sm:text-sm"
            />
          ))}
        </div>
      )}
      <div className="flex gap-3">
        {running ? (
          <button onClick={() => setRunning(false)} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-5 sm:py-2 sm:text-sm">
            <Pause className="size-3.5 sm:size-4" /> Pause
          </button>
        ) : (
          <button onClick={() => { setRunning(true); }} disabled={display <= 0} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-5 sm:py-2 sm:text-sm disabled:opacity-40">
            <Play className="size-3.5 sm:size-4" /> Start
          </button>
        )}
        <button onClick={() => { setRunning(false); setRemaining(total); }} className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-800 px-4 py-2 font-poppins text-xs text-white border-2 border-neutral-700/60 hover:bg-neutral-700/60 transition-all active:scale-98 sm:px-5 sm:py-2 sm:text-sm">
          <Square className="size-3.5 sm:size-4" /> Reset
        </button>
      </div>
    </div>
  );
}

function PreviewAnalytics() {
  const fakeBars = [65, 40, 80, 55, 90, 45, 70, 60, 85, 50, 75, 95];
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const maxBar = Math.max(...fakeBars);
  return (
    <div className="flex h-[330px] flex-col justify-center gap-3 px-3 sm:h-auto sm:min-h-[640px] sm:gap-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Total time", time: "47 h 12 m" },
          { title: "Today's time", time: "2 h 15 m" },
          { title: "Current streak", time: "14 days" },
          { title: "Average time", time: "1 h 04 m" },
        ].map((stat) => (
          <div key={stat.title} className="group min-h-20 rounded-lg border border-white/10 bg-neutral-800/30 p-3 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:border-white/13 hover:bg-neutral-800/40 sm:min-h-32 sm:p-5">
            <p className="font-poppins text-[10px] tracking-[0.1em] text-neutral-500 sm:text-sm">{stat.title}</p>
            <p className="mt-2 font-poppins text-lg font-semibold tracking-normal text-white sm:mt-3 sm:text-3xl">{stat.time}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 bg-neutral-900 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-neutral-800/50 px-4 py-3 sm:px-5 sm:py-4">
          <span className="size-2 rounded-full bg-green-500" />
          <p className="font-poppins text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-xs">Time tracked</p>
        </div>
        <div className="flex h-28 items-end justify-between gap-1.5 p-4 sm:h-[200px] sm:p-5">
          {fakeBars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end h-full">
              <div
                className="w-full max-w-[32px] rounded-t-[7px] bg-white/85 transition-all duration-300 hover:bg-white"
                style={{ height: `${(h / maxBar) * 100}%` }}
              />
              <span className="mt-1.5 font-poppins text-[10px] text-neutral-500">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const [active, setActive] = useState("clock");

  return (
    <div className="mx-auto w-full max-w-[410px] overflow-hidden rounded-[22px] border border-white/20 bg-neutral-900 shadow-2xl shadow-black/25 sm:max-w-none sm:rounded-2xl">
      <div className="flex flex-col sm:flex-row">
        <div className="flex w-full shrink-0 flex-row items-center justify-start gap-1 border-b border-neutral-700/40 bg-neutral-900/98 p-2 sm:w-44 sm:flex-col sm:items-stretch sm:border-b-0 sm:border-r sm:p-3">
          <p className="hidden font-gothic text-lg tracking-wide text-white sm:mb-6 sm:block">Timmo</p>
          <nav className="flex flex-row gap-1 sm:flex-col">
            {SIDEBAR_ITEMS.map((item) => {
              const IconComp = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                className={`flex size-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-poppins text-[10px] font-medium transition-all duration-100 sm:size-auto sm:justify-start sm:px-3 sm:py-2 sm:text-xs ${
                    active === item.id
                      ? "bg-neutral-700/40 text-white"
                      : "text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-300"
                  }`}
                >
                  <IconComp className="size-3.5 shrink-0 sm:size-4" />
                  <span className="hidden sm:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="hidden border-t border-neutral-700/40 pt-3 sm:mt-auto sm:block">
            <div className="flex items-center gap-2 rounded-lg bg-neutral-800/50 px-3 py-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-neutral-600 text-[10px] font-bold text-white">U</div>
              <p className="truncate font-poppins text-[11px] text-neutral-400">Demo User</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {active === "clock" && <PreviewClock />}
          {active === "stopwatch" && <PreviewStopwatch />}
          {active === "countdown" && <PreviewCountdown />}
          {active === "analytics" && <PreviewAnalytics />}
        </div>
      </div>
    </div>
  );
}

const Hero = () => {
  const [totalUsers, setTotalUsers] = useState(350);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await axios.get("/api/user/public-stats");
        if (res.data?.success && res.data?.stats) {
          setTotalUsers(res.data.stats.totalUsers);
        }
      } catch (err) {
        console.log("error fetching landing stats:", err);
      }
    };
    fetchPublicStats();
  }, []);

  const [selectedTime, setSelectedTime] = useState({
    hours: "0",
    minutes: "0",
    seconds: "10",
  });
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const contributionWeeks = useMemo(() => buildContributionWeeks(14), []);
  const globeConfig = useMemo(
    () => ({
      width: 800,
      height: 800,
      onRender: () => { },
      devicePixelRatio: 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 0.45,
      mapSamples: 16000,
      mapBrightness: 1.15,
      baseColor: [0.92, 0.9, 1],
      markerColor: [0.37, 0.16, 0.77],
      glowColor: [0.95, 0.93, 1],
      markers: [
        { location: [19.076, 72.8777], size: 0.1 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.07 },
        { location: [-33.8688, 151.2093], size: 0.06 },
        { location: [1.3521, 103.8198], size: 0.05 },
        { location: [37.7749, -122.4194], size: 0.08 },
        { location: [48.8566, 2.3522], size: 0.06 },
      ],
    }),
    [],
  );

  const hoursOptions = Array.from({ length: 24 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));
  const minutesOptions = Array.from({ length: 60 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));
  const secondsOptions = Array.from({ length: 60 }, (_, index) => ({
    label: String(index).padStart(2, "0"),
    value: String(index),
  }));

  const totalSeconds =
    Number(selectedTime.hours) * 3600 +
    Number(selectedTime.minutes) * 60 +
    Number(selectedTime.seconds);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setRemainingSeconds(totalSeconds);
    }
  }, [isRunning, totalSeconds]);

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const hrs = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(safeSeconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleStart = () => {
    if (totalSeconds <= 0) return;
    setRemainingSeconds(totalSeconds);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-neutral-50 text-neutral-950 ">
      <Navbar />

      <section id="home" className="relative isolate overflow-hidden px-4 pb-14 pt-36 sm:min-h-[110vh] sm:pb-0 sm:pt-36">
        <div className="absolute inset-x-0 top-0 -z-10 h-screen overflow-hidden">
          <div className="h-full w-full bg-[url('/trendybg.png')] bg-cover bg-center mask-t-from-30% mask-b-from-90%" />
        </div>
        <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-white via-white/70 to-transparent" />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
          <div className="pt-12 sm:pt-[15vh]">
            <h1 className="mx-auto max-w-[22rem] text-[2rem] leading-[1.04] tracking-[-0.01em] text-black/90 sm:max-w-3xl sm:text-5xl sm:leading-[0.92] sm:tracking-[-0.02em] md:text-7xl">
              A workspace built for focused work.
            </h1>
            <p className="mx-auto mt-4 max-w-[21rem] text-[13px] leading-6 text-black/80 sm:mt-6 sm:max-w-xl sm:text-base sm:leading-7 lg:text-lg">
              Track every session with a clock, timer, stopwatch, streaks,
              heatmaps, leaderboards, and detailed insights.
            </p>

            <div className="mx-auto mt-7 flex w-full max-w-[23rem] flex-col items-center justify-center gap-3 px-0 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row">
              <Button asChild
                size="lg"
                className="h-11 w-full rounded-full bg-neutral-950 px-8 text-sm font-semibold text-white hover:bg-neutral-850 sm:h-12 sm:w-auto sm:text-lg"
              >
                <Link to={localStorage.getItem("token") ? "/clock" : "/login"}>
                  Dashboard
                </Link>
              </Button>
              <Button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="h-11 w-full rounded-full border border-lime-500/70 bg-lime-300 px-8 text-sm font-semibold text-black transition-all duration-200 hover:bg-lime-400 sm:h-12 sm:w-auto sm:text-lg"
              >
                Product Demo
              </Button>
            </div>
          </div>

          <div className="mt-9 w-full max-w-6xl px-0 sm:mt-12 sm:px-4">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section id="stats" className="bg-neutral-50 overflow-hidden mt-16 sm:mt-20">
        <div className="flex flex-col justify-center items-center px-4 py-8 gap-3 sm:py-10 sm:gap-5">
          <h1 className="text-3xl max-w-sm text-center font-medium leading-tight sm:text-4xl md:text-5xl sm:max-w-lg">
            Our Numbers Speak for Themselves
          </h1>
          <p className="text-base text-neutral-600 sm:text-xl">
            Powered by our growing community.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 px-4 sm:gap-10 sm:px-0 lg:flex-row">
          {[
            {
              videoSrc: "/video1.webm",
              stat: `${totalUsers.toLocaleString()}+ `,
              description: "Register User",
            },
            {
              videoSrc: "/video2.webm",
              stat: "6",
              description: "focus tools included",
            },
            {
              videoSrc: "/video3.webm",
              stat: "365",
              description: "days of activity heatmap",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="mt-5 rounded-2xl bg-white p-2 shadow-md ring-1 ring-neutral-100 md:mt-0"
            >
              <div className="w-85 max-w-85 rounded-xl bg-neutral-100 px-2 py-2 h-[240px] overflow-hidden">
                <video
                  src={card.videoSrc}
                  className="h-full w-full rounded-xl object-cover"
                  preload="auto"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              <div className="px-4 py-3">
                <h2 className="text-xl font-semibold">{card.stat}</h2>
                <p
                  className={`whitespace-nowrap text-base font-medium text-neutral-500`}
                >
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-neutral-50 overflow-hidden py-10 md:py-20 my-10 md:my-20">
        <div className="flex flex-col justify-center items-center px-4 py-8 gap-3 sm:px-6 lg:px-8 sm:py-10 sm:gap-5">
          <h1 className="text-3xl max-w-sm text-center font-medium leading-tight sm:text-4xl md:text-5xl sm:max-w-lg">
            Everything for your work and focus
          </h1>
          <p className="text-base text-center text-neutral-600 sm:text-xl">
            A beautiful, integrated toolkit designed for deep work.
          </p>
          <div className="grid grid-cols-1 mt-8 w-full max-w-7xl gap-5 px-5 sm:mt-10 sm:px-0 md:grid-cols-3">
            {/* First Box */}
            <div className="bg-purple-100/60 border overflow-hidden grid border-purple-300/50 h-full rounded-4xl flex-col items-start justify-start">
              <div>
                <video
                  src="/firstbox.mp4"
                  className="h-4/5 w-full rounded-xl scale-110 object-cover -mt-7"
                  preload="auto"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="px-8 py-5">
                <div>
                  <div className="[&_h3]:leading-[1.18]">
                    <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                      <span className="block text-[#7B35F0]">14 days </span>
                      <span className="block text-[#17152A]">consistency</span>
                    </h3>
                  </div>

                  <p className="mt-3 max-w-[360px] font-instrument-sans text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#6D6878] sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
                    Build daily momentum and see your focus streak grow with
                    every completed session.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Box */}
            <div className="col-span-1 md:col-span-2 flex h-auto min-h-[420px] md:h-100 items-center justify-center rounded-4xl bg-sky-100/60 border border-sky-200/60 px-4 py-8 sm:px-8">
              <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                <div className="max-w-[320px] text-left">
                  <div className="[&_h3]:leading-[1.18]">
                    <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                      <span className="block text-[#0586d2]">Timer Clock </span>
                      <span className="block text-[#17152A]">
                        Build your own countdown.
                      </span>
                    </h3>
                  </div>

                  <p className="mt-3 font-instrument-sans text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#6D6878] sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
                    Choose hours, minutes, and seconds, then start the timer.
                  </p>
                </div>

                <div className="w-full max-w-[520px]">
                  <div className="flex items-center justify-center gap-2 sm:gap-6">
                    <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-white/70 px-2 py-2 sm:px-3 sm:py-3 shadow-sm">
                      <span className="mb-2 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-slate-500">
                        Hours
                      </span>
                      <WheelPickerWrapper className="w-16 sm:w-24">
                        <WheelPicker
                          options={hoursOptions}
                          value={selectedTime.hours}
                          onValueChange={(value) =>
                            setSelectedTime((prev) => ({
                              ...prev,
                              hours: value,
                            }))
                          }
                        />
                      </WheelPickerWrapper>
                    </div>

                    <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-white/70 px-2 py-2 sm:px-3 sm:py-3 shadow-sm">
                      <span className="mb-2 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-slate-500">
                        Min
                      </span>
                      <WheelPickerWrapper className="w-16 sm:w-24">
                        <WheelPicker
                          options={minutesOptions}
                          value={selectedTime.minutes}
                          onValueChange={(value) =>
                            setSelectedTime((prev) => ({
                              ...prev,
                              minutes: value,
                            }))
                          }
                        />
                      </WheelPickerWrapper>
                    </div>

                    <div className="flex min-w-[76px] sm:min-w-[96px] flex-col items-center rounded-xl sm:rounded-2xl bg-white/70 px-2 py-2 sm:px-3 sm:py-3 shadow-sm">
                      <span className="mb-2 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-slate-500">
                        Sec
                      </span>
                      <WheelPickerWrapper className="w-16 sm:w-24">
                        <WheelPicker
                          options={secondsOptions}
                          value={selectedTime.seconds}
                          onValueChange={(value) =>
                            setSelectedTime((prev) => ({
                              ...prev,
                              seconds: value,
                            }))
                          }
                        />
                      </WheelPickerWrapper>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-3 text-center">
                    <div className="flex gap-2">
                      <Button
                        onClick={handleStart}
                        disabled={totalSeconds <= 0 || isRunning}
                        className="rounded-full bg-[#0586d2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0470b5]"
                      >
                        Start
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="rounded-full border-sky-200 bg-white hover:text-black px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Reset
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {isRunning
                        ? `Counting down: ${formatTime(remainingSeconds)}`
                        : `Ready: ${formatTime(remainingSeconds)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Third — Activity heatmap (GitHub contribution style) */}
            <div className="flex h-100 flex-col overflow-hidden rounded-4xl border border-[#f0d9b8]/70 bg-[#fff2df] px-6 py-6 sm:px-8 sm:py-7">
              <div className="[&_h3]:leading-[1.18]">
                <h3 className="max-w-xs font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                  <span className="block text-[#c64e27]">
                    Heatmap of your consistency
                  </span>
                </h3>
              </div>

              <p className="mt-3 max-w-[360px] font-instrument-sans text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#6D6878] sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
                Visualize your dedication over the entire year with a
                GitHub-style activity contribution map.
              </p>
              <div className="mt-5">
                <ContributionGraph weeks={contributionWeeks} />
              </div>
            </div>

            {/* Fourth — Live activity feed (Animated List) */}
            <div className="flex h-100 flex-col overflow-hidden rounded-4xl border border-[#cfe9c8]/80 bg-[#eeffe8] px-6 py-6 sm:px-8">
              <div className="[&_h3]:leading-[1.18]">
                <h3 className="max-w-xs font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                  <span className="block text-[#359462]">
                    Real-time activity feed
                  </span>
                </h3>
              </div>

              <p className="mt-3 max-w-[360px] font-instrument-sans text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#6D6878] sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
                Get instant feedback on session completions, streak milestones,
                and leaderboard progress.
              </p>

              <div className="relative mt-4 min-h-0 flex-1 overflow-hidden">
                <AnimatedList delay={1800} className="gap-2.5">
                  {Array.from({ length: 8 }, () => FOCUS_NOTIFICATIONS)
                    .flat()
                    .map((item, idx) => (
                      <NotificationCard {...item} key={idx} />
                    ))}
                </AnimatedList>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#eeffe8] to-transparent" />
              </div>
            </div>

            {/* Fifth — Community globe */}
            <div className="relative flex h-100 flex-col overflow-hidden rounded-4xl border border-[#ddd0ff]/70 bg-[#f2eeff] px-6 py-6 sm:px-8">
              <div className="relative z-10 [&_h3]:leading-[1.18]">
                <h3 className="max-w-xs font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
                  <span className="block text-[#5e2ac4]">
                    Global focus community
                  </span>
                </h3>
              </div>

              <p className="relative z-10 mt-3 max-w-[360px] font-instrument-sans text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#6D6878] sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
                Join students and developers worldwide tracking focus sessions
                in real time.
              </p>

              <div className="relative mt-2 min-h-0 flex-1">
                <Globe
                  className="top-0 left-1/2 max-w-none -translate-x-1/2 scale-110"
                  config={globeConfig}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(94,42,196,0.12),transparent_55%)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="bg-neutral-50 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl max-w-lg text-center font-medium leading-tight">
            Live Focus Sessions Charts with users
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-neutral-600 max-w-lg">
            Real-time updates of deep work, consistency streaks, and task
            completions from Users.
          </p>

          <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.015)] backdrop-blur-sm p-2 sm:p-4 w-full mt-5">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100 hover:bg-transparent">
                  <TableHead className="font-bold text-neutral-600 pl-4">
                    User
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Activity
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Duration
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Streak
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Time
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600 pr-4 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "Samiran De",
                    initials: "SD",
                    bg: "bg-purple-500",
                    activity: "React Frontend Coding",
                    icon: (
                      <Laptop className="w-4 h-4 text-purple-500 shrink-0" />
                    ),
                    duration: "45 mins",
                    streak: "14 days",
                    time: "2m ago",
                    status: "Completed",
                  },
                  {
                    name: "Alex Rivera",
                    initials: "AR",
                    bg: "bg-blue-500",
                    activity: "UI/UX Figma Design",
                    icon: (
                      <Palette className="w-4 h-4 text-blue-500 shrink-0" />
                    ),
                    duration: "1h 30m",
                    streak: "8 days",
                    time: "12m ago",
                    status: "Completed",
                  },
                  {
                    name: "Yuki Tanaka",
                    initials: "YT",
                    bg: "bg-orange-500",
                    activity: "Japanese Kanji Practice",
                    icon: (
                      <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />
                    ),
                    duration: "25 mins",
                    streak: "32 days",
                    time: "25m ago",
                    status: "Completed",
                  },
                  {
                    name: "Sarah Jenkins",
                    initials: "SJ",
                    bg: "bg-emerald-500",
                    activity: "Technical Docs Writing",
                    icon: (
                      <PenTool className="w-4 h-4 text-emerald-500 shrink-0" />
                    ),
                    duration: "2h 10m",
                    streak: "5 days",
                    time: "1h ago",
                    status: "Completed",
                  },
                  {
                    name: "Michael Chen",
                    initials: "MC",
                    bg: "bg-rose-500",
                    activity: "Financial Modeling",
                    icon: (
                      <BarChart2 className="w-4 h-4 text-rose-500 shrink-0" />
                    ),
                    duration: "50 mins",
                    streak: "21 days",
                    time: "3h ago",
                    status: "Completed",
                  },
                ].map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="border-neutral-100/50 hover:bg-neutral-50/50 transition-colors"
                  >
                    <TableCell className="font-medium pl-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white ${row.bg} shadow-sm`}
                        >
                          {row.initials}
                        </div>
                        <span className="font-bold text-neutral-900 text-sm">
                          {row.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-600 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {row.icon}
                        <span>{row.activity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-900 font-semibold text-sm">
                      {row.duration}
                    </TableCell>
                    <TableCell className="text-neutral-500 font-medium text-sm">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="font-bold text-neutral-800">
                          {row.streak}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="text-neutral-450 text-neutral-400 font-medium text-xs">
                      {row.time}
                    </TableCell>
                    <TableCell className="pr-4 text-right py-3.5">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-250/30 border-emerald-200/50 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <CTA11 />
      <section className="bg-neutral-50 px-4 py-16 md:py-24">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white">
          <div className="relative isolate min-h-[360px] bg-[url('/cta.jpeg')] bg-cover bg-center px-6 py-8 sm:px-10 sm:py-10 md:min-h-[390px] md:px-12">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.82)_44%,rgba(255,255,255,0.28)_72%,rgba(255,255,255,0.05)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-black/10 to-transparent" />

            <div className="flex min-h-[300px] flex-col justify-between gap-10 md:min-h-[310px] md:flex-row md:items-center">
              <div className="max-w-[34rem]">
                <span className="inline-flex items-center rounded-full border border-neutral-900/10 bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-700 backdrop-blur">
                  Sponsor Timmo
                </span>
                <h2 className="mt-5 max-w-lg text-3xl font-medium leading-tight text-neutral-950 sm:text-4xl md:text-5xl">
                  Help us build the ultimate workspace.
                </h2>
                <p className="mt-5 max-w-md text-sm font-medium leading-7 text-neutral-700 sm:text-base">
                  Timmo is indie-crafted and free of clutter. Your support keeps
                  the servers running, funds new focus widgets, and helps us
                  keep building a quieter web.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:max-w-xs">
                <Button
                  asChild
                  className="h-12 justify-between rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  <a
                    href="https://github.com/sponsors/Sam721166"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Sponsors
                    <ArrowUpRight className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 justify-between rounded-full border-white/80 bg-white/80 px-5 text-sm font-semibold text-neutral-950 backdrop-blur hover:bg-white hover:text-black"
                >
                  <a
                    href="https://buymeacoffee.com/samirande_"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Me a Coffee
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Hero
