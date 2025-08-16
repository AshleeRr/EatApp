import {
  index,
  changeItbis,
} from "../../controllers/admin/ConfigController.js";

import express from "express";

const router = express.Router();

router.get("/itbis/home", index);

router.post("/itbis/update", changeItbis);

export default router;
