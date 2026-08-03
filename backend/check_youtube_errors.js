const { Queue } = require("bullmq");
const Redis = require("ioredis");
require("dotenv").config({ path: "/Users/samaysamrat/Desktop/16 may/link/mwarex.in/backend/.env" });

const connection = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
const queue = new Queue("youtube-upload", { connection });

async function checkFailed() {
    console.log("Checking for failed YouTube uploads...");
    const failed = await queue.getFailed(0, 10);
    
    if (failed.length === 0) {
        console.log("No failed YouTube uploads found.");
    } else {
        failed.forEach((job) => {
            console.log(`\n--- Job ID: ${job.id} ---`);
            console.log(`Video ID: ${job.data.videoId}`);
            console.log(`Failed Reason: ${job.failedReason}`);
            if (job.stacktrace && job.stacktrace.length > 0) {
                console.log(`Error Stack: ${job.stacktrace[0].split('\n')[0]}`);
            }
        });
    }
    process.exit(0);
}

checkFailed().catch(console.error);
