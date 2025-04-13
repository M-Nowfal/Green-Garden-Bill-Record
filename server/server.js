import "./src/config/env-config.js";
import express from "express";
import app from "./src/app.js";

const server = express();

server.use("/", app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
});