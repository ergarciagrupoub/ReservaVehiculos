const API_URL = 'http://192.168.1.19:3001';

export async function reservarVehiculo(data: {
  nombre: string;
  usuario: string;
  fsolicitud: string;
  fentrega: string;
  firma: string | null;
}) {
  const res = await fetch(`${API_URL}/reservar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Error al reservar vehículo');
  }

  return res.json();
}