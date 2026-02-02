"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type OnboardingStep =
    | "landing_signup"
    | "signup_form"
    | "signup_register"
    | "dashboard_invite"
    | "invite_modal_email"
    | "invite_modal_create"
    | "invitation_created"
    | "waiting_for_video"
    | "youtube_connect"
    | "video_approval"
    | "completed";

interface OnboardingContextType {
    currentStep: OnboardingStep;
    isOnboarding: boolean;
    startOnboarding: () => void;
    completeStep: (step: OnboardingStep) => void;
    skipOnboarding: () => void;
    resetOnboarding: () => void;
    canSkip: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STEPS: OnboardingStep[] = [
    "landing_signup",
    "signup_form",
    "signup_register",
    "dashboard_invite",
    "invite_modal_email",
    "invite_modal_create",
    "invitation_created",
    "waiting_for_video",
    "youtube_connect",
    "video_approval",
    "completed",
];

const STORAGE_KEY = "mwarex_onboarding";

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>("landing_signup");
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [canSkip, setCanSkip] = useState(false);

    // Load onboarding state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setCurrentStep(data.currentStep || "landing_signup");
                setIsOnboarding(data.isOnboarding || false);
                setCanSkip(data.hasCompletedOnce || false);
            } catch (e) {
                console.error("Failed to parse onboarding state:", e);
            }
        }
    }, []);

    // Save onboarding state to localStorage
    useEffect(() => {
        const data = {
            currentStep,
            isOnboarding,
            hasCompletedOnce: canSkip,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [currentStep, isOnboarding, canSkip]);

    const startOnboarding = () => {
        setIsOnboarding(true);
        setCurrentStep("landing_signup");
    };

    const completeStep = (step: OnboardingStep) => {
        const currentIndex = ONBOARDING_STEPS.indexOf(step);
        const nextIndex = currentIndex + 1;

        if (nextIndex < ONBOARDING_STEPS.length) {
            setCurrentStep(ONBOARDING_STEPS[nextIndex]);
        }

        // If completed, allow skipping in the future
        if (step === "completed") {
            setCanSkip(true);
            setIsOnboarding(false);
        }
    };

    const skipOnboarding = () => {
        if (canSkip) {
            setIsOnboarding(false);
        }
    };

    const resetOnboarding = () => {
        setCurrentStep("landing_signup");
        setIsOnboarding(false);
        setCanSkip(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <OnboardingContext.Provider
            value={{
                currentStep,
                isOnboarding,
                startOnboarding,
                completeStep,
                skipOnboarding,
                resetOnboarding,
                canSkip,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
}
