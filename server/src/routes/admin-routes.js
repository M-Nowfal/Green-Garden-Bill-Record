import express from "express";
import {
    editUser, payWaterBill, removeUser,
    verifyOtpForEditUser, verifyOtpForRemoveUser,
    waterBillHistory
} from "../controllers/admin-controller.js";

const router = express.Router();

router.post("/waterbill", payWaterBill);
router.get("/history/:doorNo", waterBillHistory);
router.post("/edit-user", editUser);
router.post("/edit-user/verify-otp", verifyOtpForEditUser);
router.post("/remove-user", removeUser);
router.post("/remove-user/verify-otp", verifyOtpForRemoveUser);

export default router;