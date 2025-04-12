import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const dbConnect = async () => {
    try {
        if (!DB_URL)
            throw new Error("DB_URL not set properly");
        await mongoose.connect(DB_URL);
        console.log("Data Base Connected Successfully");
    } catch (err) {
        console.log("Data Base Connection Failed:", err.message);
    }
} 

export default dbConnect;