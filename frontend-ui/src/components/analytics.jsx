import React, { Suspense, useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/shadcn/chart"

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"

import Box from "../components/analytics/box"

const Heatmap = React.lazy(() => import("../components/analytics/heatmap"))



const combineDailyData = (...datasets) => {
  const combinedMap = new Map()

  datasets.flat().forEach((item) => {
    if (!item?.date) return
    combinedMap.set(item.date, (combinedMap.get(item.date) || 0) + (item.time || 0))
  })

  return Array.from(combinedMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, time]) => ({ date, time }))
}

const formatChartDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}





function Analytics() {

 // get stopwatch data
  const [stopwatchData, setStopwatchData] = useState({ totalTime: 0, todayTime: 0, averageTime: 0 })
  const [countdownData, setCountdownData] = useState({ totalTime: 0, todayTime: 0, averageTime: 0 })
  const [chartData, setChartData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [streak, setStreak] = useState(0)

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");



  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {

        setLoading(true)


        const [stopRes, countRes, streakRes] = await Promise.all([
          axios.get("/api/stopwatch/stats"),
          axios.get("/api/countdown/stats"),
          axios.get("/api/streak"),
        ])

        setStopwatchData(stopRes.data.stats)
        setCountdownData(countRes.data.stats)
        setStreak(streakRes.data.currentStreak ?? 0)
        setFetchError("")

        const combinedChart = combineDailyData(
          stopRes.data.chartData,
          countRes.data.chartData
        )

        const combinedHeatmap = combineDailyData(
          stopRes.data.heatmapData || stopRes.data.chartData,
          countRes.data.heatmapData || countRes.data.chartData
        )

        setChartData(
          combinedChart.map((item) => ({
            date: formatChartDate(item.date),
            time: item.time,
          }))
        )

        setHeatmapData(
          combinedHeatmap.map((item) => ({
            date: item.date,
            value: item.time,
          }))
        )
      } catch (err) {
        console.log("error while fetching analytics data: ", err)

        if (err?.response?.status === 429) {
          setFetchError("Too many refreshes. Analytics will be available again in about a minute.")
        } else {
          setFetchError("Analytics could not be loaded right now.")
        }
      } finally{
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours} h ${minutes} m ${secs} s`;
    }

    if (minutes > 0) {
      return `${minutes} m ${secs} s`;
    }

    return `${secs} s`;
  };


  return (
    <div className='h-screen w-screen min-w-0 overflow-y-auto bg-neutral-900 px-5 py-6 text-white sm:px-8 lg:px-10'
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
      }} >

      <div className='mx-auto flex w-full max-w-7xl flex-col gap-5 pt-6 md:pt-0'>


        <div className='flex flex-col gap-2 border-b border-white/10 pb-5'>
          <p className='font-poppins text-sm  tracking-[0.1em] text-neutral-500'>Analytics</p>
          <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
            <h1 className='font-poppins text-3xl font-semibold tracking-normal text-white sm:text-4xl'>
              Focus overview
            </h1>
            <div className='flex items-center gap-2 rounded-sm border border-white/10 bg-white/2 px-3 py-1.5 font-poppins text-xs font-semibold tracking-tight text-neutral-500'>
              <span className={`${fetchError ? "bg-yellow-500" : "bg-green-500"} size-2 rounded-full`} />
              <p>{fetchError || "Analytics are up to date"}</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>

          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-35 rounded-md bg-neutral-800 animate-pulse"
            />
            ))
          : fetchError ? (
            <div className='rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-5 font-poppins text-sm text-yellow-100 sm:col-span-2 xl:col-span-4'>
              {fetchError}
            </div>
          )
          : (
            <>
              <Box boxData={{
                title: "Total time",
                time: formatTime(stopwatchData.totalTime + countdownData.totalTime)
              }} />

              <Box boxData={{
                title: "Today's time",
                time: formatTime(stopwatchData.todayTime + countdownData.todayTime)
              }} />

              <Box boxData={{
                title: "Current streak",
                time: `${streak} days`
              }} />

              <Box boxData={{
                title: "Average time",
                time: formatTime(stopwatchData.averageTime + countdownData.averageTime)
              }} />
            </>
          )}
        </div>

        

        <div className='min-w-0 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-[0_24px_80px_rgba(0,0,0,0.28)]'>
          <div className='flex flex-col justify-between gap-3 border-b border-white/10 bg-neutral-800/50 px-5 py-4 sm:flex-row sm:items-center'>
            <div>
              <p className='font-poppins text-lg font-semibold text-white'>Time tracked</p>
              <p className='mt-1 font-poppins text-sm text-neutral-500'>Monthly focus time</p>
            </div>
            <div className='flex items-center gap-2 font-poppins text-xs uppercase tracking-[0.18em] text-neutral-500'>
              <span className='h-2 w-2 rounded-full bg-green-500 ' />
              Time
            </div>
          </div>

          {loading ? (
            <div className="h-[420px] animate-pulse rounded-lg bg-neutral-800" />
          ) : fetchError ? (
            <div className='flex h-[360px] min-h-[360px] items-center justify-center p-6 text-center font-poppins text-sm text-neutral-500 sm:h-[420px] sm:min-h-[420px]'>
              <p>{fetchError}</p>
            </div>
          ) : (
            <ChartContainer
              className="h-[360px] min-h-[360px] w-full min-w-0 aspect-auto p-4 sm:h-[420px] sm:min-h-[420px]  sm:p-6"
              config={{
                value: {
                  label: "Time",
                  color: "rgba(255,255,255,0.92)",
                },
              }}
            >
              <BarChart data={chartData} margin={{ top: 20, right: 14, left: 10, bottom: 1 }} >
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)"  />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  stroke="rgba(255,255,255,0.35)"
                />
                <YAxis
                  tickFormatter={(value) => {
                    const hours = Math.floor(value / 3600);
                    const mins = Math.floor((value % 3600) / 60);

                    if (hours > 0) return `${hours}h`;
                    if (mins > 0) return `${mins}m`;
                    return `${value}s`;
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  width={30}
                  stroke="rgba(255,255,255,0.35)"
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(255,255,255,0.06)" }}
                  content={<ChartTooltipContent className="border border-white/13 bg-neutral-900 text-white" />}
                  
                />
                <Bar
                  dataKey="time"
                  fill="var(--color-value)"
                  radius={[7, 7, 0, 0]}
                  maxBarSize={46}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <Suspense
          fallback={
            <div className='h-56 rounded-lg border border-white/10 bg-neutral-800 animate-pulse'  />
          }
        >
          {fetchError ? (
            <div className='flex h-56 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 px-6 text-center font-poppins text-sm text-neutral-500'>
              <p>{fetchError}</p>
            </div>
          ) : (
            <Heatmap data={heatmapData} formatTime={formatTime} />
          )}
        </Suspense>

      </div>

    </div>
  )
}

export default Analytics
