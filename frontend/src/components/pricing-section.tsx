"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { paymentAPI, RAZORPAY_KEY_ID } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { PricingCarousel } from "@/components/pricing-carousel";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const pricingPlans = [
    {
        name: "Free",
        price: "0",
        priceInr: "0",
        planId: "free",
        description: "Best for Individual creators working with 1 editor",
        features: [
            "Secure editor uploads",
            "Video review & approval",
            "No channel access sharing",
            "Limited storage",
            "Manual publishing",
            "Direct publish to YouTube via API"
        ],
        icon: Shield,
        buttonText: "Get Started",
        popular: false,
        gradient: "from-emerald-500/20 to-teal-500/20",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-500",
    },
    {
        name: "Pro",
        price: "11",
        priceInr: "11",
        planId: "pro",
        description: "Best for Creators working with multiple editors",
        features: [
            "One-tap approval (mobile & desktop)",
            "Direct publish to YouTube via API",
            "Version control for edits",
            "Automatic revenue split calculation",
            "Collaboration tools",
            "Priority support",
        ],
        icon: Zap,
        buttonText: "Upgrade Now",
        popular: true,
        gradient: "from-indigo-500/20 to-violet-500/20",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
    },
    {
        name: "Team",
        price: "899",
        priceInr: "899",
        planId: "team",
        description: "Best for YouTube studios, agencies & large channels",
        features: [
            "Multiple creators & editors",
            "Advanced approval workflows",
            "Sponsorship tracking",
            "Secure archive vault",
            "24/7 Priority support",
            "Custom integrations"
        ],
        icon: Crown,
        buttonText: "Contact Sales",
        popular: false,
        gradient: "from-amber-500/20 to-orange-500/20",
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-500",
    },
];

export function PricingSection() {
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    // Load Razorpay script
    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSelectPlan = async (plan: typeof pricingPlans[0]) => {
        // Free plan - just redirect to signup
        if (plan.planId === "free") {
            router.push("/auth/signup");
            return;
        }

        // Check authentication
        if (!isAuthenticated()) {
            toast.error("Please sign in to upgrade your plan");
            router.push("/auth/signin");
            return;
        }

        setLoadingPlan(plan.planId);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load payment gateway. Please try again.");
                setLoadingPlan(null);
                return;
            }

            // Create order on backend
            const { data } = await paymentAPI.createOrder(plan.planId);

            if (!data.success) {
                toast.error(data.message || "Failed to create order");
                setLoadingPlan(null);
                return;
            }

            // Configure Razorpay options
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "MWareX",
                description: `${plan.name} Plan - Monthly Subscription`,
                order_id: data.order.id,
                handler: async function (response: any) {
                    try {
                        // Verify payment on backend
                        const verifyData = await paymentAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyData.data.success) {
                            toast.success(`🎉 Successfully upgraded to ${plan.name} plan!`);
                            // Redirect to dashboard
                            router.push("/dashboard/creator");
                        } else {
                            toast.error("Payment verification failed. Contact support.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                    setLoadingPlan(null);
                },
                prefill: {
                    name: "",
                    email: "",
                },
                notes: {
                    plan: plan.planId,
                },
                theme: {
                    color: "#6366f1",
                    backdrop_color: "rgba(0, 0, 0, 0.7)",
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlan(null);
                        toast.info("Payment cancelled");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error: any) {
            console.error("Payment error:", error);
            toast.error(error?.response?.data?.message || "Failed to initiate payment. Please try again.");
            setLoadingPlan(null);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            scale: 0.95,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                duration: 0.6,
            },
        },
    };

    const featureVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.08,
                duration: 0.3,
            },
        }),
    };

    return (
        <section className="relative py-32 px-6 overflow-hidden z-10 bg-background" id="pricing">
            {/* Enhanced Background */}
            <div className="absolute inset-0">
                {/* Subtle Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(var(--foreground) 1px, transparent 1px),
                            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Primary Glow */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.08, 0.05],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[180px]"
                />
                {/* Secondary Accents */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Text */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-5 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm mb-4"
                    >
                        <span className="text-primary font-semibold tracking-wide text-xs uppercase">
                            Flexible Pricing
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4"
                    >
                        Unlock Your Potential
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg"
                    >
                        Simple pricing for secure YouTube workflows. Scale as you grow.
                    </motion.p>

                    {/* Billing Toggle - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center justify-center gap-5 mt-10"
                    >
                        <span className={cn(
                            "text-sm font-semibold transition-all duration-300",
                            billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
                        )}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-14 h-7 bg-secondary rounded-full p-1 relative transition-colors duration-300 focus:outline-none ring-1 ring-border hover:ring-primary/30"
                        >
                            <motion.div
                                className="w-5 h-5 rounded-full shadow-md bg-primary"
                                animate={{ x: billingCycle === "monthly" ? 0 : 28 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn(
                            "text-sm font-semibold transition-all duration-300 relative",
                            billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
                        )}>
                            Yearly
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute -top-3 -right-8 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20"
                            >
                                -20%
                            </motion.span>
                        </span>
                    </motion.div>
                </div>

                {/* Pricing Cards Carousel */}
                <div className="w-full">
                    <PricingCarousel>
                        {pricingPlans.map((plan, index) => {
                            const isPopular = plan.popular;
                            const isHovered = hoveredPlan === plan.name;
                            const isLoading = loadingPlan === plan.planId;
                            const displayPrice = billingCycle === "yearly"
                                ? Math.round(parseInt(plan.priceInr) * 0.8)
                                : parseInt(plan.priceInr);

                            return (
                                <motion.div
                                    key={plan.name}
                                    onMouseEnter={() => setHoveredPlan(plan.name)}
                                    onMouseLeave={() => setHoveredPlan(null)}
                                    whileHover={{
                                        y: -12,
                                        scale: 1.03,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    className={cn(
                                        "relative rounded-3xl transition-all duration-300 flex flex-col h-full group w-full max-w-[380px] bg-card border border-border overflow-hidden",
                                        isPopular ? "shadow-2xl shadow-primary/20" : "shadow-lg hover:shadow-xl hover:shadow-primary/5"
                                    )}
                                >
                                    {/* Hover Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                                    </div>

                                    {/* Glass Swipe Effect */}
                                    <div className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent z-10 pointer-events-none" />

                                    {/* Gradient Border Effect */}
                                    <div className={cn(
                                        "absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl z-0",
                                        isPopular
                                            ? "opacity-100 bg-gradient-to-b from-primary/20 via-transparent to-transparent"
                                            : "opacity-0 group-hover:opacity-100 bg-gradient-to-b from-foreground/5 via-transparent to-transparent"
                                    )} />

                                    {/* Popular Badge */}
                                    {isPopular && (
                                        <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2 z-20">
                                            <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg shadow-primary/30 uppercase tracking-widest border-2 border-background">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    {/* Card Content */}
                                    <div className={cn(
                                        "relative z-10 flex flex-col h-full p-8",
                                        isPopular && "pt-12"
                                    )}>
                                        {/* Header */}
                                        <div className="mb-8 text-center relative">
                                            {/* Icon Background Glow */}
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-b from-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl",
                                                plan.iconColor
                                            )} />

                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10 transform group-hover:scale-110 transition-transform duration-300",
                                                plan.iconBg
                                            )}>
                                                <plan.icon className={cn("w-7 h-7", plan.iconColor)} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {plan.description}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-8 text-center bg-secondary/30 rounded-2xl p-4 border border-border/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors duration-300">
                                            {plan.price === "0" ? (
                                                <div className="flex items-center justify-center">
                                                    <span className="text-4xl font-black text-foreground tracking-tight">
                                                        Free
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center items-baseline gap-1">
                                                    <span className="text-4xl font-black text-foreground tracking-tight">
                                                        ₹{displayPrice}
                                                    </span>
                                                    <span className="text-muted-foreground text-sm font-medium">/mo</span>
                                                </div>
                                            )}
                                            {billingCycle === "yearly" && plan.price !== "0" && (
                                                <p className="text-xs text-emerald-500 font-medium mt-1">
                                                    Billed yearly (Save 20%)
                                                </p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-4 flex-1 mb-8">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-300",
                                                        isPopular || isHovered ? "bg-primary/20 text-primary" : "bg-emerald-500/10 text-emerald-500"
                                                    )}>
                                                        <Check className="w-3 h-3 stroke-[3]" />
                                                    </div>
                                                    <span className="group-hover:text-foreground transition-colors duration-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={isLoading || loadingPlan !== null}
                                            className={cn(
                                                "w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden group/btn shadow-md hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
                                                isPopular
                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    : "bg-background border-2 border-border hover:border-primary/50 text-foreground"
                                            )}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:scale-105 transition-transform">
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        {plan.buttonText}
                                                        {isPopular && <Zap className="w-4 h-4 fill-current" />}
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </PricingCarousel>
                </div>

                {/* Secure Payment Badge */}
                <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50 backdrop-blur-md">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Secure payments powered by <strong className="text-foreground">Razorpay</strong></span>
                </div>
            </div>
        </section>
    );
}
