import express from 'express';
import { GetIndex } from '../controllers/HomeController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import loadUser from "../middlewares/loadUserLogin.js";
const router = express.Router();

router.get('/home',isAuthenticated, loadUser, GetIndex);

export default router;