import {
  index,
  StorePerfil,
} from "../../controllers/Stores/StoreController.js";

import express from "express";

const router = express.Router();

router.get("/home", index);
router.get("/mycomerce", StorePerfil);

export default router;
