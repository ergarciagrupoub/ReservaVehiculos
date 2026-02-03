import { useState } from 'react';
import '../styles/reservar.css';
import { getVehiculosDisponibles, type Vehiculo } from '../services/vehiculos.service';
import { reservarVehiculo } from '../services/reservas.service';
import { ConfirmarReservaModal } from '../components/ConfirmarReservaModal';

export function Reservar() {
  const [motivo, setMotivo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [loadingBuscar, setLoadingBuscar] = useState(false);
  const [loadingReservaPkid, setLoadingReservaPkid] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [vehiculoConfirmar, setVehiculoConfirmar] = useState<Vehiculo | null>(null);

  const buscarVehiculos = async () => {
    setError('');
    setMensaje('');
    setVehiculos([]);
    setMostrarResultados(false);

    if (!motivo || !fechaInicio || !horaInicio || !fechaFin || !horaFin) {
      setError('Completa todos los campos');
      return;
    }

    const inicio = new Date(`${fechaInicio}T${horaInicio}`);
    const fin = new Date(`${fechaFin}T${horaFin}`);
    if (fin <= inicio) {
      setError('La fecha/hora de devolución debe ser posterior');
      return;
    }

    setLoadingBuscar(true);
    try {
      const data = await getVehiculosDisponibles();
      setVehiculos(data);
      setMostrarResultados(true);
      if (data.length === 0) setMensaje('No hay vehículos disponibles');
    } catch (e: any) {
      setError(e?.message || 'Error al buscar vehículos');
    } finally {
      setLoadingBuscar(false);
    }
  };

      const reservarSeleccionado = async (v: Vehiculo) => {
      setError('');
      setMensaje('');

      const usuario = sessionStorage.getItem('usuario');
      if (!usuario) {
        setError('Usuario no identificado');
        return;
      }

      setLoadingReservaPkid(v.pkid);

      try {
        await reservarVehiculo({
          vehiculoPkid: v.pkid,
          usuario,
          motivo,
          fechaInicio: `${fechaInicio}T${horaInicio}`,
          fechaFin: `${fechaFin}T${horaFin}`,
        });

        setMensaje('Reserva enviada correctamente. Pendiente de aprobación.');

        // 🔥 CLAVE: volver a consultar vehículos
        const data = await getVehiculosDisponibles();
        setVehiculos(data);

      } catch (e: any) {
        setError(e?.message || 'Error al reservar vehículo');
      } finally {
        setLoadingReservaPkid(null);
      }
    };

  return (
    <div className="reserva-page">

      {/* HERO */}
      <section className="reserva-hero">
        <div className="hero-overlay" />
        <div className="hero-inner inner">
          <div className="hero-content">
            <h1>Reserva tu vehículo</h1>
            <p>Comodidad, control y movilidad para tu día a día</p>
          </div>
        </div>
      </section>

      {/* BARRA */}
      <section className="reserva-bar-wrapper">
        <div className="inner">
          <div className="reserva-bar">

            <div className="field small">
              <label>Lugar / Motivo</label>
              <input
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Fecha recogida</label>
              <div className="datetime">
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Fecha devolución</label>
              <div className="datetime">
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
              </div>
            </div>

            <button
              className="btn-primary search-btn"
              onClick={buscarVehiculos}
              disabled={loadingBuscar}
            >
              {loadingBuscar ? 'Buscando...' : 'Mostrar vehículos'}
            </button>

          </div>
        </div>
      </section>

      {/* MENSAJES */}
      <section className="inner" style={{ marginTop: 18 }}>
        {error && <div className="login-error">{error}</div>}
        {mensaje && <div style={{ textAlign: 'center' }}>{mensaje}</div>}
      </section>

      {/* RESULTADOS */}
      {mostrarResultados && (
        <section className="resultados inner">
          <h2>Vehículos</h2>

          <div className="vehiculos-grid">
            {vehiculos.map((v) => {
                const pendiente = v.activo === 2;
                return (
                  <div
                    key={v.pkid}
                    className={`vehiculo-card ${pendiente ? 'pendiente' : ''}`}
                  >
                    <img
                      src={`/cars/${v.matricula}.png`}
                      onError={(e) => {
                        e.currentTarget.src = '/cars/default-car.png';
                      }}
                    />

                    <h3>{v.marca} {v.modelo}</h3>
                    <p>Matrícula: {v.matricula}</p>
                    <p>Color: {v.color}</p>

                    <button
                      className="btn-primary"
                      disabled={pendiente || loadingReservaPkid === v.pkid}
                      onClick={() => setVehiculoConfirmar(v)}
                    >
                      {pendiente ? 'Pendiente de aprobación' : 'Reservar'}
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      )}
      {vehiculoConfirmar && (
        <ConfirmarReservaModal
          vehiculo={vehiculoConfirmar}
          fechaInicio={fechaInicio}
          horaInicio={horaInicio}
          fechaFin={fechaFin}
          horaFin={horaFin}
          onCancel={() => setVehiculoConfirmar(null)}
          onConfirm={async () => {
            await reservarSeleccionado(vehiculoConfirmar);
            setVehiculoConfirmar(null);
          }}
        />
      )}

    </div>
  );
}