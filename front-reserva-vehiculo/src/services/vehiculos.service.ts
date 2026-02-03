const API_URL = 'http://192.168.1.19:3001';
//const API_URL = 'http://localhost:3001';

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