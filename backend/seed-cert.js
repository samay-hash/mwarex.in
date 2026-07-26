require("dotenv").config();
const mongoose = require("mongoose");
const Certificate = require("./models/certificate");

async function seedCertificate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Certificate.deleteOne({ certificateId: "MWX-CERT-2026-001" });

    const cert = await Certificate.create({
      certificateId: "MWX-CERT-2026-001",
      name: "Shashi Raj",
      role: "Full Stack Developer Intern",
      company: "Mwarex",
      issueDate: new Date("2026-07-25T00:00:00Z"),
      duration: "25 June 2026 – 25 July 2026",
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
