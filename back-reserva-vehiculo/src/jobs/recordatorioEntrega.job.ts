import cron from 'node-cron';
import { getDB } from '../config/database';
import { enviarCorreoRecordatorioEntrega } from '../services/mail.service localhost';

export const iniciarJobRecordatorioEntrega = () => {
  
  //cron.schedule('0 10,22 * * *',async () => {
    cron.schedule('*/1 * * * *', async () => {
    try {
      console.log('⏰ Buscando vehículos pendientes de entrega...');

      const db = getDB();

      const result = await db.request().query(`
        SELECT
          r.pkid,
          r.usuario,
          r.fecha_fin,
          v.marca,
          v.modelo,
          v.matricula
        FROM UbReservaVehiculos r
        INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
        WHERE r.estado = 'OCUPADO'
          AND r.fecha_fin <= DATEADD(HOUR, 1, GETDATE())
      `);

      for (const r of result.recordset) {
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

    } catch (error) {
      console.error('❌ Error en job de recordatorio:', error);
    }
  });
};
