import '../styles/modal.css';

export function DetalleEntregaModal({ reserva, onClose }: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Detalle de entrega</h3>

        <p><strong>Combustible:</strong> {reserva.combustible_estado}</p>
        <p><strong>Autonomía depósito:</strong> {reserva.autonomia_deposito_km ?? 'NO INDICADA'} {reserva.autonomia_deposito_km != null ? 'km' : ''}</p>
        <p><strong>Zona aparcado:</strong> {reserva.zona_aparcado}</p>
        <p><strong>Problemas:</strong> {reserva.problemas || 'NINGUNO'}</p>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
