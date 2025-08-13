import { index } from "../controllers/StoreController.js";
import express from "express";
import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/store/index", isAuth, index);

//categories
export default router;
