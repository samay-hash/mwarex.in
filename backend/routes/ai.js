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
    try {
        const { keywords } = req.body;
        if (!keywords) return res.status(400).json({ message: "Keywords required" });

        const model = getModel();
        const prompt = `Generate 5 catchy, viral YouTube video titles for a video about: "${keywords}". 
    Return ONLY a JSON array of strings. Example: ["Title 1", "Title 2"]. Do not add markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown code blocks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const titles = JSON.parse(text);
        res.json({ titles });
    } catch (error) {
        console.error("AI Title Gen Error:", error);
        // Fallback for demo/error
        res.json({
            titles: [
                `Ultimate Guide to ${req.body.keywords}`,
                `Why ${req.body.keywords} is Insane!`,
                `I Tried ${req.body.keywords} for 7 Days`,
                `The Truth About ${req.body.keywords}`,
                `Stop Doing This With ${req.body.keywords}`
            ],
            isFallback: true
        });
    }
});

// Generate Thumbnail Ideas (Images via Pollinations)
router.post("/generate-thumbnails", userAuth, async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic required" });

        // 1. Get visual descriptions from Gemini
        const model = getModel();
        const prompt = `Generate 4 distinct, highly detailed visual descriptions for a YouTube thumbnail about: "${topic}". 
    The descriptions should be optimized for an AI image generator (like Midjourney/Stable Diffusion).
    Return ONLY a JSON array of strings. Example: ["Close up of...", "Wide shot of..."]. Do not add markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const prompts = JSON.parse(text);

        // 2. Convert to Pollinations URLs
        // Pollinations API: https://image.pollinations.ai/prompt/{prompt}
        const thumbnails = prompts.map(p => ({
            prompt: p,
            url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1280&height=720&nologo=true`
        }));

        res.json({ thumbnails });

    } catch (error) {
        console.error("AI Thumbnail Gen Error:", error);
        // Fallback
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(req.body.topic)}?width=1280&height=720&nologo=true`;
        res.json({
            thumbnails: [
                { url: fallbackUrl, prompt: "Fallback generation based on topic" }
            ],
            isFallback: true
        });
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
