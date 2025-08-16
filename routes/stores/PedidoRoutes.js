import express from "express";
import {
  index,
  assignDelivery,
} from "../../controllers/Stores/PedidoController.js";

const router = express.Router();

router.get("/index/:id", index);
router.post("/index/assing-delivery", assignDelivery);

export default router;
