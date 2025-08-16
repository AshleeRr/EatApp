import {
  GenerateFacture,
  selectDirection,
  procesarPedido,
  confirmacion,
} from "../../controllers/clients/orderController.js";

import express from "express";

const router = express.Router();

router.get("/facturar", GenerateFacture);
router.post("/select-direction/:direccionId", selectDirection);
router.get("/proccess-order", procesarPedido);
router.get("/confirmation", confirmacion);

export default router;
