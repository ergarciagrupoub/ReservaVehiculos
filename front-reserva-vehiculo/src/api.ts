const isLocalHost = (host: string) => host === 'localhost' || host === '127.0.0.1';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

const resolveBaseUrl = () => {
  const runtimeHost =
    typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'localhost';
  const apiPort = import.meta.env.VITE_API_PORT || '3001';
  const runtimeBaseUrl = `http://${isLocalHost(runtimeHost) ? 'localhost' : runtimeHost}:${apiPort}`;

  const configuredBaseUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!configuredBaseUrl) {
    return runtimeBaseUrl;
  }

  try {
    const configuredUrl = new URL(configuredBaseUrl);
    if (!isLocalHost(runtimeHost) && isLocalHost(configuredUrl.hostname)) {
      // Si la app está abierta por IP y la env apunta a localhost, prioriza el host runtime.
      return runtimeBaseUrl;
    }
  } catch {
    return runtimeBaseUrl;
  }

  return normalizeBaseUrl(configuredBaseUrl);
};

export const API_URL = resolveBaseUrl();

export async function api<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
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
