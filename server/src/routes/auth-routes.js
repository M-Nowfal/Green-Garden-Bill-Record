import express from "express";
import { validate, getToken, registerNewUser, verifyRegistrationOtp } from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/validate", getToken, validate);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register", registerNewUser);

export default router;