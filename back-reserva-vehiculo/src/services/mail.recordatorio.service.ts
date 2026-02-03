import { enviarCorreoRecordatorioEntrega } from './mail.service localhost';

export const enviarRecordatoriosEntrega = async (reservas: any[]) => {
  for (const r of reservas) {
    await enviarCorreoRecordatorioEntrega({
      usuario: r.usuario,
      vehiculo: {
        marca: r.marca,
        modelo: r.modelo,
        matricula: r.matricula,
      },
      fechaFin: r.fecha_fin,
    });
  }
};
