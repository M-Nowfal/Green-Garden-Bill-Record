//@ts-nocheck
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dbConnect from "./config/connection.js";
import authRouter from "./routes/auth-routes.js";
import adminRouter from "./routes/admin-routes.js";
import userRouter from "./routes/user-routes.js";
import buildingRouter from "./routes/building-routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/building", buildingRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: `Internal Server Error: ${err.message}` });
});

export default app;
