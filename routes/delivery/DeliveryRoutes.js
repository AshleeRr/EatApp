import express from "express";
import { GetIndex , GetOrderDetails, GetProfile, PostProfile, completeOrder} from '../../controllers/delivery/DeliveryController.js';
import { saveProfilePhoto } from "../../utils/handlers/FileHandler.js";

const router = express.Router();

router.get('/home', GetIndex);

router.get('/orders/:id/details', GetOrderDetails);

router.get("/profile", GetProfile);
router.post("/profile", saveProfilePhoto.single("ProfilePhoto"), PostProfile);

router.post("/orders/:id/complete", completeOrder );

export default router;
