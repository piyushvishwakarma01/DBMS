import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new donation
router.post("/", async (req, res) => {
  const { userId, foodItems, expiryDate, images } = req.body;
  try {
    const donation = await prisma.foodDonation.create({
      data: {
        userId,
        expiryDate: new Date(expiryDate),
        foodItems: { create: foodItems },
        images: { create: images },
        status: { create: { status: "pending" } },
      },
    });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: "Error creating donation" });
  }
});

// Get all donations for a user
router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const donations = await prisma.foodDonation.findMany({
      where: { userId: Number(userId) },
      include: { foodItems: true, status: true, images: true },
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donations" });
  }
});

module.exports = router;
