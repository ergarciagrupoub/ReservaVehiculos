const API_URL = 'http://192.168.1.19:3001';
//const API_URL = 'http://localhost:3001';

export async function entregarVehiculo(payload: {
  vehiculoPkid: number;
  usuario: string;
  combustibleEstado: string;
  zonaAparcado: string;
  problemas?: string | null;
}) {
  const res = await fetch(`${API_URL}/entrega/entregar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al entregar vehículo');
  }

  return res.json();
}
