import { index, StorePerfil } from "../controllers/StoreController.js";
import express from "express";

const router = express.Router();

router.get("/store/index", index);

router.get("/store/me", StorePerfil);

//categories
export default router;
