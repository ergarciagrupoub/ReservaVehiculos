import { API_URL } from '../api';

export type EstadoVehiculo = {
  vehiculoPkid: number;
  marca: string;
  modelo: string;
  matricula: string;
  usuario: string;
  detalle: string | null;
  fecha: string;
  estado: 'LIBRE' | 'PENDIENTE' | 'OCUPADO' | 'FINALIZADO';
};


export async function getEstadoVehiculos(): Promise<EstadoVehiculo[]> {
  const res = await fetch(`${API_URL}/reservas/estado`);

  if (!res.ok) {
    throw new Error('Error al obtener el estado de los vehículos');
  }

  return res.json();
}
