"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { paymentAPI, RAZORPAY_KEY_ID } from "@/lib/api";

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan?: string;
}

const plans = [
    {
        id: "pro",
        name: "Pro Plan",
        price: 299,
        description: "For creators who want to scale faster.",
        features: [
            "Unlimited Projects",
            "Advanced AI Tools",
            "Priority Support",
            "Remove Watermarks"
        ],
        icon: Zap,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        popular: true
    },
    {
        id: "team",
        name: "Team Plan",
        price: 999,
        description: "Perfect for agencies and studios.",
        features: [
            "Everything in Pro",
            "Team Collaboration",
            "Custom Integrations",
            "Dedicated Account Manager"
        ],
        icon: Crown,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        popular: false
    }
];

export function SubscriptionModal({ isOpen, onClose, currentPlan = "free" }: SubscriptionModalProps) {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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

    const handleUpgrade = async (plan: typeof plans[0]) => {
        setLoadingPlan(plan.id);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error("Failed to load payment gateway");
                setLoadingPlan(null);
                return;
            }

            const { data } = await paymentAPI.createOrder(plan.id);
            if (!data.success) throw new Error(data.message);

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "MWareX",
                description: `Upgrade to ${plan.name}`,
                order_id: data.order.id,
                handler: async function (response: any) {
                    try {
                        const verifyData = await paymentAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyData.data.success) {
                            toast.success(`🎉 Upgraded to ${plan.name}!`);
                            onClose();
                            // Ideally trigger a refresh of user data here
                            window.location.reload();
                        }
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                    setLoadingPlan(null);
                },
                prefill: {
                    name: "Creator", // Could fetch from user data
                    email: ""
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
            setLoadingPlan(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-[#0f0f11] border border-white/10 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Unlock Full Potential</h2>
                                        <p className="text-sm text-gray-400">Choose a plan to turbocharge your workflow.</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={cn(
                                                "relative p-6 rounded-2xl border transition-all duration-300 group hover:border-white/20",
                                                plan.border,
                                                plan.bg
                                            )}
                                        >
                                            {plan.popular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                                    Most Popular
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn("p-3 rounded-xl bg-black/20", plan.color)}>
                                                    <plan.icon className="w-6 h-6" />
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-white">₹{plan.price}</div>
                                                    <div className="text-xs text-gray-400">/month</div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                                            <p className="text-sm text-gray-400 mb-6 h-10">{plan.description}</p>

                                            <div className="space-y-3 mb-8">
                                                {plan.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                        <Check className={cn("w-4 h-4 shrink-0", plan.color)} />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handleUpgrade(plan)}
                                                disabled={loadingPlan !== null}
                                                className={cn(
                                                    "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                                                    currentPlan === plan.id
                                                        ? "bg-white/10 text-gray-400 cursor-not-allowed"
                                                        : "bg-white text-black hover:bg-gray-100 hover:scale-[1.02]"
                                                )}
                                            >
                                                {loadingPlan === plan.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : currentPlan === plan.id ? (
                                                    "Current Plan"
                                                ) : (
                                                    "Upgrade Now"
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-black/20 text-center text-xs text-gray-500 border-t border-white/5">
                                <span className="flex items-center justify-center gap-2">
                                    <Shield className="w-3 h-3" /> Secure payment powered by Razorpay
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
