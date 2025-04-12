import express from "express";
import {
    changePassword, changeUserPassword, getUser, userLogin,
    userLogOut, verifyOtpForChangePassword, verifyOtpForUserLogin,
    verifyOtpForUserLogOut
} from "../controllers/user-controller.js";

const router = express.Router();

router.get("/get-user", getUser);
router.post("/login", userLogin);
router.post("/login/vrify-otp", verifyOtpForUserLogin);
router.post("/logout", userLogOut);
router.post("/logout/verify-otp", verifyOtpForUserLogOut);
router.post("/forgot-password", changePassword);
router.post("/change-password/verify-otp", verifyOtpForChangePassword);
router.post("/change-password", changeUserPassword);

export default router;
