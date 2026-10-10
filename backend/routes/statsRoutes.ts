/**
 * Statistics and Utilities Routes
 */

import { Router } from 'express';
import { getDashboardStats, resetSampleData } from '../controllers/statsController.js';

const router = Router();

router.get('/', getDashboardStats);
router.post('/reset', resetSampleData);

export default router;
