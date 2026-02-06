"use client";

import ReactLenis from "lenis/react";
import { ReactNode, useState, useEffect } from "react";

interface SmoothScrollProviderProps {
    children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    // Completely disable Lenis for native scroll feel as requested
    return <>{children}</>;
}
