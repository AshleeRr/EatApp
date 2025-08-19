import {
  index,
  changeStatus,
  ClientsList,
  deliveriesList,
  storesList,
} from "../../controllers/admins/IndexController.js";
import express from "express";

const router = express.Router();

router.get("/home", index);
router.get("/changeUser-status/:id", changeStatus);

// manejo de listas de usuarios
router.get("/clients", ClientsList);
router.get("/stores", storesList);
router.get("/deliveries", deliveriesList);

export default router;
