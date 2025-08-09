import express from 'express';
import { GetIndex } from '../controllers/HomeController.js';
import isAuthLogin from "../middlewares/isAuthLogIn.js"
const router = express.Router();

router.get('/home',isAuthLogin, GetIndex);

export default router;