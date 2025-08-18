import {
  index,
  addFavorite,
  removeFavorite,
} from "../../controllers/clients/favoritosController.js";

import express from "express";

const router = express.Router();

router.get("/home", index);
router.post("/add/favorite", addFavorite);
router.post("/delete/favorite", removeFavorite);

export default router;
