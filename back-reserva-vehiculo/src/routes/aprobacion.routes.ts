import { Router } from 'express';
import {
  confirmarReserva,
  denegarReserva,
} from '../controllers/aprobacion.controller';

const router = Router();

router.get('/confirmar', confirmarReserva);
router.get('/denegar', denegarReserva);

export default router;