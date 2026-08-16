require("dotenv").config();
const mongoose = require("mongoose");
const Certificate = require("./models/certificate");

async function seedCertificate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Certificate.deleteOne({ certificateId: "MWX-CERT-2026-002" });

    const cert = await Certificate.create({
      certificateId: "MWX-CERT-2026-002",
      name: "Khushi Mittal",
      role: "Full Stack Developer Intern",
      company: "Mwarex",
      issueDate: new Date("2026-07-25T00:00:00Z"),
      duration: "25th June 2026 - 25th July 2026",
      status: "VALID",
      issuedBy: {
        name: "Samay",
        title: "Founder & CEO, Mwarex"
      }
    });

    console.log("Mock Certificate created:", cert);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding certificate:", error);
    process.exit(1);
  }
}

seedCertificate();

