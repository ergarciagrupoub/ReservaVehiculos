import { useEffect, useState } from 'react';
import '../styles/reservar.css';
import '../styles/admin-gestion.css';
import { VehiculoModal } from '../components/VehiculoModal';

import {
  getVehiculosAdmin,
  crearVehiculo,
  modificarVehiculo,
  eliminarVehiculo,
} from '../services/adminVehiculos.service';

type Vehiculo = {
  pkid: number;
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
  activo: number;
};

type VehiculoForm = {
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
  activo: number;
};

export function AdminGeVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [modal, setModal] =
    useState<'nuevo' | 'editar' | 'eliminar' | null>(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] =
    useState<Vehiculo | null>(null);

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const data = await getVehiculosAdmin();
      setVehiculos(data);
    } catch (error) {
      console.error('Error cargando vehículos', error);
    }
  };

  return (
    <div className="reserva-page">

      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Gestión de vehículos</h1>
            <p>Alta, modificación y baja de vehículos</p>
          </div>
        </div>
      </section>

      {/* BOTÓN NUEVO */}
      <section className="inner" style={{ marginTop: 40 }}>
        <button
          className="btn-primary"
          onClick={() => {
            setVehiculoSeleccionado(null);
            setModal('nuevo');
          }}
        >
          ➕ Nuevo vehículo
        </button>
      </section>

      {/* TARJETAS */}
      <section className="resultados inner">
        <div className="vehiculos-grid">
          {vehiculos.map((v) => (
            <div key={v.pkid} className="vehiculo-card">
              <img
                src={`/cars/${v.matricula}.png`}
                onError={(e) => {
                  e.currentTarget.src = '/cars/default-car.png';
                }}
              />

              <h3>{v.marca} {v.modelo}</h3>
              <p><strong>Matrícula:</strong> {v.matricula}</p>
              <p><strong>Color:</strong> {v.color}</p>

              <div className="gestion-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setVehiculoSeleccionado(v);
                    setModal('editar');
                  }}
                >
                  ✏️ Modificar
                </button>

                <button
                  className="btn-danger"
                  onClick={() => {
                    setVehiculoSeleccionado(v);
                    setModal('eliminar');
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {modal && (
        <VehiculoModal
          tipo={modal}
          vehiculo={vehiculoSeleccionado}
          onClose={() => setModal(null)}
          onConfirm={async (data?: VehiculoForm) => {
            try {
              if (modal === 'nuevo' && data) {
                await crearVehiculo(data);
              }

              if (modal === 'editar' && vehiculoSeleccionado && data) {
                await modificarVehiculo(
                  vehiculoSeleccionado.pkid,
                  data
                );
              }

              if (modal === 'eliminar' && vehiculoSeleccionado) {
                await eliminarVehiculo(vehiculoSeleccionado.pkid);
              }

              setModal(null);
              setVehiculoSeleccionado(null);
              await cargarVehiculos();
            } catch (error) {
              console.error('Error gestionando vehículo', error);
            }
          }}
        />
      )}
    </div>
  );
}
