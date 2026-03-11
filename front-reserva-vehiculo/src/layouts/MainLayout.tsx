import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../styles/menu.css';

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const usuario = sessionStorage.getItem('usuario') || '';
  const esAdmin = usuario === 'ADMIN';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`main-menu ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="menu-left">
          <span className="menu-logo">UB Vehiculos</span>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Abrir o cerrar menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="main-nav-links"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="menu-links" id="main-nav-links">
            {!esAdmin && (
              <>
                <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                <NavLink to="/reservar" onClick={closeMenu}>Reservar</NavLink>
                <NavLink to="/entregar" onClick={closeMenu}>Entregar</NavLink>
                <NavLink to="/mis-reservas" onClick={closeMenu}>Mis reservas</NavLink>
              </>
            )}

            {esAdmin && (
              <>
                <NavLink to="/admin" onClick={closeMenu}>AdminDashboard</NavLink>
                <NavLink to="/admin/eVehiculos" onClick={closeMenu}>Estado vehículos</NavLink>
                <NavLink to="/admin/gVehiculos" onClick={closeMenu}>Gestión vehículos</NavLink>
                <NavLink to="/admin/gReservas" onClick={closeMenu}>Reservas</NavLink>
              </>
            )}
          </div>
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
