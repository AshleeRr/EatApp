import express from "express";
import {
  GetProfile,
  GetHome,
  GetStoresList,
  PostProfile,
} from "../../controllers/clients/ClientController.js";

import { saveProfilePhoto } from "../../utils/handlers/FileHandler.js";

const router = express.Router();

router.get("/storesList", GetStoresList);
router.get("/home", GetHome);

router.get("/profile", GetProfile);
router.post("/profile", saveProfilePhoto.single("ProfilePhoto"), PostProfile);

export default router;
