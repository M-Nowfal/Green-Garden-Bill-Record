//@ts-nocheck
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dbConnect from "./config/connection.js";
import authRouter from "./routes/auth-routes.js";
import adminRouter from "./routes/admin-routes.js";
import userRouter from "./routes/user-routes.js";
import buildingRouter from "./routes/building-routes.js";

const app = express();

// Enable CORS middleware with proper settings
app.use(cors({
    origin: "https://housing-unit-bill-record.vercel.app", // Frontend URL
    credentials: true, // Allow cookies to be sent with requests
}));

// Handle preflight OPTIONS requests
app.options("*", cors({
    origin: "https://housing-unit-bill-record.vercel.app",
    credentials: true,
}));

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Additional body parser for JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Connect to the database
dbConnect();

// Define routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/building", buildingRouter);

// 404 Route Not Found handler
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
});

export default app;
