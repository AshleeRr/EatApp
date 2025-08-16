import express from "express";
import {
  GetAdresses,
  GetCreateAdress,
  PostCreateAdress,
  GetEditAdress,
  PostEditAdress,
  Delete,
} from "../../controllers/clients/DirectionsController.js";

const router = express.Router();

router.get("/home", GetAdresses);

router.get("/create", GetCreateAdress);
router.post("/create", PostCreateAdress);

router.get("/edit/:adressId", GetEditAdress);
router.post("/edit", PostEditAdress);

router.post("/delete", Delete);

export default router;
