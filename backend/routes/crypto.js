const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const router = express.Router();
const Payment = require("../models/payment");
const User = require("../models/user");
const authMiddleware = require("../middlewares/userMiddleware");

// Check Coinbase keys
// Check Coinbase keys
if (!process.env.COINBASE_API_KEY || !process.env.COINBASE_WEBHOOK_SECRET) {
    console.warn("⚠️  WARNING: Coinbase keys not found in environment variables!");
    console.log("COINBASE_API_KEY:", process.env.COINBASE_API_KEY ? "Found" : "Missing");
} else {
    console.log("✅ Coinbase Keys Found");
}

const COINBASE_API_URL = "https://api.commerce.coinbase.com/charges";

// Plan pricing (in USD for crypto usually, or match INR equivalent)
// Assuming we convert roughly or just use USD prices for simplicity
// Free: $0, Pro: $11 (approx), Team: $899 (approx 100x?)
// Wait, the Razorpay plans were 11 INR and 899 INR (very cheap or test mode?)
// The user said "Pro: 11" (paise? no, priceInr: "11").
// Let's assume these are the prices.
// Coinbase Commerce requires a minimum amount.
// If prices are 11 INR (~$0.13), it might be too low for some coins, but let's try.
const PLANS = {
    pro: {
        name: "Pro",
        amount: "11.00", // INR
        currency: "INR",
        features: ["Unlimited projects", "Priority support", "Advanced AI tools"],
    },
    team: {
        name: "Team",
        amount: "899.00", // INR
        currency: "INR",
        features: ["Everything in Pro", "Team collaboration", "Custom integrations"],
    },
};

// Create Charge - Initiates crypto payment
router.post("/create-charge", authMiddleware, async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        if (!process.env.COINBASE_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Crypto payment gateway is not configured."
            });
        }

        if (!plan || !PLANS[plan]) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan selected"
            });
        }

        const planDetails = PLANS[plan];

        // Create Coinbase Charge
        const chargeData = {
            name: `Mwarex ${planDetails.name} Plan`,
            description: "Subscription to Mwarex",
            local_price: {
                amount: planDetails.amount,
                currency: planDetails.currency,
            },
            pricing_type: "fixed_price",
            metadata: {
                userId: userId,
                plan: plan,
            },
            redirect_url: `${process.env.FRONTEND_URL || "https://mwarex.in"}/dashboard/creator?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL || "https://mwarex.in"}/#pricing`,
        };

        const response = await axios.post(COINBASE_API_URL, chargeData, {
            headers: {
                "X-CC-Api-Key": process.env.COINBASE_API_KEY,
                "X-CC-Version": "2018-03-22",
                "Content-Type": "application/json",
            },
        });

        const charge = response.data.data;

        // Save payment intent to database
        const payment = new Payment({
            userId: userId,
            orderId: charge.code, // Unique charge code
            amount: parseFloat(planDetails.amount) * 100, // Storing in paise to match Razorpay format if needed, or just standard
            // Wait, Razorpay stores mostly in paise. "1100" was 11 INR.
            // Here we have "11.00" string.
            // Let's store consistent with Razorpay: 11 * 100 = 1100.
            paymentId: charge.id,
            plan: plan,
            provider: "coinbase",
            status: "created",
            currency: planDetails.currency
        });

        await payment.save();

        res.json({
            success: true,
            hosted_url: charge.hosted_url,
        });

    } catch (error) {
        console.error("Create crypto charge error:", error?.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create crypto charge: " + (error?.response?.data?.error?.message || error.message),
        });
    }
});

// Webhook for Coinbase events
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
        const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;
        const signature = req.headers["x-cc-webhook-signature"];

        if (!webhookSecret || !signature) {
            // If not configured, just return ok to stop retries or error
            return res.status(400).json({ message: "Webhook not configured or missing signature" });
        }

        // Verify signature
        // Coinbase webhook payload is the raw body
        const rawBody = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid webhook signature" });
        }

        const event = JSON.parse(rawBody).event;
        const data = event.data;

        // Handle confirmed payments
        if (event.type === "charge:confirmed") {
            const chargeCode = data.code;
            const userId = data.metadata.userId;
            const plan = data.metadata.plan;

            // Find payment record
            const payment = await Payment.findOne({ orderId: chargeCode });
            if (payment) {
                payment.status = "paid";
                payment.paidAt = new Date();
                // payment.paymentId is already charge.id from creation, or data.id here
                await payment.save();

                // Update user subscription
                // NOTE: We rely on metadata user ID. 
                // Using payment.userId is safer if metadata is tampered (though signature prevents tampering)
                const targetUserId = payment.userId || userId;

                await User.findByIdAndUpdate(targetUserId, {
                    $set: {
                        subscription: {
                            plan: plan,
                            status: "active",
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                            paymentId: data.id,
                            provider: "coinbase"
                        },
                    },
                });

                console.log(`✅ Crypto payment confirmed for user ${targetUserId}, plan ${plan}`);
            } else {
                console.warn(`⚠️ Payment record not found for charge ${chargeCode}`);
            }
        } // Handle failed/other events if needed

        res.json({ received: true });

    } catch (error) {
        console.error("Crypto webhook error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
});

module.exports = router;
