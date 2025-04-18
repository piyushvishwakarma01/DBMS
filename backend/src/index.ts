import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Authentication routes
app.use("/auth", require("./routes/auth"));

// Donation routes
app.use("/donations", require("./routes/donations"));

// Pickup scheduling routes
app.use("/pickups", require("./routes/pickups"));

// Notification routes
app.use("/notifications", require("./routes/notifications"));

// Feedback routes
app.use("/feedback", require("./routes/feedback"));

// Profile routes
app.use("/profile", require("./routes/profile"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
