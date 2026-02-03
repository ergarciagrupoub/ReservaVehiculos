import { useEffect, useState } from 'react';
import '../styles/reservar.css';
import '../styles/admin-estado.css';

import { getEstadoVehiculos } from '../services/cargaVehiculos.service';
import type { EstadoVehiculo } from '../services/cargaVehiculos.service';

export function AdminEsVehiculos() {
  const [vehiculos, setVehiculos] = useState<EstadoVehiculo[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] =
    useState<EstadoVehiculo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getEstadoVehiculos();
      setVehiculos(data);
    } catch (error) {
      console.error('Error cargando estado de vehículos', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reserva-page">

      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Estado de vehículos</h1>
            <p>Último movimiento registrado por vehículo</p>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="resultados inner">

        {loading && (
          <p style={{ textAlign: 'center' }}>
            Cargando estado de vehículos…
          </p>
        )}

        {!loading && (
          <div className="vehiculos-grid">
            {vehiculos.map((v) => (
              <div
                key={v.vehiculoPkid}
                className={`vehiculo-card estado-${v.estado.toLowerCase()}`}
              >
                <img
                  src={`/cars/${v.matricula}.png`}
                  alt={v.marca}
                  onError={(e) => {
                    e.currentTarget.src = '/cars/default-car.png';
                  }}
                />

                <h3>{v.marca} {v.modelo}</h3>
                <p><strong>Matrícula:</strong> {v.matricula}</p>
                <p><strong>Último usuario:</strong> {v.usuario}</p>

                <span className={`estado-badge ${v.estado.toLowerCase()}`}>
                  {v.estado}
                </span>

                <button
                  className="btn-secondary"
                  onClick={() => setVehiculoSeleccionado(v)}
                >
                  Ver detalle
                </button>
              </div>
            ))}

            {vehiculos.length === 0 && (
              <p style={{ textAlign: 'center' }}>
                No hay vehículos para mostrar
              </p>
            )}
          </div>
        )}

      </section>

      {/* MODAL */}
      {vehiculoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Último movimiento</h2>

            <p>
              <strong>Vehículo:</strong><br />
              {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}<br />
              Matrícula {vehiculoSeleccionado.matricula}
            </p>

            <div className="log-detalle">
              <p>
                <strong>Usuario:</strong>{' '}
                {vehiculoSeleccionado.usuario}
              </p>

              <p>
                <strong>Detalle:</strong><br />
                {vehiculoSeleccionado.detalle || '—'}
              </p>

              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(
                  vehiculoSeleccionado.fecha
                ).toLocaleString()}
              </p>

              <p>
                <strong>Estado:</strong>{' '}
                {vehiculoSeleccionado.estado}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setVehiculoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
