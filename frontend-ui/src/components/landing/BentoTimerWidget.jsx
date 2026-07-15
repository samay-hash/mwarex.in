import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";

const MotionCircle = motion.circle;

// ----------------------------------------------------
// 1. Bento Timer Widget (Interactive & Light Theme)
// ----------------------------------------------------
export default function BentoTimerWidget() {
  const [timeLeft, setTimeLeft] = useState(165); // 02:45
  const [isRunning, setIsRunning] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [timerTheme, setTimerTheme] = useState("dark"); // dark (neutral-950), indigo, rose
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(165);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (!showSeconds) return `${m}m`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / 165) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const accentColors = {
    dark: "#0a0a0a",
    indigo: "#4f46e5",
    rose: "#e11d48",
  };

  const activeColor = accentColors[timerTheme];

  return (
    <div className="relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-neutral-200/80 bg-white text-neutral-900 transition-all duration-300 shadow-sm md:col-span-2 group overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-neutral-400" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-450">
            Deep Work Timer
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            id="theme-btn-dark"
            aria-label="Dark Theme"
            onClick={() => setTimerTheme("dark")}
            className={`w-3.5 h-3.5 rounded-full bg-neutral-955 border transition cursor-pointer ${timerTheme === "dark" ? "ring-2 ring-offset-2 ring-neutral-950 scale-105" : "hover:scale-105"}`}
          />
          <button
            id="theme-btn-indigo"
            aria-label="Indigo Theme"
            onClick={() => setTimerTheme("indigo")}
            className={`w-3.5 h-3.5 rounded-full bg-indigo-505 border transition cursor-pointer ${timerTheme === "indigo" ? "ring-2 ring-offset-2 ring-neutral-950 scale-105" : "hover:scale-105"}`}
          />
          <button
            id="theme-btn-rose"
            aria-label="Rose Theme"
            onClick={() => setTimerTheme("rose")}
            className={`w-3.5 h-3.5 rounded-full bg-rose-505 border transition cursor-pointer ${timerTheme === "rose" ? "ring-2 ring-offset-2 ring-neutral-950 scale-105" : "hover:scale-105"}`}
          />
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-50 border border-neutral-205 px-2 py-0.5 text-[9px] text-neutral-600 font-bold ml-2">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-neutral-955 ${isRunning ? "animate-ping" : ""}`}
            />
            {isRunning ? "active" : "paused"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-6 z-10">
        {/* SVG Progress Circle in light theme */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 128 128"
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-neutral-100"
              strokeWidth="5"
              fill="transparent"
            />
            <MotionCircle
              cx="64"
              cy="64"
              r={radius}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{
                strokeDashoffset,
                stroke: activeColor,
              }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>
          <div className="absolute font-sans text-xl sm:text-2xl font-black tracking-tight text-neutral-950">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col justify-center text-center sm:text-left">
          <h4 className="font-sans text-base font-bold text-neutral-900">
            Try the focus clock.
          </h4>
          <p className="font-sans text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed font-medium">
            Start a micro countdown session to preview the clean layout,
            formats, and accent tints.
          </p>
          <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
            <button
              id="bento-toggle-sec"
              onClick={() => setShowSeconds(!showSeconds)}
              className="text-[10px] font-bold px-2 py-1 rounded bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-600 transition cursor-pointer"
            >
              {showSeconds ? "Hide Seconds" : "Show Seconds"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 z-10 font-sans">
        <button
          id="bento-timer-play"
          onClick={handleStartPause}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 text-white py-2 text-xs font-bold transition cursor-pointer shadow shadow-neutral-950/10"
        >
          {isRunning ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          id="bento-timer-reset"
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-white py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        <Link
          to={isLoggedIn ? "/clock" : "/login"}
          id="bento-timer-save"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-2 text-xs font-bold hover:bg-neutral-100 transition cursor-pointer text-neutral-855 text-neutral-800"
          style={{
            borderColor: timerTheme !== "dark" ? `${activeColor}20` : "#e5e5e5",
            color: timerTheme !== "dark" ? activeColor : "#262626",
            backgroundColor:
              timerTheme !== "dark" ? `${activeColor}08` : "#f5f5f5",
          }}
        >
          Save
        </Link>
      </div>
    </div>
  );
}
