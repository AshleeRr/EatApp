import express from "express";
import { index } from "../controllers/PedidoController.js";
import isAuth from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/index/:id", index);

export default router;
