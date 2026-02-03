import { Router } from 'express';
import { actualizarVehiculo, crearVehiculo, eliminarVehiculo, getVehiculos, getVehiculosDisponibles} from '../controllers/vehiculos.controller';

const router = Router();

router.get('/disponibles', getVehiculosDisponibles);
router.get('/', getVehiculos);
router.post('/', crearVehiculo);
router.put('/:pkid', actualizarVehiculo);
router.delete('/:pkid', eliminarVehiculo);

export default router;