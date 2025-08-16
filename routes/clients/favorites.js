import {
  index,
  addFavorite,
  removeFavorite,
} from "../../controllers/clients/favoritosController.js";

import express from "express";

const router = express.Router();

router.get("/home", index);
router.post("/add/favorite/:idUsuario/:idComercio", addFavorite);
router.post("/delete/favorite/:idUsuario/:idComercio", removeFavorite);

export default router;
