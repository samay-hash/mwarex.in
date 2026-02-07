"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield, Loader2, Users, Upload } from "lucide-react";
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

    const handleCryptoPayment = async (plan: typeof pricingPlans[0]) => {
        // Check authentication
        if (!isAuthenticated()) {
            toast.error("Please sign in to upgrade your plan");
            router.push("/auth/signin");
            return;
        }

        setLoadingPlan(plan.planId);

        try {
            const { data } = await paymentAPI.createCryptoCharge(plan.planId);

            if (data.success && data.hosted_url) {
                // Redirect to Coinbase Commerce
                window.location.href = data.hosted_url;
            } else {
                toast.error("Failed to initiate crypto payment");
            }
        } catch (error: any) {
            console.error("Crypto payment error:", error);
            toast.error(error?.response?.data?.message || "Failed to initiate crypto payment");
        } finally {
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
        <section className="relative py-32 px-6 overflow-hidden z-10 bg-transparent dark:bg-background" id="pricing">

            {/* Dark Mode Background Effects */}
            <div className="absolute inset-0 hidden dark:block">
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

                {/* Pricing Cards - New Design */}
                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => {
                            const isPopular = plan.popular;
                            const isLoading = loadingPlan === plan.planId;
                            const displayPrice = billingCycle === "yearly"
                                ? Math.round(parseInt(plan.priceInr) * 0.8)
                                : parseInt(plan.priceInr);

                            return (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={cn(
                                        "relative rounded-2xl overflow-hidden group",
                                        "bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl",
                                        "border border-border/50 dark:border-white/10",
                                        isPopular && "ring-1 ring-primary/50 dark:ring-orange-500/30"
                                    )}
                                >
                                    {/* Decorative Gradient Shapes */}
                                    <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none">
                                        <div className={cn(
                                            "absolute top-4 right-4 w-20 h-20 rounded-full blur-xl",
                                            plan.planId === "free" ? "bg-cyan-500/40" :
                                                plan.planId === "pro" ? "bg-orange-500/40" :
                                                    "bg-violet-500/40"
                                        )} />
                                        <div className={cn(
                                            "absolute top-8 right-8 w-12 h-12 rounded-full blur-lg",
                                            plan.planId === "free" ? "bg-teal-400/50" :
                                                plan.planId === "pro" ? "bg-rose-400/50" :
                                                    "bg-purple-400/50"
                                        )} />
                                    </div>

                                    {/* Popular Badge */}
                                    {isPopular && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-zinc-800 dark:bg-white/10 text-foreground border border-border/50 dark:border-white/20">
                                                Most popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6 relative z-10">
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center mb-5",
                                            plan.planId === "free" ? "bg-cyan-500/20 text-cyan-500" :
                                                plan.planId === "pro" ? "bg-orange-500/20 text-orange-500" :
                                                    "bg-violet-500/20 text-violet-500"
                                        )}>
                                            <plan.icon className="w-5 h-5" />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-xl font-bold text-foreground mb-1">
                                            {plan.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-5">
                                            {plan.price === "0" ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold text-foreground">Free</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold text-foreground">₹{displayPrice}</span>
                                                    <span className="text-sm text-muted-foreground">/month</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            disabled={isLoading || loadingPlan !== null}
                                            className={cn(
                                                "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-6",
                                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                                isPopular
                                                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/20"
                                                    : "bg-transparent border border-border dark:border-white/20 text-foreground hover:bg-muted/50 dark:hover:bg-white/5"
                                            )}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                            ) : (
                                                plan.buttonText
                                            )}
                                        </button>

                                        {/* Crypto Payment Option - Subtle */}
                                        {plan.price !== "0" && (
                                            <button
                                                onClick={() => handleCryptoPayment(plan)}
                                                disabled={isLoading || loadingPlan !== null}
                                                className="w-full text-xs text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-4 mb-6 transition-colors"
                                            >
                                                Pay with Crypto
                                            </button>
                                        )}

                                        {/* Key Stats */}
                                        <div className="space-y-2 mb-5">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-5 h-5 rounded-full bg-muted/50 dark:bg-white/5 flex items-center justify-center">
                                                    <Users className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    <span className="text-foreground font-medium">
                                                        {plan.planId === "free" ? "1" : plan.planId === "pro" ? "5" : "Unlimited"}
                                                    </span>
                                                    {" "}editors included
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-5 h-5 rounded-full bg-muted/50 dark:bg-white/5 flex items-center justify-center">
                                                    <Upload className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <span className="text-muted-foreground">
                                                    <span className="text-foreground font-medium">
                                                        {plan.planId === "free" ? "2GB" : plan.planId === "pro" ? "50GB" : "Unlimited"}
                                                    </span>
                                                    {" "}storage
                                                </span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        {isPopular && (
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex-1 h-px bg-border dark:bg-white/10" />
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    {plan.name} Features
                                                </span>
                                                <div className="flex-1 h-px bg-border dark:bg-white/10" />
                                            </div>
                                        )}

                                        {/* Features List */}
                                        <ul className="space-y-2.5">
                                            {plan.features.slice(0, isPopular ? 6 : 4).map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2.5 text-sm">
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full flex items-center justify-center",
                                                        isPopular
                                                            ? "bg-orange-500/20 text-orange-500"
                                                            : "bg-muted/50 dark:bg-white/10 text-muted-foreground"
                                                    )}>
                                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                    </div>
                                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                                        {feature}
                                                    </span>
                                                    {/* AI Badge for special features */}
                                                    {feature.toLowerCase().includes("automatic") && (
                                                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-muted/50 dark:bg-white/10 text-muted-foreground border border-border/50 dark:border-white/10">
                                                            ✦ AI-based
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
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
