import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  CheckCircle,
  ChevronRight,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { FaGithub, FaHeart, FaXTwitter } from "react-icons/fa6";
import { SiBuymeacoffee } from "react-icons/si";

import AppShowcase from "./landing/AppShowcase";
import BentoHeatmapWidget from "./landing/BentoHeatmapWidget";
import BentoLeaderboardWidget from "./landing/BentoLeaderboardWidget";
import BentoSettingsWidget from "./landing/BentoSettingsWidget";
import BentoStreakWidget from "./landing/BentoStreakWidget";
import BentoTimerWidget from "./landing/BentoTimerWidget";
import { formatCompact } from "./landing/format";
import { heatCells, leaderboardRows } from "./landing/landingData";

const MotionSpan = motion.span;

function Landing() {
  const [totalUsers, setTotalUsers] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const res = await axios.get("/api/user/public-stats");
        setTotalUsers(res.data.stats?.totalUsers ?? null);
      } catch (err) {
        console.log("error fetching landing stats:", err);
      }
    };

    fetchPublicStats();
  }, []);

  const userCountLabel = useMemo(
    () => (totalUsers === null ? "1,240" : formatCompact(totalUsers)),
    [totalUsers],
  );

  const stats = [
    { value: userCountLabel, label: "registered users" },
    { value: "6", label: "focus tools included" },
    { value: "365", label: "days of activity heatmap" },
  ];

  return (
    <div
      className="h-screen w-screen overflow-y-auto bg-[#fafafa] text-neutral-950 font-sans selection:bg-white selection:text-black"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#171717 transparent",
      }}
    >
      <title>Timmo — Beautiful Focus Timer, Heatmaps & Leaderboards</title>
      <meta name="author" content="Samiran De" />
      <meta
        name="description"
        content="Timmo is a minimalist, premium focus application featuring workspaces, countdowns, activity heatmaps, global leaderboards, and customizable aesthetics."
      />
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <header>
          <nav
            id="main-navbar"
            className="sticky top-4 z-40 mx-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-full border border-neutral-200/80 bg-white/80 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] backdrop-blur-md sm:px-6"
          >
            <Link
              to="/"
              className="font-gothic text-lg tracking-wide hover:opacity-80 transition"
            >
              Timmo
            </Link>

            <div className="hidden items-center gap-7 font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 md:flex">
              <a href="#features" className="transition hover:text-neutral-950">
                Features
              </a>
              <a href="#preview" className="transition hover:text-neutral-950">
                Preview
              </a>
              <a href="#proof" className="transition hover:text-neutral-950">
                Proof
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={isLoggedIn ? "/analytics" : "/login"}
                id="nav-login-btn"
                className="hidden rounded-full border border-neutral-200 bg-white px-5 py-2 font-sans text-xs font-bold text-neutral-800 transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:border-neutral-300 sm:block"
              >
                {isLoggedIn ? "Dashboard" : "Log in"}
              </Link>
              <Link
                to={isLoggedIn ? "/clock" : "/login"}
                id="nav-start-btn"
                className="group flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2 font-sans text-xs font-bold text-white shadow shadow-neutral-900/10 transition hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                {isLoggedIn ? "Clock" : "Start"}
                <ArrowUpRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="relative flex min-h-[calc(100vh-72px)] flex-col items-center justify-center overflow-hidden pb-10 pt-10 text-center sm:pt-14 w-full">
            {/* Minimal Background Grid Design */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:96px_96px]" />
            <div className="absolute left-1/2 top-24 -z-10 h-80 w-[75%] -translate-x-1/2 rounded-full bg-neutral-250 bg-neutral-200/10 blur-3xl" />

            {/* Social Proof Badge */}
            <div className="mb-6 flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 font-sans text-xs font-bold text-neutral-600 shadow-[0_2px_8px_rgba(0,0,0,0.015)] backdrop-blur">
              <div className="flex -space-x-1.5">
                {["T", "M", "S"].map((item) => (
                  <span
                    key={item}
                    className="flex size-6 items-center justify-center rounded-full border border-white text-[10px] text-white font-black bg-neutral-950 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span>Used by {userCountLabel} focus builders</span>
            </div>

            {/* Hero Main Heading (Instrument Serif accents) */}
            <div className="flex flex-col items-center px-2 w-full">
              <h1 className="max-w-4xl font-sans text-[clamp(2rem,6.2vw,4.5rem)] font-extrabold tracking-tight text-neutral-950 text-center leading-[1.1]">
                A quiet workspace for <br />
                <span className="font-instrumental font-normal italic text-neutral-500 text-[1.12em] block sm:inline mt-2 sm:mt-0">
                  deep study, analytics, and rank.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-neutral-500 sm:text-lg text-center font-medium px-4">
              Timmo turns every focused minute into a visible system: clock,
              stopwatch, countdown, streaks, heatmaps, leaderboard, and settings
              that feel calm enough to use every day.
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row z-10 px-4">
              <Link
                to={isLoggedIn ? "/analytics" : "/login"}
                id="hero-start-free"
                className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 font-sans text-sm font-semibold text-white shadow-lg shadow-neutral-950/10 hover:shadow-xl hover:shadow-neutral-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto"
              >
                {isLoggedIn ? "Go to Dashboard" : "Get started free"}
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#preview"
                id="hero-view-demo"
                className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white/75 px-6 font-sans text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:border-neutral-300 sm:w-auto"
              >
                View product demo
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* SaaS Screenshot Showcase Mockup */}
            <div id="preview" className="mt-14 w-full px-1 sm:px-4">
              <AppShowcase />
            </div>
          </section>

          {/* Core App Statistics */}
          <section className="grid gap-6 py-12 grid-cols-1 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group rounded-2xl border border-neutral-200 bg-white/80 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-white"
              >
                <p className="font-instrumental text-5xl font-medium italic text-neutral-950 sm:text-6xl">
                  {item.value}
                </p>
                <p className="mt-2 font-sans text-xs font-bold tracking-wider uppercase text-neutral-400">
                  {item.label}
                </p>
              </div>
            ))}
          </section>

          {/* Features Bento Grid */}
          <section id="features" className="py-14 w-full">
            <div className="mx-auto max-w-3xl text-center mb-10 px-4">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
                Bento System
              </span>
              <h2 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-neutral-950">
                Everything your focus app <br />
                <span className="font-instrumental font-normal italic text-neutral-450 text-neutral-455 text-neutral-400">
                  should remember.
                </span>
              </h2>
            </div>

            {/* Dynamic Bento Grid Widgets */}
            <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
              <BentoTimerWidget />
              <BentoStreakWidget />
              <BentoHeatmapWidget />
              <BentoLeaderboardWidget />
              <BentoSettingsWidget />
            </div>
          </section>

          {/* Analytics Overview Section */}
          <section className="grid gap-6 py-12 grid-cols-1 lg:grid-cols-2 items-center w-full">
            {/* Analytics Details Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm backdrop-blur w-full">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 border border-neutral-200/80 px-3 py-1 rounded-full">
                Analytics Preview
              </span>
              <h2 className="mt-5 font-sans text-3xl font-black leading-tight text-neutral-950">
                Know if you are actually{" "}
                <span className="font-instrumental font-normal italic text-neutral-500">
                  improving.
                </span>
              </h2>
              <p className="mt-4 font-sans text-sm leading-relaxed text-neutral-500 font-medium">
                Your saved stopwatch and countdown sessions become clear daily
                totals, averages, streaks, charts, and activity heatmaps.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { val: "128h total", label: "Focus logged" },
                  { val: "2h today", label: "Session time" },
                  { val: "14 day streak", label: "Current momentum" },
                  { val: "52m avg", label: "Daily average" },
                ].map((item) => (
                  <div
                    key={item.val}
                    className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 sm:p-4 transition-all duration-350 hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-neutral-900" />
                      <span className="font-sans text-sm font-extrabold text-neutral-800">
                        {item.val}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-450 mt-1 font-bold uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Dashboard Visual Chart */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-6 shadow shadow-neutral-200/30 relative overflow-hidden group w-full">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
                <div className="mb-6 flex items-center justify-between border-b border-neutral-105 border-neutral-100 pb-4">
                  <div>
                    <p className="font-sans text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Analytics Dashboard
                    </p>
                    <p className="font-sans text-lg font-bold text-neutral-900 mt-1">
                      Focus Distribution
                    </p>
                  </div>
                  <TrendingUp className="text-neutral-950 w-5 h-5 animate-pulse" />
                </div>

                {/* Responsive bar graph */}
                <div className="flex h-52 items-end gap-1.5 sm:gap-3 px-2 w-full">
                  {[
                    { label: "M", val: 32, color: "bg-neutral-900" },
                    { label: "T", val: 54, color: "bg-neutral-900" },
                    { label: "W", val: 39, color: "bg-neutral-900" },
                    { label: "T", val: 68, color: "bg-neutral-950" },
                    { label: "F", val: 44, color: "bg-neutral-900" },
                    { label: "S", val: 76, color: "bg-neutral-900" },
                    {
                      label: "S",
                      val: 81,
                      color: "bg-neutral-955 bg-neutral-950",
                    },
                    { label: "M", val: 48, color: "bg-neutral-900" },
                    { label: "T", val: 92, color: "bg-neutral-950" },
                    { label: "W", val: 70, color: "bg-neutral-900" },
                    { label: "T", val: 58, color: "bg-neutral-900" },
                    { label: "F", val: 86, color: "bg-neutral-950" },
                  ].map((bar, idx) => (
                    <div
                      key={idx}
                      className="w-full flex flex-col items-center gap-2 group/bar"
                    >
                      <div className="relative w-full h-40 flex items-end">
                        <MotionSpan
                          initial={{ height: 0 }}
                          whileInView={{ height: `${bar.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.04 }}
                          className={`w-full rounded-t transition-all duration-300 hover:scale-x-110 hover:opacity-100 opacity-80 ${bar.color}`}
                        />
                        <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {(bar.val / 10).toFixed(1)}h
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-500">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Proof Section (Leaderboard and heatmap) */}
          <section
            id="proof"
            className="grid gap-6 py-12 grid-cols-1 lg:grid-cols-3 w-full"
          >
            {/* Leaderboard Section */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm lg:col-span-2 flex flex-col justify-between w-full">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-neutral-100 pb-6">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-55 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full">
                    Leaderboard
                  </span>
                  <h2 className="mt-4 font-sans text-3xl font-black leading-tight text-neutral-950">
                    Compete without the{" "}
                    <span className="font-instrumental font-normal italic text-neutral-450 text-neutral-400">
                      chaos.
                    </span>
                  </h2>
                  <p className="text-sm text-neutral-500 mt-2 font-medium">
                    Compare streaks and daily focus times with other creators
                    globally.
                  </p>
                </div>
                <Award className="text-neutral-950 w-8 h-8 self-start" />
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 shadow-[0_2px_12px_rgba(0,0,0,0.015)] bg-white w-full">
                {leaderboardRows.map(([rank, name, time, streak]) => (
                  <div
                    key={rank}
                    className="grid grid-cols-[50px_1fr_100px_80px] sm:grid-cols-[60px_1fr_120px_100px] items-center gap-2 sm:gap-4 border-b border-neutral-100 bg-white px-4 sm:px-6 py-4 font-sans text-sm last:border-b-0 hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border ${
                        rank === "01"
                          ? "bg-yellow-50 text-yellow-850 border-yellow-200"
                          : rank === "02"
                            ? "bg-neutral-100 text-neutral-800 border-neutral-200"
                            : "bg-orange-50 text-orange-850 border-orange-200"
                      }`}
                    >
                      #{rank}
                    </span>
                    <span className="font-bold text-neutral-950 flex items-center gap-2 truncate">
                      {name}
                      {rank === "01" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse shrink-0" />
                      )}
                    </span>
                    <span className="font-bold text-neutral-600 whitespace-nowrap">
                      {time} focus
                    </span>
                    <span className="text-xs font-bold text-neutral-450 text-neutral-450 text-neutral-400 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                      <Flame className="w-3.5 h-3.5 text-neutral-900 fill-neutral-900" />
                      {streak} streak
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Annual Calendar Heatmap Showcase */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between w-full min-h-[300px]">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-full font-sans">
                  Consistency
                </span>
                <h3 className="mt-4 font-sans text-3xl font-black text-neutral-950 leading-tight">
                  Your year, <br />
                  <span className="font-instrumental font-normal italic text-neutral-400">
                    one glance.
                  </span>
                </h3>
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed font-medium">
                  Make your daily focus streak visible. Every box represents a
                  day you showed up.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-6 gap-2 sm:gap-2.5">
                {heatCells.map((value, index) => {
                  const opacity = 0.08 + value / 115;
                  return (
                    <MotionSpan
                      key={index}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      className="aspect-square rounded bg-neutral-950 cursor-pointer shadow-sm"
                      style={{ opacity }}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] text-neutral-450 mt-6 border-t border-neutral-100 pt-4 font-bold">
                <span>Less study</span>
                <span>More focus</span>
              </div>
            </div>
          </section>

          {/* Call to Action Banner (Light gray minimalist layout) */}
          <section className="py-12 w-full">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100/70 text-neutral-950 shadow-[0_12px_40px_rgba(0,0,0,0.015)] w-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.025),transparent_40%)]" />

              <div className="relative grid gap-8 p-6 sm:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center w-full">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-600 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                    Get Started
                  </span>
                  <h2 className="mt-5 max-w-2xl font-sans text-3xl sm:text-4xl font-extrabold leading-[1.15] sm:text-5xl">
                    Make your next focused minute{" "}
                    <span className="block font-instrumental font-normal italic text-neutral-500 mt-1">
                      count.
                    </span>
                  </h2>
                  <p className="mt-4 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-neutral-500 font-medium">
                    Create an account, start a session, and let Timmo turn your
                    work into momentum you can see and feel every single day.
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to={isLoggedIn ? "/clock" : "/login"}
                    id="cta-start-btn"
                    className="group flex h-12 w-full max-w-64 items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 font-sans text-sm font-semibold text-white shadow hover:bg-neutral-850 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 sm:w-fit cursor-pointer"
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Create account free"}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Sponsor/Support Section */}
          <section className="py-6 w-full mt-4 px-4">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] w-full">
              {/* Decorative radial gradients */}
              <div className="absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />
              <div className="absolute -left-24 -bottom-24 -z-10 h-64 w-64 rounded-full bg-amber-100/30 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center w-full">
                <div className="text-left">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-50 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Sponsor & Support
                  </span>

                  <h2 className="mt-5 font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 leading-[1.2]">
                    Help us build the <br />
                    <span className="font-instrumental font-normal italic text-neutral-500 block sm:inline mt-1">
                      ultimate workspace.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-neutral-500 font-medium">
                    Timmo is indie-crafted and completely free of clutter. Your
                    support directly funds server costs, new focus widgets, and
                    continuous upgrades. Join us in building a better, quiet
                    web.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm lg:justify-self-end">
                  <a
                    href="https://github.com/sponsors/Sam721166"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-14 w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:shadow-[0_10px_20px_-10px_rgba(244,63,94,0.15)] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500 transition-colors duration-300 group-hover:bg-pink-100">
                        <FaHeart className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <p className="font-sans text-xs font-bold text-neutral-800">
                          GitHub Sponsors
                        </p>
                        <p className="text-[10px] font-semibold text-neutral-400">
                          Support monthly or one-time
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <a
                    href="https://buymeacoffee.com/samirande_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex h-14 w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.15)] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 transition-colors duration-300 group-hover:bg-amber-100">
                        <SiBuymeacoffee className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-sans text-xs font-bold text-neutral-800">
                          Buy Me a Coffee
                        </p>
                        <p className="text-[10px] font-semibold text-neutral-400">
                          Buy a cup to show support
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-neutral-200/60 py-8 text-neutral-500 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-gothic text-base tracking-wide text-neutral-800">
                Timmo
              </span>
              <span className="text-neutral-300">|</span>
              <p>© {new Date().getFullYear()} Timmo. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Sam721166/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/samirande_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
                aria-label="Twitter/X"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-neutral-200/20 pt-4 text-center text-[11px] text-neutral-400">
            <p>
              Built with <span className="text-red-500 animate-pulse">❤️</span>{" "}
              by{" "}
              <a
                href="https://github.com/Sam721166"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Samiran De
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}


export default Landing;
