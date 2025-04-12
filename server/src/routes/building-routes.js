import express from "express";
import { getAllBuildings, getBuilding } from "../controllers/building-controller.js";

const router = express.Router();

router.get("/get-all-buildings", getAllBuildings);
router.get("/:building", getBuilding);

export default router;