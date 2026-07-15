import * as React from "react"
import { HeatmapCalendar } from "@/components/heatmap-calendar"

export default function ExampleFitness({ data = [], formatTime }) {
  const renderTooltip = React.useCallback((cell) => (
    <div>
      <div className="font-medium">{formatTime ? formatTime(cell.value) : `${cell.value}s`}</div>
      <div className="text-muted-foreground">{cell.label}</div>
    </div>
  ), [formatTime])

  return (
    <HeatmapCalendar
      title="Focus Activity"
      data={data}
      axisLabels
      legend={{ lessText: "Less", moreText: "More", placement: "bottom" }}
      renderTooltip={renderTooltip}
    />
  )
}
