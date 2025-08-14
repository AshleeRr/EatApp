import { index, StorePerfil } from "../controllers/StoreController.js";
import express from "express";

const router = express.Router();

router.get("/index", index);
router.get("/mycomerce", StorePerfil);

export default router;
