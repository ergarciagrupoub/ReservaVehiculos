import { API_URL } from '../api';

export async function entregarVehiculo(payload: {
  vehiculoPkid: number;
  usuario: string;
  combustibleEstado: string;
  zonaAparcado: string;
  autonomiaDepositoKm: number;
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
