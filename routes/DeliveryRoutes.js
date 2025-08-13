import express from 'express';
import { GetHome } from '../controllers/DeliveryController.js';
import isAuth from "../middlewares/isAuthenticated.js"
const router = express.Router();

router.get('/home', isAuth, GetHome);

export default router;