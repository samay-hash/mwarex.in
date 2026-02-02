"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Add type definition for View Transitions API
declare global {
    interface Document {
        startViewTransition?: (callback: () => Promise<void> | void) => {
            ready: Promise<void>;
            finished: Promise<void>;
            updateCallbackDone: Promise<void>;
        };
    }
}

// ///////////////////////////////////////////////////////////////////////////
// Types

export type AnimationVariant =
    | "circle"
    | "rectangle"
    | "gif"
    | "polygon"
    | "circle-blur";
export type AnimationStart =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "top-center"
    | "bottom-center"
    | "bottom-up"
    | "top-down"
    | "left-right"
    | "right-left";

interface Animation {
    name: string;
    css: string;
}

// ///////////////////////////////////////////////////////////////////////////
// Helper Functions

const getPositionCoords = (position: AnimationStart) => {
    switch (position) {
        case "top-left":
            return { cx: "0", cy: "0" };
        case "top-right":
            return { cx: "40", cy: "0" };
        case "bottom-left":
            return { cx: "0", cy: "40" };
        case "bottom-right":
            return { cx: "40", cy: "40" };
        case "top-center":
            return { cx: "20", cy: "0" };
        case "bottom-center":
            return { cx: "20", cy: "40" };
        // For directional positions, default to center (these are used for rectangle variant)
        case "bottom-up":
        case "top-down":
        case "left-right":
        case "right-left":
            return { cx: "20", cy: "20" };
    }
};

const generateSVG = (variant: AnimationVariant, start: AnimationStart) => {
    // circle-blur variant handles center case differently, so check it first
    if (variant === "circle-blur") {
        if (start === "center") {
            return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
        }
        const positionCoords = getPositionCoords(start);
        if (!positionCoords) {
            throw new Error(`Invalid start position: ${start}`);
        }
        const { cx, cy } = positionCoords;
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }

    if (start === "center") return;

    // Rectangle variant doesn't use SVG masks, so return early
    if (variant === "rectangle") return "";

    const positionCoords = getPositionCoords(start);
    if (!positionCoords) {
        throw new Error(`Invalid start position: ${start}`);
    }
    const { cx, cy } = positionCoords;

    if (variant === "circle") {
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
    }

    return "";
};

const getTransformOrigin = (start: AnimationStart) => {
    switch (start) {
        case "top-left":
            return "top left";
        case "top-right":
            return "top right";
        case "bottom-left":
            return "bottom left";
        case "bottom-right":
            return "bottom right";
        case "top-center":
            return "top center";
        case "bottom-center":
            return "bottom center";
        // For directional positions, default to center
        case "bottom-up":
        case "top-down":
        case "left-right":
        case "right-left":
            return "center";
    }
};

export const createAnimation = (
    variant: AnimationVariant,
    start: AnimationStart = "center",
    blur = false,
    url?: string,
): Animation => {
    const svg = generateSVG(variant, start);
    const transformOrigin = getTransformOrigin(start);

    if (variant === "rectangle") {
        const getClipPath = (direction: AnimationStart) => {
            switch (direction) {
                case "bottom-up":
                    return {
                        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "top-down":
                    return {
                        from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "left-right":
                    return {
                        from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "right-left":
                    return {
                        from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "top-left":
                    return {
                        from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "top-right":
                    return {
                        from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "bottom-left":
                    return {
                        from: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                case "bottom-right":
                    return {
                        from: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
                default:
                    return {
                        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    };
            }
        };

        const clipPath = getClipPath(start);

        return {
            name: `${variant}-${start}${blur ? "-blur" : ""}`,
            css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPath.to};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPath.to};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
        };
    }
    if (variant === "circle" && start == "center") {
        return {
            name: `${variant}-${start}${blur ? "-blur" : ""}`,
            css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark${blur ? "-blur" : ""} {
        from {
          clip-path: circle(0% at 50% 50%);
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light${blur ? "-blur" : ""} {
        from {
           clip-path: circle(0% at 50% 50%);
           ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
        };
    }
    if (variant === "gif") {
        return {
            name: `${variant}-${start}`,
            css: `
      ::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}

::view-transition-new(root) {
  mask: url('${url}') center / 0 no-repeat;
  animation: scale 3s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 3s;
}

@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}`,
        };
    }

    if (variant === "circle-blur") {
        if (start === "center") {
            return {
                name: `${variant}-${start}`,
                css: `
        ::view-transition-group(root) {
          animation-timing-function: var(--expo-out);
        }

        ::view-transition-new(root) {
          mask: url('${svg}') center / 0 no-repeat;
          mask-origin: content-box;
          animation: scale 1s;
          transform-origin: center;
        }

        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: scale 1s;
          transform-origin: center;
          z-index: -1;
        }

        @keyframes scale {
          to {
            mask-size: 350vmax;
          }
        }
        `,
            };
        }

        return {
            name: `${variant}-${start}`,
            css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }

      ::view-transition-new(root) {
        mask: url('${svg}') ${start.replace("-", " ")} / 0 no-repeat;
        mask-origin: content-box;
        animation: scale 1s;
        transform-origin: ${transformOrigin};
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1s;
        transform-origin: ${transformOrigin};
        z-index: -1;
      }

      @keyframes scale {
        to {
          mask-size: 350vmax;
        }
      }
      `,
        };
    }

    if (variant === "polygon") {
        const getPolygonClipPaths = (position: AnimationStart) => {
            switch (position) {
                case "top-left":
                    return {
                        darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
                        darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
                        lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
                        lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
                    };
                case "top-right":
                    return {
                        darkFrom: "polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%)",
                        darkTo: "polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%)",
                        lightFrom: "polygon(-71% 50%, 50% 171%, 50% 171%, -71% 50%)",
                        lightTo: "polygon(-71% 50%, 50% 171%, 250% 71%, 150% -71%)",
                    };
                default:
                    // Default to top-left behavior
                    return {
                        darkFrom: "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
                        darkTo: "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
                        lightFrom: "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
                        lightTo: "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
                    };
            }
        };

        const clipPaths = getPolygonClipPaths(start);

        return {
            name: `${variant}-${start}${blur ? "-blur" : ""}`,
            css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPaths.darkFrom};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPaths.darkTo};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: ${clipPaths.lightFrom};
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: ${clipPaths.lightTo};
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
        };
    }

    // Handle circle variants with start positions using clip-path
    if (variant === "circle" && start !== "center") {
        const getClipPathPosition = (position: AnimationStart) => {
            switch (position) {
                case "top-left":
                    return "0% 0%";
                case "top-right":
                    return "100% 0%";
                case "bottom-left":
                    return "0% 100%";
                case "bottom-right":
                    return "100% 100%";
                case "top-center":
                    return "50% 0%";
                case "bottom-center":
                    return "50% 100%";
                default:
                    return "50% 50%";
            }
        };

        const clipPosition = getClipPathPosition(start);

        return {
            name: `${variant}-${start}${blur ? "-blur" : ""}`,
            css: `
       ::view-transition-group(root) {
        animation-duration: 1s;
        animation-timing-function: var(--expo-out);
      }
            
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
        ${blur ? "filter: blur(2px);" : ""}
      }

      @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
        from {
          clip-path: circle(0% at ${clipPosition});
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(150.0% at ${clipPosition});
          ${blur ? "filter: blur(0px);" : ""}
        }
      }

      @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
        from {
           clip-path: circle(0% at ${clipPosition});
           ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          clip-path: circle(150.0% at ${clipPosition});
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
      `,
        };
    }

    return {
        name: `${variant}-${start}${blur ? "-blur" : ""}`,
        css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-in);
      }
      ::view-transition-new(root) {
        mask: url('${svg}') ${start.replace("-", " ")} / 0 no-repeat;
        mask-origin: content-box;
        animation: scale-${start}${blur ? "-blur" : ""} 1s;
        transform-origin: ${transformOrigin};
        ${blur ? "filter: blur(2px);" : ""}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale-${start}${blur ? "-blur" : ""} 1s;
        transform-origin: ${transformOrigin};
        z-index: -1;
      }
      @keyframes scale-${start}${blur ? "-blur" : ""} {
        from {
          ${blur ? "filter: blur(8px);" : ""}
        }
        ${blur ? "50% { filter: blur(4px); }" : ""}
        to {
          mask-size: 2000vmax;
          ${blur ? "filter: blur(0px);" : ""}
        }
      }
    `,
    };
};

// ///////////////////////////////////////////////////////////////////////////
// Hook

export const useThemeToggle = ({
    variant = "circle",
    start = "center",
    blur = false,
    gifUrl = "",
}: {
    variant?: AnimationVariant;
    start?: AnimationStart;
    blur?: boolean;
    gifUrl?: string;
} = {}) => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(resolvedTheme === "dark");
    }, [resolvedTheme]);

    const styleId = "theme-transition-styles";

    const updateStyles = useCallback((css: string, name: string) => {
        if (typeof window === "undefined") return;

        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = css;
    }, []);

    const toggleTheme = useCallback(() => {
        // We want to toggle to the OPPOSITE of the current resolved state
        const nextTheme = isDark ? "light" : "dark";

        // Prepare animation BEFORE switching
        const animation = createAnimation(variant, start, blur, gifUrl);
        updateStyles(animation.css, animation.name);

        if (typeof window === "undefined") return;

        // The switch function
        const switchTheme = () => {
            setTheme(nextTheme);
            setIsDark(!isDark); // Optimistic update
        };

        // Use view transition if supported
        if (!document.startViewTransition) {
            switchTheme();
            return;
        }

        document.startViewTransition(switchTheme);
    }, [isDark, setTheme, variant, start, blur, gifUrl, updateStyles]);

    return {
        isDark,
        toggleTheme,
    };
};

// ///////////////////////////////////////////////////////////////////////////
// Component

export function ThemeToggle({
    className = "",
    variant = "circle",
    start = "top-right", // Default to top-right for correct origin from header
    blur = false,
    gifUrl = "",
}: {
    className?: string;
    variant?: AnimationVariant;
    start?: AnimationStart;
    blur?: boolean;
    gifUrl?: string;
}) {
    const { isDark, toggleTheme } = useThemeToggle({
        variant,
        start,
        blur,
        gifUrl,
    });

    // Hydration safety
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />;
    }

    return (
        <button
            type="button"
            className={cn(
                "size-10 cursor-pointer rounded-full bg-black p-0 transition-all duration-300 active:scale-95",
                className,
            )}
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            <span className="sr-only">Toggle theme</span>
            <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.g
                    animate={{ rotate: isDark ? -180 : 0 }}
                    transition={{ ease: "easeInOut", duration: 0.5 }}
                >
                    <path
                        d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
                        fill="white"
                    />
                    <path
                        d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
                        fill="black"
                    />
                </motion.g>
                <motion.path
                    animate={{ rotate: isDark ? 180 : 0 }}
                    transition={{ ease: "easeInOut", duration: 0.5 }}
                    d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
                    fill="white"
                />
            </svg>
        </button>
    );
}
