import express from 'express';
import { generateBill } from '../controllers/billing.controller';

const router = express.Router();

router.post('/generate-bill', generateBill);

export default router;
