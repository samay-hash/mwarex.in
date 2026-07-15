import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import { Outlet } from 'react-router'
import { useNavigate } from 'react-router'
import { StopCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

function Home() {

  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  
  if(!token){
      navigate("/login")
  }



  // store setting options in local storage

  const [sidebarOpt, setSidebarOpt] = useState(() => {
    return localStorage.getItem("sidebarOpt") || "mix";
  });


  useEffect(() => {
    localStorage.setItem("sidebarOpt", sidebarOpt);
  }, [sidebarOpt]);



  const [outsideClick, setOutsideClick] = useState(() => {
    const saved = localStorage.getItem("outsideClick");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "outsideClick",
      JSON.stringify(outsideClick)
    );
  }, [outsideClick]);



  const [timeDisplay,setTimeDisplay] = useState(() => {
    const saved = localStorage.getItem("timeDisplay");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "timeDisplay",
      JSON.stringify(timeDisplay)
    );
  }, [timeDisplay]);


  const [timeFormat, setTimeFormat] = useState(() => {
    const saved = localStorage.getItem("timeFormat");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(
      "timeFormat",
      JSON.stringify(timeFormat)
    );
  }, [timeFormat]);


  
  const [textColor, setTextColor] = useState(() => {
    return localStorage.getItem("textColor") || "white";
  });


  useEffect(() => {
    localStorage.setItem("textColor", textColor);
  }, [textColor]);




  const [showSeconds , setShowSeconds ] = useState(() => {
    const saved = localStorage.getItem("showSeconds ");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "showSeconds ",
      JSON.stringify(showSeconds )
    );
  }, [showSeconds ]);

  // end of the setting options local storage saving


// Stopwatch state
const [stopwatchState, setStopwatchState] = useState({
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
});

// Countdown state
const [countdownState, setCountdownState] = useState({
  hours: 0,
  minutes: 25,
  seconds: 0,
  time: 1500,
  isRunning: false,
  hasStarted: false,
  initialTime: 0,
  endTime: null,
  isSaved: false,
  showConfetti: false,
});
const [, forceUpdate] = useState(0);

// Play sound after countdown completed 
const playAlarmSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const note = (freq, start, duration, volume = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      // Smooth attack
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.04);

      // Smooth release
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
      );

      osc.start(start);
      osc.stop(start + duration + 0.02);
    };

    // Soft ascending "ding ding ding"
    note(523.25, now, 0.25);        // C5
    note(659.25, now + 0.18, 0.25); // E5
    note(783.99, now + 0.36, 0.45); // G5

    // OPTIMIZATION: Close the context after 1.2 seconds
    setTimeout(() => {
      if (ctx.state !== "closed") {
        ctx.close();
      }
    }, 1200);
  } catch (err) {
    console.error("Web Audio API failed:", err);
  }
};



useEffect(() => {
  let interval;

  if (countdownState.isRunning && countdownState.endTime) {
    interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((countdownState.endTime - Date.now()) / 1000)
      );

      if (remaining <= 0 && !countdownState.isSaved) {
        // Timer completed!
        playAlarmSound();

        const timeUsed = countdownState.initialTime;
        if (timeUsed > 0) {
          axios.post("/api/countdown/save", { totalTime: timeUsed })
            .then((res) => {
              toast.success(res?.data?.msg || "Countdown saved!");
            })
            .catch((err) => {
              console.error("Error saving countdown: ", err);
              toast.error("Error saving countdown");
            });
        }

        setCountdownState(prev => ({
          ...prev,
          isRunning: false,
          time: 0,
          isSaved: true,
          hasStarted: false,
          endTime: null,
          showConfetti: true,
        }));
      } else {
        forceUpdate(prev => prev + 1);
      }
    }, 1000);
  }
 
  return () => clearInterval(interval);
}, [
  countdownState.isRunning,
  countdownState.endTime,
  countdownState.isSaved,
  countdownState.initialTime
]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (stopwatchState.isRunning || countdownState.isRunning) {
        e.preventDefault();
        e.returnValue = "Changes will not be saved";
        return "Changes will not be saved";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stopwatchState.isRunning, countdownState.isRunning]);
  return (

    <div className='flex h-screen w-screen overflow-hidden bg-neutral-900'>
        <Sidebar
          sidebarOpt={sidebarOpt} 

          outsideClick={outsideClick}
        />
        <main className='min-w-0 flex justify-center'>
            <Outlet  context={{ 
              sidebarOpt, setSidebarOpt,
              outsideClick, setOutsideClick, 
              timeDisplay, setTimeDisplay,
              timeFormat, setTimeFormat,
              textColor, setTextColor,
              showSeconds , setShowSeconds,
              stopwatchState, setStopwatchState,
              countdownState, setCountdownState
              }}  />
        </main>

    </div> 
  )
}

export default Home
