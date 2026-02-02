"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingOverlay } from "./OnboardingOverlay";
import { OnboardingArrow } from "./OnboardingArrow";

export function SignupPageOnboarding() {
    const { currentStep, isOnboarding, completeStep } = useOnboarding();
    const [subStep, setSubStep] = useState<"form" | "button">("form");

    // Progress through signup steps
    useEffect(() => {
        if (!isOnboarding) return;

        if (currentStep === "signup_form") {
            // Step 2a: Point to form
            // After 3 seconds, move to highlighting the register button (Step 2b)
            const timer = setTimeout(() => {
                setSubStep("button");
                completeStep("signup_form"); // Move logic state to next step (register button)
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOnboarding, currentStep, completeStep]);

    // Listen for form submission
    useEffect(() => {
        if (!isOnboarding || currentStep !== "signup_register") return;

        const form = document.querySelector('form');
        if (!form) return;

        const handleSubmit = () => {
            // Complete this step when they submit the form
            setTimeout(() => {
                completeStep("signup_register");
            }, 500);
        };

        form.addEventListener("submit", handleSubmit);
        return () => form.removeEventListener("submit", handleSubmit);
    }, [isOnboarding, currentStep, completeStep]);

    if (!isOnboarding) return null;

    return (
        <AnimatePresence>
            {/* Step 2: Fill in details */}
            {currentStep === "signup_form" && subStep === "form" && (
                <OnboardingOverlay targetSelector="form" allowInteraction={true}>
                    <OnboardingArrow
                        direction="down"
                        text="Fill in your details to register"
                        position={{
                            top: "15%",
                            left: "50%",
                        }}
                    />
                </OnboardingOverlay>
            )}

            {/* Step 2b: Click register */}
            {currentStep === "signup_register" && (
                <OnboardingOverlay targetSelector='button[type="submit"]' allowInteraction={true}>
                    <OnboardingArrow
                        direction="right"
                        text="Click here to register"
                        position={{
                            top: "60%", // Approximate relative to form
                            left: "10%",
                        }}
                    />
                </OnboardingOverlay>
            )}
        </AnimatePresence>
    );
}
