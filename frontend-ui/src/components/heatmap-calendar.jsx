import React from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getIntensity(value, maxValue) {
  if (!value || maxValue <= 0) return "bg-neutral-800/80 border-white/5"

  const percent = value / maxValue

  if (percent > 0.75) return "bg-white border-white"
  if (percent > 0.5) return "bg-neutral-300 border-neutral-300"
  if (percent > 0.25) return "bg-neutral-500 border-neutral-500"
  return "bg-neutral-700 border-neutral-700"
}

function formatDateLabel(date) {
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function toLocalDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function startOfLocalDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function buildCalendarCells(data) {
  const valuesByDate = new Map(data.map((item) => [item.date, item.value]))

  const today = startOfLocalDay(new Date())
  const start = new Date(today)

  start.setDate(today.getDate() - 364)
  start.setDate(start.getDate() - start.getDay())

  const cells = []
  const cursor = new Date(start)

  while (cursor <= today) {
    const date = toLocalDateKey(cursor)
    const value = valuesByDate.get(date) ?? 0

    cells.push({
      date,
      value,
      label: formatDateLabel(cursor),
      day: cursor.getDay(),
      month: cursor.getMonth(),
      isFirstOfMonth: cursor.getDate() <= 7,
    })

    cursor.setDate(cursor.getDate() + 1)
  }

  return cells
}

function HeatmapCalendar({
  title,
  data,
  axisLabels = false,
  legend,
  renderTooltip,
}) {
  const cells = React.useMemo(() => buildCalendarCells(data), [data])
  const maxValue = React.useMemo(
    () => Math.max(...data.map((item) => item.value), 0),
    [data]
  )

  const weeks = React.useMemo(() => {
    const grouped = []

    for (let i = 0; i < cells.length; i += 7) {
      grouped.push(cells.slice(i, i + 7))
    }

    return grouped
  }, [cells])

  return (
    <Card className="gap-0 rounded-lg border border-white/10 bg-neutral-900 py-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] ring-0 ">
      <CardHeader className="border-b border-white/10 bg-neutral-800/50 px-5 py-4 sm:grid-cols-[1fr_auto] rounded-t-lg">
        <div>
          <CardTitle className="font-poppins text-lg font-semibold text-white">{title}</CardTitle>
          <CardDescription className="mt-1 font-poppins text-sm text-neutral-500">Daily focus activity</CardDescription>
        </div>

        {legend && (
          <CardAction className="flex items-center gap-2 font-poppins text-xs text-neutral-500">
            <span>{legend.lessText}</span>
            {["bg-neutral-800", "bg-neutral-700", "bg-neutral-500", "bg-neutral-300", "bg-white"].map((color) => (
              <span key={color} className={`h-3 w-3 rounded-sm border border-white/10 ${color}`} />
            ))}
            <span>{legend.moreText}</span>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="overflow-x-auto p-5 flex justify-center">
        <div className="min-w-max">
          <div className="mb-2 ml-10 grid auto-cols-[14px] grid-flow-col gap-1">
            {weeks.map((week, index) => {
              const firstCell = week[0]

              return (
                <div key={index} className="h-4 font-poppins text-[10px] text-neutral-600">
                  {firstCell?.isFirstOfMonth ? MONTH_LABELS[firstCell.month] : ""}
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            {axisLabels && (
              <div className="grid grid-rows-7 gap-1 pt-0.5 font-poppins text-[10px] text-neutral-600">
                {DAY_LABELS.map((day, index) => (
                  <span key={day} className="h-3.5 leading-3.5">
                    {index % 2 === 1 ? day : ""}
                  </span>
                ))}
              </div>
            )}

            <TooltipProvider>
              <div className="grid auto-cols-[14px] grid-flow-col gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-1">
                    {week.map((cell) => (
                      <Tooltip key={cell.date}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={`h-3.5 w-3.5 rounded-[3px] border transition duration-150 hover:scale-125 hover:ring-2 hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/25 ${getIntensity(cell.value, maxValue)}`}
                            aria-label={`${cell.label}: ${cell.value}`}
                          />
                        </TooltipTrigger>

                        {renderTooltip && (
                          <TooltipContent
                            sideOffset={8}
                            className="border border-white/10 bg-neutral-950 px-3 py-2 text-xs text-white shadow-xl"
                          >
                            {renderTooltip(cell)}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { HeatmapCalendar }
