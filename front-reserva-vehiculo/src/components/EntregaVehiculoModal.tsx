import { useState } from 'react';
import '../styles/modal.css';
import { entregarVehiculo } from '../services/entrega.service';

type Props = {
  reserva: {
    vehiculo_pkid: number;
    marca: string;
    modelo: string;
    matricula: string;
  };
  onClose: () => void;
};

export function EntregaVehiculoModal({ reserva, onClose }: Props) {
  const [paso, setPaso] = useState(1);
  const [combustible, setCombustible] = useState('');
  const [zona, setZona] = useState('');
  const [problemas, setProblemas] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const confirmar = async () => {
    try {
        setError('');
        setLoading(true);

        const usuario = sessionStorage.getItem('usuario');
        if (!usuario) {
        setError('Usuario no identificado');
        return;
        }

        await entregarVehiculo({
        vehiculoPkid: reserva.vehiculo_pkid,
        usuario,
        combustibleEstado: combustible,
        zonaAparcado: zona,
        problemas: problemas || null,
        });

        onClose();
    } catch (e: any) {
        setError(e.message || 'Error al registrar la entrega');
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Entregar vehículo</h2>
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-info">
          <strong>{reserva.marca} {reserva.modelo}</strong>
          Matrícula: <strong>{reserva.matricula}</strong>
        </div>

        {error && <p className="modal-error">{error}</p>}

        {paso === 1 && (
          <>
            <p>¿Cuánta gasolina le queda al vehículo?</p>
            <select value={combustible} onChange={(e) => setCombustible(e.target.value)}>
              <option value="">Selecciona</option>
              <option value="LLENO">Lleno</option>
              <option value="3/4">3/4</option>
              <option value="1/2">1/2</option>
              <option value="1/4">1/4</option>
              <option value="RESERVA">Reserva</option>
            </select>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={onClose}>Cancelar</button>
              <button className="modal-btn confirm" disabled={!combustible} onClick={() => setPaso(2)}>
                Siguiente
              </button>
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <p>¿En qué zona se encuentra aparcado?</p>
            <select value={zona} onChange={(e) => setZona(e.target.value)}>
              <option value="">Selecciona</option>
              <option value="ZONA FRONTAL">Zona frontal</option>
              <option value="ZONA TRASERA">Zona trasera</option>
              <option value="ZONA INTERIOR">Zona interior</option>
            </select>

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setPaso(1)}>Atrás</button>
              <button className="modal-btn confirm" disabled={!zona} onClick={() => setPaso(3)}>
                Siguiente
              </button>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <p>¿Ha encontrado algún problema en el vehículo?</p>
            <textarea
              placeholder="Opcional"
              value={problemas}
              onChange={(e) => setProblemas(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setPaso(2)}>Atrás</button>
              <button className="modal-btn confirm" onClick={confirmar} disabled={loading}>
                {loading ? 'Enviando...' : 'Confirmar entrega'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
