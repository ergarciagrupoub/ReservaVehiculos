import '../styles/modal.css';

export function ConfirmarReservaModal({
  vehiculo,
  fechaInicio,
  horaInicio,
  fechaFin,
  horaFin,
  onCancel,
  onConfirm,
}: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Confirmar reserva</h2>

        <p>
          ¿Deseas reservar el vehículo<br />
          <strong>{vehiculo.marca} {vehiculo.modelo}</strong><br />
          Matrícula <strong>{vehiculo.matricula}</strong>
        </p>

        <p>
          Desde {fechaInicio} {horaInicio}<br />
          Hasta {fechaFin} {horaFin}
        </p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
