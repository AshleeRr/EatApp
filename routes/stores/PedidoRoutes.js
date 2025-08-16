import express from "express";
import {
  index,
  assignDelivery,
} from "../../controllers/Stores/PedidoController.js";

const router = express.Router();

router.get("/index/:idPedido", index);
router.post("/index/assing-delivery/:idPedido", assignDelivery);

export default router;
