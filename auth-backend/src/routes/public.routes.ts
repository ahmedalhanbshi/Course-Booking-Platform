import { Router } from 'express';
import trainerController from '../controllers/trainer.controller';

const router = Router();

// Publicly accessible halls endpoint
router.get('/halls', trainerController.getHalls);
router.get('/halls/:hallId/availability', trainerController.getHallAvailability);

export default router;
