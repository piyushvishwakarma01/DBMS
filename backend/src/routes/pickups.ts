import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Schedule a pickup
router.post("/", async (req, res) => {
  const { donationId, date, time } = req.body;
  try {
    const pickup = await prisma.pickupSchedule.create({
      data: { donationId, date: new Date(date), time },
    });
    res.status(201).json(pickup);
  } catch (error) {
    res.status(400).json({ error: "Error scheduling pickup" });
  }
});

module.exports = router;
