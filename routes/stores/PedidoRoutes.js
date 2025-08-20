import express from "express";
import {
  index,
  assignDelivery,
} from "../../controllers/stores/PedidoController.js";

const router = express.Router();

router.get("/index/:idPedido", index);
router.get("/index/assing-delivery/:id", assignDelivery);

export default router;
