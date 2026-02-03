import { useEffect, useState } from 'react';
import '../styles/entrega.css';
import { getReservasActivasPorUsuario } from '../services/reservas.service';
import { EntregaVehiculoModal } from '../components/EntregaVehiculoModal';

type ReservaActiva = {
  reserva_pkid: number;
  vehiculo_pkid: number;
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
  fecha_inicio: string;
  fecha_fin: string;
};

export function EntregarVehiculo() {
  const [reservas, setReservas] = useState<ReservaActiva[]>([]);
  const [seleccionada, setSeleccionada] = useState<ReservaActiva | null>(null);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const usuario = sessionStorage.getItem('usuario');
      if (!usuario) return;

      const data = await getReservasActivasPorUsuario(usuario);
      setReservas(data);
    } catch {
      setError('No se pudieron cargar tus reservas activas');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="reserva-page">
      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Entregar vehículo</h1>
            <p>Finaliza tu reserva de forma rápida y sencilla</p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="resultados inner">
        <h2>Vehículos a entregar</h2>

        {error && <p className="entrega-error">{error}</p>}

        {reservas.length === 0 ? (
          <p>No tienes vehículos pendientes de entrega</p>
        ) : (
          <div className="vehiculos-grid">
            {reservas.map((r) => (
              <div key={r.reserva_pkid} className="vehiculo-card">
                <img
                  src={`/cars/${r.matricula}.png`}
                  alt={`${r.marca} ${r.modelo}`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/cars/default.png';
                  }}
                />

                <h3>{r.marca} {r.modelo}</h3>
                <p>Matrícula: {r.matricula}</p>
                <p>
                  Desde: {new Date(r.fecha_inicio).toLocaleString()}<br />
                  Hasta: {new Date(r.fecha_fin).toLocaleString()}
                </p>

                <button className="btn-primary" onClick={() => setSeleccionada(r)}>
                  Entregar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      {seleccionada && (
        <EntregaVehiculoModal
          reserva={seleccionada}
          onClose={() => {
            setSeleccionada(null);
            cargar(); // refresca lista tras entregar
          }}
        />
      )}
    </div>
  );
}
