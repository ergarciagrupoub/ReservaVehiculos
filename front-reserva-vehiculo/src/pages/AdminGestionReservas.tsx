import { useEffect, useState } from 'react';
import '../styles/reservar.css';
import '../styles/admin-reservas.css';

type Reserva = {
  pkid: number;
  usuario: string;
  marca: string;
  modelo: string;
  matricula: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'LIBRE' | 'OCUPADO' | 'PENDIENTE';
};

export function AdminGeReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [usuarios, setUsuarios] = useState<string[]>([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [textoFiltro, setTextoFiltro] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // 🔥 MOCK TEMPORAL
    const data: Reserva[] = [
      {
        pkid: 1,
        usuario: 'ER.GARCIA',
        marca: 'Opel',
        modelo: 'Corsa',
        matricula: '2131MJG',
        fechaInicio: '2026-01-20 09:00',
        fechaFin: '2026-01-20 18:00',
        estado: 'OCUPADO',
      },
      {
        pkid: 2,
        usuario: 'J.PEREZ',
        marca: 'Volkswagen',
        modelo: 'Taigo',
        matricula: '5678DEF',
        fechaInicio: '2026-01-22 08:00',
        fechaFin: '2026-01-22 14:00',
        estado: 'PENDIENTE',
      },
    ];

    setReservas(data);
    setUsuarios([...new Set(data.map(r => r.usuario))]);
  };

  const reservasFiltradas = reservas.filter((r) => {
    const coincideUsuario =
      !usuarioFiltro || r.usuario === usuarioFiltro;

    const texto = textoFiltro.toLowerCase();
    const coincideTexto =
      !textoFiltro ||
      r.usuario.toLowerCase().includes(texto) ||
      r.matricula.toLowerCase().includes(texto) ||
      `${r.marca} ${r.modelo}`.toLowerCase().includes(texto);

    return coincideUsuario && coincideTexto;
  });

  return (
    <div className="reserva-page">

      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Gestión de reservas</h1>
            <p>Consulta y control de todas las reservas</p>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="reserva-bar-wrapper">
        <div className="inner">
          <div className="reserva-bar filtros-admin">

            <div className="field">
              <label>Usuario</label>
              <select
                value={usuarioFiltro}
                onChange={(e) => setUsuarioFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Búsqueda</label>
              <input
                placeholder="Usuario, matrícula o vehículo"
                value={textoFiltro}
                onChange={(e) => setTextoFiltro(e.target.value)}
              />
            </div>

            <button className="btn-primary search-btn">
              Buscar
            </button>

          </div>
        </div>
      </section>

      {/* TABLA */}
      <section className="resultados inner">
        <div className="card">
          <h2>Reservas</h2>

          <table className="tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Vehículo</th>
                <th>Matrícula</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((r) => (
                <tr key={r.pkid}>
                  <td>{r.usuario}</td>
                  <td>{r.marca} {r.modelo}</td>
                  <td>{r.matricula}</td>
                  <td>{r.fechaInicio}</td>
                  <td>{r.fechaFin}</td>
                  <td>
                    <span className={`estado ${r.estado.toLowerCase()}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {reservasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    No hay resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}