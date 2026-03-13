const { S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION || "eu-north-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET = process.env.AWS_S3_BUCKET;

/**
 * Generate a presigned POST URL that allows the browser to upload
 * directly to S3 — no file passes through the backend.
 */
async function getPresignedUploadUrl({ key, contentType, maxSizeBytes }) {
    const { url, fields } = await createPresignedPost(s3, {
        Bucket: BUCKET,
        Key: key,
        Conditions: [
            ["content-length-range", 0, maxSizeBytes || 10 * 1024 * 1024 * 1024], // default 10 GB
            ["eq", "$Content-Type", contentType],
        ],
        Fields: {
            "Content-Type": contentType,
        },
        Expires: 3600, // 1 hour
    });

    return { url, fields };
}

/**
 * Get a readable stream from S3 for a given key.
 * Used by the YouTube uploader to stream directly S3 → YouTube.
 */
async function getS3ReadStream(key) {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await s3.send(command);
    return { stream: response.Body, contentLength: response.ContentLength };
}

/**
 * Delete a file from S3.
 */
async function deleteS3Object(key) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Get a temporary signed URL to view/download a file (7 days).
 */
async function getSignedDownloadUrl(key) {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3, command, { expiresIn: 7 * 24 * 3600 });
}

module.exports = { getPresignedUploadUrl, getS3ReadStream, deleteS3Object, getSignedDownloadUrl };
