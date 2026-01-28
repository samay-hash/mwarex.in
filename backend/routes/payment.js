const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const Payment = require("../models/payment");
const User = require("../models/user");
const authMiddleware = require("../middlewares/userMiddleware");

// Check Razorpay keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("⚠️  WARNING: Razorpay keys not found in environment variables!");
}

// Initialize Razorpay
let razorpay;
try {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);
} catch (err) {
    console.error("❌ Failed to initialize Razorpay:", err.message);
}

// Plan pricing (in paise - 100 paise = 1 INR)
const PLANS = {
    pro: {
        name: "Pro",
        amount: 79900, // ₹799
        features: ["Unlimited projects", "Priority support", "Advanced AI tools"],
    },
    team: {
        name: "Team",
        amount: 199900, // ₹1999
        features: ["Everything in Pro", "Team collaboration", "Custom integrations"],
    },
};

const fs = require('fs');
const path = require('path');

// Create Order - Initiates payment
router.post("/create-order", authMiddleware, async (req, res) => {
    const logPath = path.join(__dirname, '../payment_debug.log');
    const log = (msg) => fs.appendFileSync(logPath, new Date().toISOString() + ': ' + msg + '\n');

    try {
        log('Request received for create-order');
        const { plan } = req.body;
        const userId = req.userId;
        log(`User ID: ${userId}, Plan: ${plan}`);

        if (!razorpay) {
            log('Razorpay instance is NOT initialized');
            return res.status(500).json({
                success: false,
                message: "Payment gateway is not configured correctly. Please check server logs."
            });
        }
        log('Razorpay instance is present');

        if (!plan || !PLANS[plan]) {
            log('Invalid plan');
            return res.status(400).json({
                success: false,
                message: "Invalid plan selected"
            });
        }

        const planDetails = PLANS[plan];
        log('Plan details found: ' + JSON.stringify(planDetails));

        // Create Razorpay order
        const shortUserId = userId.toString().slice(-10); // Last 10 chars of user ID
        const receiptId = `ord_${Date.now()}_${shortUserId}`; // Approx 28 chars

        const options = {
            amount: planDetails.amount,
            currency: "INR",
            receipt: receiptId,
            notes: {
                userId: userId,
                plan: plan,
            },
        };
        log('Creating Razorpay order with options: ' + JSON.stringify(options));

        const order = await razorpay.orders.create(options);
        log('Razorpay order created: ' + JSON.stringify(order));

        // Save order to database
        const payment = new Payment({
            userId: userId,
            orderId: order.id,
            amount: planDetails.amount,
            plan: plan,
            status: "created",
        });
        await payment.save();
        log('Payment record saved to DB');

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            key: process.env.RAZORPAY_KEY_ID,
            plan: planDetails,
        });
    } catch (error) {
        log('ERROR in create-order: ' + error.message);
        log('Stack: ' + error.stack);
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order: " + error.message,
            error: error.message
        });
    }
});

// Verify Payment - Called after successful payment
router.post("/verify", authMiddleware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.userId;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed - Invalid signature"
            });
        }

        // Update payment record
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature;
        payment.status = "paid";
        payment.paidAt = new Date();
        await payment.save();

        // Update user subscription
        await User.findByIdAndUpdate(userId, {
            $set: {
                subscription: {
                    plan: payment.plan,
                    status: "active",
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    paymentId: razorpay_payment_id,
                },
            },
        });

        res.json({
            success: true,
            message: "Payment verified successfully!",
            plan: payment.plan,
        });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
});

// Get user's subscription status
router.get("/subscription", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("subscription");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const subscription = user.subscription || { plan: "free", status: "active" };

        res.json({
            success: true,
            subscription,
        });
    } catch (error) {
        console.error("Get subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get subscription",
            error: error.message
        });
    }
});

// Get payment history
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({
            userId: req.userId,
            status: "paid"
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            payments,
        });
    } catch (error) {
        console.error("Get payment history error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get payment history",
            error: error.message
        });
    }
});

// Webhook for Razorpay events (optional but recommended)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (webhookSecret) {
            const signature = req.headers["x-razorpay-signature"];
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(JSON.stringify(req.body))
                .digest("hex");

            if (signature !== expectedSignature) {
                return res.status(400).json({ message: "Invalid webhook signature" });
            }
        }

        const event = req.body;

        // Handle different events
        switch (event.event) {
            case "payment.captured":
                console.log("Payment captured:", event.payload.payment.entity.id);
                break;
            case "payment.failed":
                console.log("Payment failed:", event.payload.payment.entity.id);
                const failedPayment = await Payment.findOne({
                    paymentId: event.payload.payment.entity.id
                });
                if (failedPayment) {
                    failedPayment.status = "failed";
                    await failedPayment.save();
                }
                break;
            default:
                console.log("Unhandled webhook event:", event.event);
        }

        res.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ message: "Webhook processing failed" });
    }
});

module.exports = router;
