"use client";

import React, { useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingOverlay } from "./OnboardingOverlay";
import { OnboardingArrow } from "./OnboardingArrow";

export function LandingPageOnboarding() {
    const { currentStep, isOnboarding, startOnboarding, completeStep } = useOnboarding();

    // Auto-start onboarding for first-time users - STRICT MODE
    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("mwarex_onboarding");
        // Ensure we are mounted
        if (!hasSeenOnboarding) {
            setTimeout(() => {
                startOnboarding();
            }, 1000);
        }
    }, [startOnboarding]);

    // Monitor clicks on the Sign Up button to complete this step
    useEffect(() => {
        if (!isOnboarding || currentStep !== "landing_signup") return;

        const signupButton = document.querySelector('a[href="/auth/signup"]');
        if (!signupButton) return;

        const handleClick = () => {
            // Small delay to allow the navigation to start before completing step
            setTimeout(() => {
                completeStep("landing_signup");
            }, 100);
        };

        signupButton.addEventListener("click", handleClick);
        return () => signupButton.removeEventListener("click", handleClick);
    }, [isOnboarding, currentStep, completeStep]);

    if (!isOnboarding || currentStep !== "landing_signup") {
        return null;
    }

    return (
        <OnboardingOverlay targetSelector='a[href="/auth/signup"]' allowInteraction={true}>
            <OnboardingArrow
                direction="down"
                text="Start by creating your MwareX account"
                position={{
                    top: "30%", // Adjust based on your header height
                    // Center is handled by overlay content area usually, but fixed position is safer for arrows
                    // We can calculate relative to target, but fixed % is robust for header
                    left: "50%",
                    // We will center it via CSS in the arrow component if needed, 
                    // or just rely on the visual arrow pointing roughly correct.
                    // For header button usually top-right or center. Let's guess:
                    // Landing page usually has "Get Started" in Hero center.
                }}
            // Let's refine position. The Hero button is central.
            // targetSelector attempts to find the link.
            // If it's the specific Hero button:
            />
        </OnboardingOverlay>
    );
}
