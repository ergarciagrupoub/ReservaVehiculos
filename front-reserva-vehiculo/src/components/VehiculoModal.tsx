import { useEffect, useState } from 'react';
import '../styles/modal.css';

type VehiculoForm = {
  marca: string;
  modelo: string;
  color: string;
  matricula: string;
  activo: number;
};

type Props = {
  tipo: 'nuevo' | 'editar' | 'eliminar';
  vehiculo: any;
  onClose: () => void;
  onConfirm: (data?: VehiculoForm) => void;
};

export function VehiculoModal({
  tipo,
  vehiculo,
  onClose,
  onConfirm,
}: Props) {
  const [form, setForm] = useState<VehiculoForm>({
    marca: '',
    modelo: '',
    color: '',
    matricula: '',
    activo: 1,
  });

  useEffect(() => {
    if (vehiculo && (tipo === 'editar' || tipo === 'nuevo')) {
      setForm({
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        color: vehiculo.color || '',
        matricula: vehiculo.matricula || '',
        activo: vehiculo.activo ?? 1,
      });
    }
  }, [vehiculo, tipo]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* NUEVO */}
        {tipo === 'nuevo' && (
          <>
            <h2>Nuevo vehículo</h2>

            <input
              placeholder="Marca"
              value={form.marca}
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
            />

            <input
              placeholder="Modelo"
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            />

            <input
              placeholder="Color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />

            <input
              placeholder="Matrícula"
              value={form.matricula}
              onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => onConfirm(form)}
              >
                Guardar
              </button>
            </div>
          </>
        )}

        {/* EDITAR */}
        {tipo === 'editar' && (
          <>
            <h2>Modificar vehículo</h2>

            <input
              value={form.marca}
              onChange={(e) => setForm({ ...form, marca: e.target.value })}
            />

            <input
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            />

            <input
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />

            <input value={form.matricula} disabled />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => onConfirm(form)}
              >
                Guardar cambios
              </button>
            </div>
          </>
        )}

        {/* ELIMINAR */}
        {tipo === 'eliminar' && (
          <>
            <h2>Eliminar vehículo</h2>

            <p>
              ¿Seguro que deseas eliminar el vehículo<br />
              <strong>
                {vehiculo?.marca} {vehiculo?.modelo}
              </strong><br />
              Matrícula {vehiculo?.matricula}?
            </p>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-danger"
                onClick={() => onConfirm()}
              >
                Eliminar
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
