import express from 'express';
import { GetIndex } from '../controllers/HomeController.js';

const router = express.Router();

router.get('/home', GetIndex);

export default router;