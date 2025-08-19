import {
  index,
  editForm,
  changeItbis,
} from "../../controllers/admins/ConfigController.js";

import express from "express";

const router = express.Router();

router.get("/itbis/home", index);
router.get("/itbis/update", editForm);
router.post("/itbis/update", changeItbis);

export default router;
