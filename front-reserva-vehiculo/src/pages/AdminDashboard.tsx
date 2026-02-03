import '../styles/admin-dashboard.css';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard-page">

      {/* HERO */}
      <section className="admin-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Panel de administración</h1>
            <p>Gestión avanzada de vehículos y reservas</p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="admin-content inner">
        <div className="admin-card">

          <div className="admin-grid">

            {/* ESTADO VEHÍCULOS */}
            <div
              className="admin-option"
              onClick={() => navigate('/admin/eVehiculos')}
            >
              {/*<img src="/icons/estado-vehiculos.png" alt="Estado vehículos" />*/}
              <h3>Estado de vehículos</h3>
              <p>Consulta disponibilidad y uso actual</p>
            </div>

            {/* GESTIÓN VEHÍCULOS */}
            <div
              className="admin-option"
              onClick={() => navigate('/admin/gVehiculos')}
            >
              {/*<img src="/icons/estado-vehiculos.png" alt="Estado vehículos" />*/}
              <h3>Gestión de vehículos</h3>
              <p>Alta, edición y control de flota</p>
            </div>

            {/* GESTIÓN RESERVAS */}
            <div
              className="admin-option"
              onClick={() => navigate('/admin/gReservas')}
            >
              {/*<img src="/icons/estado-vehiculos.png" alt="Estado vehículos" />*/}
              <h3>Gestión de reservas</h3>
              <p>Aprobar, denegar y filtrar reservas</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
