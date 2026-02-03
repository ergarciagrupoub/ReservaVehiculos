import { Router } from 'express';
import {
  getEstadoActualVehiculos,
  getHistoricoReservasGlobal,
  getHistoricoReservasPorUsuario,
  getReservasActivasPorUsuario,
  reservarVehiculo,
} from '../controllers/reservas.controller';

const router = Router();

router.post('/reservar', reservarVehiculo);
router.get('/activas/:usuario', getReservasActivasPorUsuario);
router.get('/historico/:usuario', getHistoricoReservasPorUsuario);
router.get('/estado', getEstadoActualVehiculos);
router.get('/historico-global', getHistoricoReservasGlobal);


export default router;