"use client";

import ReactLenis from "lenis/react";
import { ReactNode } from "react";

interface SmoothScrollProviderProps {
    children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.3, // Increased from 0.1 for snappier response
                duration: 0.8, // Decreased from 1.2 for faster settling
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}
