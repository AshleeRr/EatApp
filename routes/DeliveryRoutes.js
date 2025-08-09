import express from 'express';
import { GetIndex } from '../controllers/DeliveryController.js';
import isAuth from "../middlewares/isAuthenticated.js"
const router = express.Router();

//router.get('/home',isAuth, GetIndex);

export default router;