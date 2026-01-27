const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const userAuth = require("../middlewares/userMiddleware");

// Initialize Gemini
// Ensure GEMINI_API_KEY is in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

// Helper to get model
const getModel = () => genAI.getGenerativeModel({ model: "gemini-pro" });

// Generate Titles
router.post("/generate-titles", userAuth, async (req, res) => {
    const { keywords } = req.body;
    if (!keywords) return res.status(400).json({ message: "Keywords required" });

    try {
        // Use gemini-1.5-flash as it is the latest stable model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate 5 catchy, viral YouTube video titles for a video about: "${keywords}". 
    Return ONLY a JSON array of strings. Example: ["Title 1", "Title 2"]. Do not add markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const titles = JSON.parse(text);
        res.json({ titles });
    } catch (error) {
        console.error("AI Title Gen Error (Falling back to templates):", error.message);
        // Robust Fallback: Template-based titles
        const fallbackTitles = [
            `The Ultimate Guide to ${keywords}`,
            `Why Everyone is Talking About ${keywords}`,
            `I Tried ${keywords} and You Won't Believe This`,
            `Stop Doing ${keywords} Wrong!`,
            `10 Secrets About ${keywords}`,
            `${keywords}: The Full Tutorial`
        ];
        res.json({
            titles: fallbackTitles.slice(0, 5),
            isFallback: true
        });
    }
});

// Cloudinary Config
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const axios = require("axios");

// Generate Thumbnail Ideas (Images via Pollinations)
router.post("/generate-thumbnails", userAuth, async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic required" });

    let prompts = [];

    try {
        // 1. Try to get optimized prompts from Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate 4 distinct, highly detailed visual descriptions for a YouTube thumbnail about: "${topic}". 
    The descriptions should be optimized for an AI image generator (like Midjourney/Stable Diffusion).
    Return ONLY a JSON array of strings. Example: ["Close up of...", "Wide shot of..."]. Do not add markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        prompts = JSON.parse(text);

    } catch (error) {
        console.warn("Gemini Error (Using direct prompts):", error.message);
        // Fallback: Use the user's topic directly with different artistic styles
        prompts = [
            `Youtube thumbnail of ${topic}, high quality, 4k, vibrant colors`,
            `Cinematic shot of ${topic}, dramatic lighting, hyperrealistic`,
            `Minimalist design of ${topic}, vector art style, clean background`,
            `Close-up excessive detail of ${topic}, professional photography`
        ];
    }

    try {
        // 2. Generate Images
        // If POLLINATIONS_API_KEY is present, we fetch -> upload to Cloudinary for persistence
        if (process.env.POLLINATIONS_API_KEY) {
            console.log("Using Pollinations API Key for generation...");

            const uploadPromises = prompts.map(async (p) => {
                const seed = Math.floor(Math.random() * 1000000);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;

                // Fetch image buffer
                const imageRes = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    headers: { 'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}` }
                });

                // Upload to Cloudinary
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "mwarex_thumbnails" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve({ prompt: p, url: result.secure_url });
                        }
                    );
                    uploadStream.end(imageRes.data);
                });
            });

            const thumbnails = await Promise.all(uploadPromises);
            return res.json({ thumbnails });
        }

        // Fallback: Client-side URLs (Free Tier)
        const thumbnails = prompts.map(p => {
            const seed = Math.floor(Math.random() * 1000000);
            return {
                prompt: p,
                url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`
            };
        });

        res.json({ thumbnails });

    } catch (error) {
        console.error("Thumbnail Generation Error:", error);
        res.status(500).json({ message: "Failed to generate thumbnails" });
    }
});

// Analyze Score
router.post("/analyze-score", userAuth, async (req, res) => {
    try {
        const { title, description } = req.body;
        // Simple heuristic + Randomness for 'Demo' feel if AI fails, 
        // but try real AI analysis if possible.

        // Heuristic Score
        let score = 70;
        if (title && title.length > 20 && title.length < 60) score += 10;
        if (description && description.length > 100) score += 10;

        // AI Analysis could go here...

        res.json({ score: Math.min(score, 100) });
    } catch (error) {
        res.json({ score: 75 });
    }
});

module.exports = router;
