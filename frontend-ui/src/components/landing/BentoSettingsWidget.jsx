import { useState } from "react";
import { Settings2 } from "lucide-react";

// ----------------------------------------------------
// 5. Bento Settings Widget (Live Customizer)
// ----------------------------------------------------
export default function BentoSettingsWidget() {
  const [showSec, setShowSec] = useState(true);
  const [colorTint, setColorTint] = useState("dark");
  const [glowEnabled, setGlowEnabled] = useState(true);

  const themeColors = {
    dark: "text-neutral-955 text-neutral-950 bg-neutral-950",
    indigo: "text-indigo-600 bg-indigo-600",
    amber: "text-amber-600 bg-amber-600",
  };

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-neutral-500" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">
            Customizer
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold">
          live preview
        </span>
      </div>

      <div className="my-auto py-1.5">
        {/* Real-time preview card */}
        <div className="border border-neutral-200/60 rounded-xl p-2.5 bg-neutral-50/50 flex flex-col items-center shadow-inner">
          <div className="text-[9px] text-neutral-400 uppercase tracking-widest font-black">
            Mock Widget
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`text-xl font-black tracking-tight ${themeColors[colorTint].split(" ")[0]}`}
            >
              12:00{showSec ? ":00" : ""}
            </span>
            {glowEnabled && (
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${themeColors[colorTint].split(" ")[1]}`}
              />
            )}
          </div>
        </div>

        {/* Setting Toggles */}
        <div className="space-y-2 mt-3.5 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">
              Show seconds
            </span>
            <button
              id="bento-setting-toggle-sec"
              onClick={() => setShowSec(!showSec)}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${showSec ? "bg-neutral-900" : "bg-neutral-200"}`}
            >
              <span
                className={`w-3 h-3 rounded-full bg-white absolute transition-transform ${showSec ? "translate-x-4.5" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">
              Status glow
            </span>
            <button
              id="bento-setting-toggle-glow"
              onClick={() => setGlowEnabled(!glowEnabled)}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${glowEnabled ? "bg-neutral-900" : "bg-neutral-200"}`}
            >
              <span
                className={`w-3 h-3 rounded-full bg-white absolute transition-transform ${glowEnabled ? "translate-x-4.5" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-600">
              Theme Tint
            </span>
            <div className="flex gap-1.5">
              {["dark", "indigo", "amber"].map((t) => (
                <button
                  id={`theme-select-${t}`}
                  aria-label={`${t} tint`}
                  key={t}
                  onClick={() => setColorTint(t)}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                    t === "dark"
                      ? "bg-neutral-950"
                      : t === "indigo"
                        ? "bg-indigo-500"
                        : "bg-amber-500"
                  } ${colorTint === t ? "border-neutral-900 scale-110 shadow-sm ring-1 ring-neutral-950 ring-offset-1" : "border-transparent hover:scale-105"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

