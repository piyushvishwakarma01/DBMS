import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get feedback for a donation
router.get("/:donationId", async (req, res) => {
  const { donationId } = req.params;
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { donationId: Number(donationId) },
    });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Error fetching feedback" });
  }
});

module.exports = router;
