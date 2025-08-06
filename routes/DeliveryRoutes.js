import express from 'express';
import { GetIndex } from '../controllers/DeliveryController.js';

const router = express.Router();

router.get('/index', GetIndex);

export default router;