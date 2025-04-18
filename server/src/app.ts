import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";

// Import routes
const ngoRoutes = require("./routes/ngo-routes");
const volunteerRoutes = require("./routes/volunteer-routes");
const donationRoutes = require("./routes/donation-routes");
const adminRoutes = require("./routes/admin-routes");

import { errorMiddleware } from "./middleware/error-middleware";
import authRoutes from "./routes/auth-routes";
import donorRoutes from "./routes/donor-routes";
import websocketRoutes from "./routes/websocket-routes";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/websocket", websocketRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
