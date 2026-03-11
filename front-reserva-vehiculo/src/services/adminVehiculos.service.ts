import { API_URL } from '../api';

/* 🔹 OBTENER VEHÍCULOS */
export async function getVehiculosAdmin() {
  const res = await fetch(`${API_URL}/vehiculos`);
  if (!res.ok) throw new Error('Error al cargar vehículos');
  return res.json();
}

/* 🔹 CREAR VEHÍCULO */
export async function crearVehiculo(data: {
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
}) {
  const res = await fetch(`${API_URL}/vehiculos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al crear vehículo');
  return json;
}

/* 🔹 MODIFICAR VEHÍCULO */
export async function modificarVehiculo(
  pkid: number,
  data: {
    marca?: string;
    modelo?: string;
    color?: string;
    activo?: number;
  }
) {
  const res = await fetch(`${API_URL}/vehiculos/${pkid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al modificar vehículo');
  return json;
}

/* 🔹 ELIMINAR VEHÍCULO */
export async function eliminarVehiculo(pkid: number) {
  const res = await fetch(`${API_URL}/vehiculos/${pkid}`, {
    method: 'DELETE',
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al eliminar vehículo');
  return json;
}
