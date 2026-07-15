import { Award } from "lucide-react";

// ----------------------------------------------------
// 4. Bento Leaderboard Widget (Light Theme & Active status)
// ----------------------------------------------------
export default function BentoLeaderboardWidget() {
  const rows = [
    { rank: 1, name: "Maya", time: "4h 32m", streak: "21d", active: true },
    { rank: 2, name: "Aarav", time: "3h 48m", streak: "16d", active: false },
    { rank: 3, name: "Sam", time: "2h 55m", streak: "9d", active: true },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[250px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-neutral-900" />
          <span className="font-sans text-xs font-bold tracking-wider uppercase text-neutral-500">
            Live Rankings
          </span>
        </div>
        <span className="text-[10px] font-bold text-neutral-600 bg-neutral-50 border border-neutral-200/60 px-2 py-0.5 rounded-full font-sans">
          top ranks
        </span>
      </div>

      <div className="space-y-2 my-auto py-1">
        {rows.map((row) => (
          <div
            key={row.rank}
            className="flex items-center justify-between p-2 rounded-xl bg-neutral-50/55 hover:bg-neutral-100/70 border border-neutral-200/50 transition duration-205 group/row"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-extrabold border ${
                  row.rank === 1
                    ? "bg-yellow-50 text-yellow-805 text-yellow-800 border-yellow-250 border-yellow-200"
                    : row.rank === 2
                      ? "bg-neutral-100 text-neutral-800 border-neutral-200"
                      : "bg-orange-50 text-orange-850 border-orange-200"
                }`}
              >
                #{row.rank}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  {row.name}
                  {row.active && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                  )}
                </span>
                <span className="text-[9px] text-neutral-450 font-semibold">
                  {row.streak} streak
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-neutral-600 group-hover/row:text-neutral-900 transition-colors">
              {row.time}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[9px] text-center text-neutral-400 mt-1 font-semibold">
        Real-time ranking sync.
      </div>
    </div>
  );
}

