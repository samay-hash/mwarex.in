import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar } from "lucide-react";

const MotionDiv = motion.div;

// ----------------------------------------------------
// 3. Bento Heatmap Widget (Light Theme & Emerald Cells)
// ----------------------------------------------------
export default function BentoHeatmapWidget() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const cells = [
    { date: "May 20", mins: 120 },
    { date: "May 21", mins: 45 },
    { date: "May 22", mins: 0 },
    { date: "May 23", mins: 180 },
    { date: "May 24", mins: 90 },
    { date: "May 25", mins: 60 },
    { date: "May 26", mins: 15 },
    { date: "May 27", mins: 210 },
    { date: "May 28", mins: 75 },
    { date: "May 29", mins: 0 },
    { date: "May 30", mins: 110 },
    { date: "May 31", mins: 130 },
    { date: "Jun 01", mins: 45 },
    { date: "Jun 02", mins: 90 },
    { date: "Jun 03", mins: 160 },
    { date: "Jun 04", mins: 240 },
    { date: "Jun 05", mins: 0 },
    { date: "Jun 06", mins: 30 },
    { date: "Jun 07", mins: 80 },
    { date: "Jun 08", mins: 120 },
    { date: "Jun 09", mins: 150 },
    { date: "Jun 10", mins: 95 },
    { date: "Jun 11", mins: 190 },
    { date: "Jun 12", mins: 70 },
  ];

  return (
    <div className="group relative rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-neutral-500" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">
            Activity Heatmap
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 font-bold font-sans">
          24 days
        </span>
      </div>

      <div className="my-auto py-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5 relative">
          {cells.map((cell, idx) => {
            const opacity =
              cell.mins === 0 ? 0.08 : 0.2 + (cell.mins / 240) * 0.8;
            const color =
              cell.mins === 0
                ? "bg-neutral-105 bg-neutral-200"
                : "bg-emerald-500";
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCell({ ...cell, index: idx })}
                onMouseLeave={() => setHoveredCell(null)}
                className={`aspect-square rounded transition-all duration-150 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-neutral-950 ${color}`}
                style={{ opacity }}
              />
            );
          })}

          <AnimatePresence>
            {hoveredCell && (
              <MotionDiv
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-20 flex flex-col items-center min-w-[110px]"
              >
                <span className="font-bold">{hoveredCell.date}</span>
                <span className="text-neutral-400 mt-0.5">
                  {hoveredCell.mins} mins study
                </span>
                <div className="w-2 h-2 bg-neutral-900 transform rotate-45 mt-1 -mb-2" />
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-neutral-450 border-t border-neutral-100 pt-3 mt-1 font-bold">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-neutral-100 border border-neutral-200" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-55" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 opacity-90" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
