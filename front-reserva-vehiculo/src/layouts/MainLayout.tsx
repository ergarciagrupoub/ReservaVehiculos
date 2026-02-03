import { NavLink, Outlet } from 'react-router-dom';
import '../styles/menu.css';

export function MainLayout() {

  const usuario = sessionStorage.getItem('usuario') || '';
  const esAdmin = usuario === 'ADMIN';

  const logout = () => {
  sessionStorage.clear();
  window.location.href = '/login';
  };


  return (
    <>
      <nav className="main-menu">
        <div className="menu-left">
          <span className="menu-logo">UB Vehiculos</span>

          {!esAdmin && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/reservar">Reservar</NavLink>
              <NavLink to="/entregar">Entregar</NavLink>
              <NavLink to="/mis-reservas">Mis reservas</NavLink>
            </>
          )}

          {esAdmin && (
            <>
              <NavLink to="/admin">AdminDashboard</NavLink>
              <NavLink to="/admin/eVehiculos">Estado vehículos</NavLink>
              <NavLink to="/admin/gVehiculos">Gestión vehículos</NavLink>
              <NavLink to="/admin/gReservas">Reservas</NavLink>
            </>
          )}
        </div>

        <div className="menu-right">
          <span className="menu-user">{usuario}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
