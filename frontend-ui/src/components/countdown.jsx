import React, { useEffect,useRef } from "react";
import { RiResetLeftLine } from "react-icons/ri";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router";

import confetti from "canvas-confetti";

const triggerSideCannons = () => {
  const end = Date.now() + 2 * 1000; // 2 seconds
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};


function Countdown() {

const {
  textColor,
  countdownState,
  setCountdownState,
  stopwatchState
} = useOutletContext();

const {
  hours,
  minutes,
  seconds,
  time,
  isRunning,
  hasStarted,
  initialTime,
  endTime,
  isSaved,
} = countdownState;

const updateCountdown = (field, value) => {
  setCountdownState(prev => ({
    ...prev,
    [field]:
      typeof value === "function"
        ? value(prev[field])
        : value,
  }));
};

const completionHandledRef = useRef(false);

  const saveCountdown = async () => {
    const currentRemaining =
  endTime && isRunning
    ? Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      )
    : time;

const timeUsed = initialTime - currentRemaining;

    if (timeUsed <= 0) {
      toast.error("Run timer for at least 1 second");
      return;
    }

    try {
      const res = await axios.post(
        "/api/countdown/save", { totalTime: timeUsed }, { withCredentials: true }
      );

      toast.success(res?.data?.msg);

    } catch {
      
      toast.error("Error saving countdown");
    }
  };




  

  // Background alarm and completions are handled in the Home context.








  // sync input with timer before starting
  useEffect(() => {
      if (!isRunning && !hasStarted) {
          const total = hours * 3600 + minutes * 60 + seconds;
          updateCountdown("time", total);
      }
  }, [hours, minutes, seconds, isRunning, hasStarted]);


  const start = async () => {
    if (stopwatchState.isRunning) {
      toast.error(
        "Stopwatch is already running. Please stop it first."
      );
      return;
    }
    if (time <= 0) {
      toast.error("Run timer for at least 1 second");
      return;
    }
  if (!hasStarted) {
  completionHandledRef.current = false;

  updateCountdown("initialTime", time);
  updateCountdown("isSaved", false);

  try {
      await axios.post("/api/countdown/start", {}, { withCredentials: true });
  } catch (err) {
      console.error("Failed to start countdown session on backend: ", err);
      toast.error("Could not start the countdown. Please try again.");
      return;
  }
}
 updateCountdown(
    "endTime",
    Date.now() + time * 1000
  );

  updateCountdown("hasStarted", true);
  updateCountdown("isRunning", true);
};

  const pause = () => {
  const remaining = Math.max(
    0,
    Math.floor((endTime - Date.now()) / 1000)
  );

  updateCountdown("time", remaining);
  updateCountdown("isRunning", false);
};


  const reset = async () => {
    completionHandledRef.current = false;
    if(hasStarted && !isSaved){
     updateCountdown("isSaved", true); 
      await saveCountdown();
    }
    
   updateCountdown("isRunning", false);
   updateCountdown("hasStarted", false);
   updateCountdown("endTime", null);

    const total = hours * 3600 + minutes * 60 + seconds;
    updateCountdown("time", total);
  };



  // convert seconds → display
 const remaining = endTime
  ? Math.max(
      0,
      Math.floor((endTime - Date.now()) / 1000)
    )
  : time;

  useEffect(() => {
    if (countdownState.showConfetti) {
      if (initialTime > 0) {
        triggerSideCannons();
      }
      updateCountdown("showConfetti", false);
    }
  }, [countdownState.showConfetti, initialTime]);

const displayHours = String(
  Math.floor(remaining / 3600)
).padStart(2, "0");

const displayMinutes = String(
  Math.floor((remaining % 3600) / 60)
).padStart(2, "0");

const displaySeconds = String(
  remaining % 60
).padStart(2, "0");


    //const { textColor, setTextColor } = useOutletContext();

    const textColors = {
      white: "text-neutral-100",
      gold: "text-[#F4C95D]",
      coral: "text-[#FF7A90]",
      blue: "text-[#7DD3FC]",
      mint: "text-[#6EE7B7]",
      purple: "text-[#A78BFA]",
      peach: "text-[#FDBA74]",
      lime: "text-lime-300"
    };



  return (
    <div 
      className={`bg-neutral-900 p-4 sm:p-5 w-screen h-screen  justify-center flex flex-col items-center overflow-y-auto ${textColors[textColor] || "text-white"}`}
      style={{ color: textColor?.startsWith('#') ? textColor : undefined }}
    >

      {/* Timer Display */}
      <p className="text-[55px] sm:text-6xl md:text-8xl lg:text-9xl xl:text-[200px] font-gothic font-bold text-center tabular-nums">
        {displayHours}:{displayMinutes}:{displaySeconds}
      </p>


      {/* Time Inputs */}
      <div className="flex gap-2 sm:gap-4 mt-6 flex-wrap justify-center px-2">

        <input
          type="number"
          step="1"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          placeholder="hh"
          value={hours}
          onChange={(e) =>
            updateCountdown(
                     "hours",
                Math.min(11, Math.max(0, Number(e.target.value)))
              )
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

        <input
          type="number"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          max="59"
          placeholder="mm"
          value={minutes}
          onChange={(e) =>
            updateCountdown(
  "minutes",
  Math.min(59, Math.max(0, Number(e.target.value)))
)
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

        <input
          type="number"
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          min="0"
          disabled={isRunning}
          max="59"
          placeholder="ss"
          value={seconds}
          onChange={(e) =>
            updateCountdown(
  "seconds",
  Math.min(59, Math.max(0, Number(e.target.value)))
)
          }
          className="w-16 sm:w-16 h-10 sm:h-11 text-white px-2 bg-neutral-800 rounded border border-neutral-700 text-center"
        />

      </div>


      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-8 justify-center flex-wrap px-2">

            
            {
                isRunning ? (
                     <button onClick={pause} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPause className='mr-2 text-lg sm:text-[21px]' />
                        Pause
                    </button>
                ) : (
                    <button onClick={start} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                        <FaPlay className='mr-2 text-base sm:text-[16px]' />
                        Start
                    </button>
                )
            }


            <button onClick={reset} className='rounded-md bg-neutral-800 w-50 sm:w-40 h-12 sm:h-11 font-poppins active:scale-98 cursor-pointer hover:bg-neutral-700/60 transition-all duration-100 flex items-center justify-center text-lg sm:text-xl border-2 border-neutral-700/60 hover:border-neutral-600/60'>
                <RiResetLeftLine className='mr-2 text-lg sm:text-[20px]' />
                Reset
            </button>

      </div>

    </div>
  );
}

export default Countdown;
