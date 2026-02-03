import '../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

import reservarIcon from '/icons/reservar.png';
import entregarIcon from '/icons/entregar.png';
import misReservasIcon from '/icons/misreservas.png';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Panel de reservas</h1>
            <p>Gestiona tus vehículos de forma rápida y sencilla</p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="dashboard-content inner">
        <div className="dashboard-card">

          <div className="dashboard-grid">

            <div
              className="dashboard-option"
              onClick={() => navigate('/reservar')}
            >
              <img src={reservarIcon} alt="Reservar vehículo" />
              <h3>Reservar vehículo</h3>
              <p>Consulta y reserva vehículos disponibles</p>
            </div>

            <div
              className="dashboard-option"
              onClick={() => navigate('/entregar')}
            >
              <img src={entregarIcon} alt="Entregar vehículo" />
              <h3>Entregar vehículo</h3>
              <p>Finaliza una reserva activa</p>
            </div>

            <div
              className="dashboard-option"
              onClick={() => navigate('/mis-reservas')}
            >
              <img src={misReservasIcon} alt="Mis reservas" />
              <h3>Mis reservas</h3>
              <p>Consulta tu histórico de reservas</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
