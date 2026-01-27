"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const pricingPlans = [
    {
        name: "Free",
        price: "0",
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
        popular: false
    },
    {
        name: "Standard",
        price: "45.00",
        description: "Best for Creators working with multiple editors",
        features: [
            "One-tap approval (mobile & desktop)",
            "Direct publish to YouTube via API",
            "Version control for edits",
            "Automatic revenue split calculation",
            "Collaboration tools",
        ],
        icon: Zap,
        buttonText: "Get Started",
        popular: true
    },
    {
        name: "Business",
        price: "99.00",
        description: "Best for YouTube studios, agencies & large channels",
        features: [
            "Multiple creators & editors",
            "Advanced approval workflows",
            "Sponsorship tracking",
            "Secure archive vault",
            "Priority support"
        ],
        icon: Crown,
        buttonText: "Get Started",
        popular: false
    },
];

export function PricingSection() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const handleSelectPlan = (planName: string) => {
        toast.success(`You selected ${planName} plan. (Backend integration coming soon)`);
    };

    return (
        <section className="relative py-32 px-6 overflow-hidden z-10 bg-background" id="pricing">
            {/* Background */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(var(--foreground) 1px, transparent 1px),
                            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Text */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm mb-4"
                    >
                        <span className="text-primary font-medium tracking-wide text-xs uppercase">
                            Flexible Pricing
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Unlock Your Potential
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Simple pricing for secure YouTube workflows. Scale as you grow.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium transition-colors", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-12 h-6 bg-secondary rounded-full p-1 relative transition-colors duration-300 focus:outline-none ring-1 ring-border"
                        >
                            <motion.div
                                className="w-4 h-4 rounded-full shadow-sm bg-primary"
                                animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors relative", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="absolute -top-3 -right-6 text-[10px] text-green-500 font-bold bg-green-500/10 px-1 rounded">-20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {pricingPlans.map((plan, index) => {
                        const isPopular = plan.popular;

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredPlan(plan.name)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                className={cn(
                                    "relative rounded-3xl p-[1px] transition-all duration-300 flex flex-col h-full group",
                                    isPopular
                                        ? "bg-gradient-to-b from-primary/30 via-primary/20 to-transparent shadow-2xl shadow-primary/10 md:-translate-y-4"
                                        : "bg-border hover:bg-primary/20"
                                )}
                            >
                                {/* Inner Card Content */}
                                <div className={cn(
                                    "flex flex-col h-full rounded-[23px] p-8 border border-border/50 bg-card",
                                    isPopular ? "bg-card" : "bg-card/80"
                                )}>

                                    {/* Header */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <plan.icon className="w-5 h-5" />
                                            </div>
                                            {isPopular && (
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                                                    Most Popular
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8">
                                        {plan.price === "0" ? (
                                            <div className="flex items-end gap-1">
                                                <span className="text-4xl font-bold text-foreground">Free</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                                                <span className="text-muted-foreground text-sm font-medium">/mo</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan.name)}
                                        className={cn(
                                            "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 border relative overflow-hidden",
                                            isPopular
                                                ? "bg-primary text-primary-foreground hover:opacity-90 border-transparent shadow-lg shadow-primary/20"
                                                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary border-border"
                                        )}
                                    >
                                        <span className="relative z-10">{plan.buttonText}</span>
                                    </button>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-border mb-8" />

                                    {/* Features */}
                                    <ul className="space-y-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
