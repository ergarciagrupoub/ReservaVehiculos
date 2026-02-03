const BASE_URL = import.meta.env.VITE_API_URL;

export async function api<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Error en la petición');
  }

  return res.json() as Promise<T>;
}
