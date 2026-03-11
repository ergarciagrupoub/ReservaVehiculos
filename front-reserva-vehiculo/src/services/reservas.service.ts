import { API_URL } from '../api';

/* 🔹 RESERVAR VEHÍCULO */
export async function reservarVehiculo(data: {
  vehiculoPkid: number;
  usuario: string;
  motivo: string;
  fechaInicio: string;
  fechaFin: string;
}) {
  const res = await fetch(`${API_URL}/reservas/reservar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Error al reservar');
  }

  return json;
}

export async function getVehiculosDisponibles(params: {
  fechaInicio: string;
  fechaFin: string;
}) {
  const res = await fetch(`${API_URL}/vehiculos/disponibles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  return res.json();
}

/* 🔹 OBTENER RESERVAS ACTIVAS POR USUARIO */

export async function getReservasActivasPorUsuario(usuario: string) {
  const res = await fetch(`${API_URL}/reservas/activas/${usuario}`);

  if (!res.ok) {
    throw new Error('Error al obtener reservas activas');
  }

  return res.json();
}

export async function getMisReservas(usuario: string) {
  const res = await fetch(`${API_URL}/reservas/historico/${usuario}`);

  if (!res.ok) {
    throw new Error('Error al cargar reservas');
  }

  return res.json();
}
