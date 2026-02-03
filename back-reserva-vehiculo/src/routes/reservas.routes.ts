import { Router } from 'express';
import {
  getEstadoActualVehiculos,
  getHistoricoReservasPorUsuario,
  getReservasActivasPorUsuario,
  reservarVehiculo,
} from '../controllers/reservas.controller';

const router = Router();

router.post('/reservar', reservarVehiculo);
router.get('/activas/:usuario', getReservasActivasPorUsuario);
router.get('/historico/:usuario', getHistoricoReservasPorUsuario);
router.get('/estado', getEstadoActualVehiculos);

export default router;