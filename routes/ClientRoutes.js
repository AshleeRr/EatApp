import express from "express";
import {
  GetProfile,
  GetDirections,
  GetHome,
} from "../controllers/ClientController.js";

const router = express.Router();

router.get("/home", GetHome);
router.get("/profile", GetProfile);
router.get("/directions", GetDirections);

export default router;
