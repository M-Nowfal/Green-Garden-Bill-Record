import express from "express";
import { payWaterBill } from "../controllers/admin-controller.js";

const router = express.Router();

router.post("/waterbill", payWaterBill);

export default router;