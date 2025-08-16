import express from "express";
import {
  GetDirections,
  PostDirections,
} from "../../controllers/DirectionsController.js";

const router = express.Router();

router.get("/adresses", GetDirections);
router.post("/adresses", PostDirections);

export default router;
