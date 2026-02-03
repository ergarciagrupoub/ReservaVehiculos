import { Router } from 'express';
import { entregarVehiculo } from '../controllers/entrega.controller';

const router = Router();

router.post('/entregar', entregarVehiculo);

export default router;