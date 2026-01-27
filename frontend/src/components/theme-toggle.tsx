"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hover:scale-105 active:scale-95 focus:outline-none",
                isDark
                    ? "bg-slate-800 text-blue-200 hover:bg-slate-700"
                    : "bg-amber-100 text-amber-500 hover:bg-amber-200"
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {/* Simple icon swap - no infinite animations */}
            <div className="relative w-full h-full flex items-center justify-center">
                {isDark ? (
                    <Moon className="w-5 h-5" />
                ) : (
                    <Sun className="w-5 h-5" />
                )}
            </div>
        </button>
    );
}
