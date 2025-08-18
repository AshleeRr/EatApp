import {
  index,
  createForm,
  create,
  editForm,
  edit,
  deleteA,
} from "../../controllers/admins/StoresTypesControllers.js";

import express from "express";

//saver imgs
import { saveStoresTypesIcon } from "../../utils/handlers/FileHandler.js";

const router = express.Router();

router.get("/home", index);

router.get("/create", createForm);
router.post("/create", saveStoresTypesIcon.single("logo"), create);

router.get("/edit/:id", editForm);
router.post("/edit/:id", saveStoresTypesIcon.single("logo"), edit);

router.get("/delete/:id", deleteA);

export default router;
