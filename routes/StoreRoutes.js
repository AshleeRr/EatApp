import { index, StorePerfil } from "../controllers/StoreController.js";
import express from "express";
import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/store/index", isAuth, index);

router.get("/store/me", isAuth, StorePerfil);

//categories
export default router;
