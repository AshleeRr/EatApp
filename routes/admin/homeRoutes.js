import {
  index,
  UsersListByRole,
  changeStatus,
} from "../../controllers/admins/IndexController.js";
import express from "express";

const router = express.Router();

router.get("/home", index);
router.post("/changeUser/:id/status", changeStatus);

// manejo de listas de usuarios
router.get("/clients", UsersListByRole("client", "Clients List"));
router.get("/stores", UsersListByRole("store", "Stores List"));
router.get("/deliveries", UsersListByRole("delivery", "Deliveries List"));

export default router;
