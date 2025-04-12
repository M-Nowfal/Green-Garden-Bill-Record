import express from "express";
import { validate, getToken, registerNewUser, verifyRegistrationOtp } from "../controllers/auth-controller.js";

const router = express.Router();

router.get("/validate", getToken, validate);
router.post("/register", registerNewUser);
router.post("/register/verify-otp", verifyRegistrationOtp);

export default router;