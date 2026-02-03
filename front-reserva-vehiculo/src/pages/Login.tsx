import { useState } from 'react';
import { api } from '../api';
import '../styles/login.css';

export function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
  if (!username || !password) {
    setError('Faltan credenciales');
    return;
  }

  setError('');
  setLoading(true);

  try {
    await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const usuario = username.toUpperCase();
    sessionStorage.setItem('usuario', usuario);

    // 🔥 FORZAMOS RECARGA TOTAL
    if (usuario === 'ADMIN') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }

  } catch (e: any) {
    setError(e.message || 'Error al iniciar sesión');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page">
      <div className="login-overlay" />

      <div className="login-content">
        <h1 className="login-title">Reserva Vehículo UB</h1>

        <div className="login-card">
          <img src="/logo-ub.png" alt="Grupo UB" className="login-logo" />

          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" onClick={submit} disabled={loading}>
            {loading ? 'Entrando...' : 'LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );
}
