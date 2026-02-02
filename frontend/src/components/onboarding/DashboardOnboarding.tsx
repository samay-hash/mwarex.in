"use client";

import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { OnboardingOverlay } from "./OnboardingOverlay";
import { OnboardingArrow } from "./OnboardingArrow";
import { OnboardingTooltip } from "./OnboardingTooltip";

export function DashboardOnboarding() {
    const { currentStep, isOnboarding, completeStep } = useOnboarding();

    // Helper to handle completion events
    const attachListener = (selector: string, stepName: any, delay = 300) => {
        const el = document.querySelector(selector);
        if (!el) return;

        // Remove old listeners to prevent dups if re-rendering (simple cleanup)
        const handler = () => {
            setTimeout(() => completeStep(stepName), delay);
        };
        el.addEventListener('click', handler, { once: true });
        // Note: detailed cleanup is better in useEffect but this is a quick functional restoration
    };

    // Step 3: Creator Dashboard - Invite Editor
    useEffect(() => {
        if (!isOnboarding || currentStep !== "dashboard_invite") return;

        // Using a broad selector to catch the button. 
        // In real app, adding data-onboarding="invite-editor" is best.
        // Assuming button exists:
        // Find button containing "Invite" text
        const buttons = Array.from(document.querySelectorAll('button'));
        const inviteBtn = buttons.find(btn => btn.textContent?.includes('Invite'));

        // We'll rely on the user clicking the HIGHLIGHTED element.
        // The overlay interaction click handler passes through.
        // We need to detect that click.

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.textContent?.includes("Invite") || target.closest('button')?.textContent?.includes("Invite")) {
                setTimeout(() => completeStep("dashboard_invite"), 300);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [isOnboarding, currentStep, completeStep]);

    // Step 4: Email Input (Typing check)
    useEffect(() => {
        if (!isOnboarding || currentStep !== "invite_modal_email") return;

        const input = document.querySelector('input[type="email"]');
        if (!input) return;

        const handleInput = (e: Event) => {
            if ((e.target as HTMLInputElement).value.includes('@')) {
                completeStep("invite_modal_email");
            }
        };
        input.addEventListener('input', handleInput);
        return () => input.removeEventListener('input', handleInput);
    }, [isOnboarding, currentStep, completeStep]);

    // Step 5: Invite Modal - Create
    useEffect(() => {
        if (!isOnboarding || currentStep !== "invite_modal_create") return;
        // Listen for submit/click on create
        const btn = document.querySelector('button[type="submit"]') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Send'));
        if (!btn) return;

        const handler = () => setTimeout(() => completeStep("invite_modal_create"), 500);
        btn.addEventListener('click', handler);
        return () => btn.removeEventListener('click', handler);
    }, [isOnboarding, currentStep, completeStep]);

    // Step 6 & 7: Auto-progress timers
    useEffect(() => {
        if (!isOnboarding) return;

        if (currentStep === "invitation_created") {
            const t = setTimeout(() => completeStep("invitation_created"), 3000);
            return () => clearTimeout(t);
        }
        if (currentStep === "waiting_for_video") {
            const t = setTimeout(() => completeStep("waiting_for_video"), 4000);
            return () => clearTimeout(t);
        }
    }, [isOnboarding, currentStep, completeStep]);

    // Step 7: YouTube (Step 7 in request, mapped to youtube_connect)
    useEffect(() => {
        if (!isOnboarding || currentStep !== "youtube_connect") return;
        // Selector for YouTube button
        const btn = document.querySelector('[data-onboarding="youtube-connect"]') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Connect'));
        if (!btn) return;

        const handler = () => setTimeout(() => completeStep("youtube_connect"), 500);
        btn.addEventListener('click', handler);
        return () => btn.removeEventListener('click', handler);
    }, [isOnboarding, currentStep, completeStep]);

    // Step 8: Approval
    useEffect(() => {
        if (!isOnboarding || currentStep !== "video_approval") return;

        const btn = document.querySelector('[data-onboarding="approve-video"]') ||
            Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Approve'));
        if (!btn) return;

        const handler = () => {
            setTimeout(() => {
                completeStep("video_approval");
                completeStep("completed");
            }, 500);
        };
        btn.addEventListener('click', handler);
        return () => btn.removeEventListener('click', handler);
    }, [isOnboarding, currentStep, completeStep]);


    if (!isOnboarding) return null;

    return (
        <AnimatePresence>
            {/* Step 3 */}
            {currentStep === "dashboard_invite" && (
                <OnboardingOverlay targetSelector='button' allowInteraction={true}>
                    <OnboardingArrow
                        direction="down"
                        text="Invite your editor to collaborate"
                        position={{ top: "20%", right: "30%" }}
                    />
                </OnboardingOverlay>
            )}

            {/* Step 4 */}
            {currentStep === "invite_modal_email" && (
                <OnboardingOverlay targetSelector='input[type="email"]' allowInteraction={true}>
                    <OnboardingArrow
                        direction="right"
                        text="Enter your editor's Gmail address"
                        position={{ top: "40%", left: "10%" }}
                    />
                </OnboardingOverlay>
            )}

            {/* Step 5 */}
            {currentStep === "invite_modal_create" && (
                <OnboardingOverlay targetSelector='button[type="submit"]' allowInteraction={true}>
                    <OnboardingArrow
                        direction="down"
                        text="Send invitation"
                        position={{ top: "30%", left: "50%" }}
                    />
                </OnboardingOverlay>
            )}

            {/* Step 6 */}
            {currentStep === "invitation_created" && (
                <OnboardingTooltip
                    text="✅ Great! Now send this invitation link to your editor"
                    position={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
            )}

            {/* Step 7: Waiting state (Request Step 6) */}
            {currentStep === "waiting_for_video" && (
                <OnboardingTooltip
                    text="Once your editor uploads a video, it will appear here"
                    position={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
            )}

            {/* Step 8: YouTube (Request Step 7) */}
            {currentStep === "youtube_connect" && (
                <OnboardingOverlay targetSelector='[data-onboarding="youtube-connect"]' allowInteraction={true}>
                    <OnboardingArrow
                        direction="down"
                        text="Connect your YouTube channel securely"
                        position={{ top: "25%", left: "50%" }}
                    />
                </OnboardingOverlay>
            )}

            {/* Step 9: Approve (Request Step 8) */}
            {currentStep === "video_approval" && (
                <OnboardingOverlay targetSelector='[data-onboarding="approve-video"]' allowInteraction={true}>
                    <OnboardingArrow
                        direction="right"
                        text="Approve the video to publish it on YouTube"
                        position={{ top: "50%", left: "20%" }}
                    />
                </OnboardingOverlay>
            )}
        </AnimatePresence>
    );
}
