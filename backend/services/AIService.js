const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");
    }

    getModel(modelName = "gemini-1.5-flash") {
        return this.genAI.getGenerativeModel({ model: modelName });
    }

    async generateTitles(keywords) {
        try {
            const model = this.getModel();
            const prompt = `Generate 5 catchy, viral YouTube video titles for a video about: "${keywords}". 
    Return ONLY a JSON array of strings. Example: ["Title 1", "Title 2"]. Do not add markdown formatting.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return { titles: JSON.parse(text) };
        } catch (error) {
            console.error("AI Title Gen Error:", error.message);
            return {
                titles: [
                    `The Ultimate Guide to ${keywords}`,
                    `Why Everyone is Talking About ${keywords}`,
                    `I Tried ${keywords} and You Won't Believe This`,
                    `Stop Doing ${keywords} Wrong!`,
                    `10 Secrets About ${keywords}`,
                ],
                isFallback: true,
            };
        }
    }

    async generateThumbnailPrompts(topic) {
        try {
            const model = this.getModel();
            const prompt = `Generate 4 distinct, highly detailed visual descriptions for a YouTube thumbnail about: "${topic}". 
    The descriptions should be optimized for an AI image generator (like Midjourney/Stable Diffusion).
    Return ONLY a JSON array of strings. Example: ["Close up of...", "Wide shot of..."]. Do not add markdown.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(text);
        } catch (error) {
            console.warn("Gemini Error:", error.message);
            return [
                `Youtube thumbnail of ${topic}, high quality, 4k, vibrant colors`,
                `Cinematic shot of ${topic}, dramatic lighting, hyperrealistic`,
                `Minimalist design of ${topic}, vector art style, clean background`,
                `Close-up excessive detail of ${topic}, professional photography`,
            ];
        }
    }

    async generateThumbnails(topic) {
        const prompts = await this.generateThumbnailPrompts(topic);
        const axios = require("axios");
        const cloudinary = require("cloudinary").v2;

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        if (process.env.POLLINATIONS_API_KEY) {
            const uploadPromises = prompts.map(async (p) => {
                const seed = Math.floor(Math.random() * 1000000);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;

                const imageRes = await axios.get(imageUrl, {
                    responseType: "arraybuffer",
                    headers: { Authorization: `Bearer ${process.env.POLLINATIONS_API_KEY}` },
                });

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

            return await Promise.all(uploadPromises);
        }

        return prompts.map((p) => {
            const seed = Math.floor(Math.random() * 1000000);
            return {
                prompt: p,
                url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`,
            };
        });
    }

    analyzeScore(title, description) {
        let score = 70;
        if (title && title.length > 20 && title.length < 60) score += 10;
        if (description && description.length > 100) score += 10;
        return Math.min(score, 100);
    }
}

module.exports = new AIService();
