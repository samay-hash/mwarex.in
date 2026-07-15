import { useState } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const MotionDiv = motion.div;

// ----------------------------------------------------
// 2. Bento Streak Widget (Light Theme & Glowing Flame)
// ----------------------------------------------------
export default function BentoStreakWidget() {
  const [streak, setStreak] = useState(14);
  const [checkedIn, setCheckedIn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setStreak((prev) => prev + 1);
    setCheckedIn(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[260px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-neutral-900" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">
            Momentum
          </span>
        </div>
        <span
          className={`text-[10px] font-bold border px-2 py-0.5 rounded-full transition-colors ${
            checkedIn
              ? "bg-orange-50 text-orange-655 text-orange-600 border-orange-200/50"
              : "bg-neutral-50 text-neutral-600 border-neutral-200/60"
          }`}
        >
          daily streak
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-4 text-center">
        <MotionDiv
          animate={
            isAnimating
              ? {
                  scale: [1, 1.25, 1],
                  rotate: [0, -15, 15, -15, 0],
                }
              : {
                  scale: [1, 1.05, 1],
                }
          }
          transition={
            isAnimating
              ? { duration: 0.6 }
              : { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }
          className="relative cursor-pointer"
          onClick={handleCheckIn}
        >
          <Flame
            className={`w-16 h-16 transition-colors duration-300 ${
              checkedIn
                ? "text-orange-500 fill-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.45)]"
                : "text-neutral-300 hover:text-neutral-500"
            }`}
          />
          {checkedIn && (
            <MotionDiv
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-16 h-16 rounded-full bg-orange-450 bg-orange-400/20"
            />
          )}
        </MotionDiv>

        <div className="mt-4">
          <span className="font-sans text-4xl font-extrabold tracking-tight text-neutral-900">
            {streak}
          </span>
          <span className="font-sans text-xs text-neutral-450 ml-1 font-bold">
            days consistency
          </span>
        </div>
      </div>

      <button
        id="bento-claim-streak"
        onClick={handleCheckIn}
        disabled={checkedIn}
        className={`w-full py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
          checkedIn
            ? "bg-orange-50/50 border-orange-100 text-orange-655 text-orange-500 cursor-not-allowed"
            : "bg-neutral-950 border-neutral-950 text-white hover:bg-neutral-850 shadow shadow-neutral-950/10"
        }`}
      >
        {checkedIn ? "Claimed for today!" : "Claim Streak Badge"}
      </button>
    </div>
  );
}
