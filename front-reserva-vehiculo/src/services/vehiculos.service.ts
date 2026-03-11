import { API_URL } from '../api';

export type Vehiculo = {
  pkid: number;
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
  activo: number;
};


export async function getVehiculosDisponibles() {
  const res = await fetch(`${API_URL}/vehiculos/disponibles`);

  if (!res.ok) {
    throw new Error('Error al obtener vehículos');
  }

  return res.json();
}
