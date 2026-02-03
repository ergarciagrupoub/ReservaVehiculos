import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Reservar } from './pages/Reservar';
import { EntregarVehiculo } from './pages/EntregarVehiculo';
import { MisReservas } from './pages/MisReservas';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AdminEsVehiculos } from './pages/AdminEstadoVehiculos.tsx';
import { AdminGeReservas } from './pages/AdminGestionReservas.tsx';
import { AdminGeVehiculos } from './pages/AdminGestionVehiculos.tsx';
import { MainLayout } from './layouts/MainLayout';

export default function App() {
  const usuario = sessionStorage.getItem('usuario');

  if (!usuario) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const isAdmin = usuario === 'ADMIN';

  return (
    <Routes>

      {/* USUARIOS */}
      {!isAdmin && (
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/entregar" element={<EntregarVehiculo />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}

      {/* ADMIN */}
      {isAdmin && (
        <Route element={<MainLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/eVehiculos" element={<AdminEsVehiculos />} />
          <Route path="/admin/gReservas" element={<AdminGeReservas />} />
          <Route path="/admin/gVehiculos" element={<AdminGeVehiculos />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>
      )}

    </Routes>
  );
}
