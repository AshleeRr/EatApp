import {
  index,
  StorePerfil,
  actualizarPerfil,
} from "../../controllers/stores/StoreController.js";

import express from "express";
import { saveStoreProfileImgs } from "../../utils/handlers/FileHandler.js";
const router = express.Router();

router.get("/home", index);
router.get("/mycomerce", StorePerfil);

router.post(
  "/mycomerce",
  saveStoreProfileImgs.single("imagen"),
  actualizarPerfil
);
export default router;
