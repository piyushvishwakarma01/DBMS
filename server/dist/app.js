"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const ngoRoutes = require("./routes/ngo-routes");
const volunteerRoutes = require("./routes/volunteer-routes");
const donationRoutes = require("./routes/donation-routes");
const adminRoutes = require("./routes/admin-routes");
const error_middleware_1 = require("./middleware/error-middleware");
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const donor_routes_1 = __importDefault(require("./routes/donor-routes"));
const websocket_routes_1 = __importDefault(require("./routes/websocket-routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/donors", donor_routes_1.default);
app.use("/api/ngos", ngoRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/websocket", websocket_routes_1.default);
// Error handling middleware
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
