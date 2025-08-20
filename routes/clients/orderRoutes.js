import {
  GenerateFacture,
  procesarPedido,
  confirmacion,
} from "../../controllers/clients/orderController.js";

import express from "express";

const router = express.Router();

router.get("/facturar", GenerateFacture);
router.post("/proccess-order", procesarPedido);
router.get("/confirmation/:id", confirmacion);

export default router;
