import { useEffect, useState } from 'react';
import '../styles/misreservas.css';
import { getMisReservas } from '../services/reservas.service';
import { DetalleEntregaModal } from '../components/DetalleEntregaModal';

export function MisReservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [seleccionada, setSeleccionada] = useState<any | null>(null);

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) return;

    getMisReservas(usuario).then(setReservas);
  }, []);

  return (
    <div className="reserva-page">

      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Mis reservas</h1>
            <p>Histórico de vehículos reservados</p>
          </div>
        </div>
      </section>

      {/* TABLA */}
      <section className="resultados inner">
        <div className="card">
          <table className="tabla">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Reserva</th>
                <th>Entrega</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.reserva_pkid}>
                  <td className="vehiculo-cell">
                    <img
                      src={`/cars/${r.matricula}.png`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/cars/default.png';
                      }}
                    />
                    <div>
                      <strong>{r.marca} {r.modelo}</strong>
                      <div>{r.matricula}</div>
                      <div>{r.color}</div>
                    </div>
                  </td>

                  <td>
                    {new Date(r.fecha_inicio).toLocaleString()}<br />
                    {new Date(r.fecha_fin).toLocaleString()}
                  </td>

                  <td>
                    {r.fecha_entrega
                      ? new Date(r.fecha_entrega).toLocaleString()
                      : '—'}
                  </td>

                  <td>
                    {r.fecha_entrega && (
                      <button
                        className="btn-secondary"
                        onClick={() => setSeleccionada(r)}
                      >
                        Ver entrega
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {seleccionada && (
        <DetalleEntregaModal
          reserva={seleccionada}
          onClose={() => setSeleccionada(null)}
        />
      )}
    </div>
  );
}
