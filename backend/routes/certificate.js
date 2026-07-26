const express = require("express");
const router = express.Router();
const Certificate = require("../models/certificate");

// GET /api/v1/certificates/:id - Fetch certificate by certificateId
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findOne({ certificateId: id });
    
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found or invalid" });
    }

    return res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/v1/certificates - Create a new certificate (Admin/Internal use)
router.post("/", async (req, res) => {
  try {
    const { name, role, company, issueDate, duration, issuedBy } = req.body;
    
    if (!name || !role || !issueDate || !duration) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Generate a unique certificate ID e.g., MWX-CERT-2026-001
    // We'll query the last certificate to increment the counter
    const currentYear = new Date(issueDate).getFullYear();
    
    // Find the latest certificate for this year
    const latestCert = await Certificate.findOne({ 
      certificateId: new RegExp(`^MWX-CERT-${currentYear}-`) 
    }).sort({ createdAt: -1 });

    let newCount = 1;
    if (latestCert) {
      const parts = latestCert.certificateId.split('-');
      if (parts.length === 4) {
        newCount = parseInt(parts[3], 10) + 1;
      }
    }
    
    const paddedCount = String(newCount).padStart(3, '0');
    const certificateId = `MWX-CERT-${currentYear}-${paddedCount}`;

    const newCertificate = await Certificate.create({
      certificateId,
      name,
      role,
      company: company || "Mwarex",
      issueDate,
      duration,
      issuedBy: issuedBy || { name: "Samay", title: "Founder & CEO, Mwarex" }
    });

    return res.status(201).json({ success: true, data: newCertificate });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
