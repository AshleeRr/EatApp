import {
  index,
  verDetalle,
} from "../../controllers/clients/historialPedidosController.js";

import express from "express";

const router = express.Router();

router.get("/", index);
router.get("/details/:id", verDetalle);

export default router;
