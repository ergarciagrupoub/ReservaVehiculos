"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarJobRecordatorioEntrega = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const database_1 = require("../config/database");
const mail_service_server_1 = require("../services/mail.service server");
const iniciarJobRecordatorioEntrega = () => {
    node_cron_1.default.schedule('0 10,22 * * *', async () => {
        try {
            console.log('⏰ Buscando vehículos pendientes de entrega...');
            const db = (0, database_1.getDB)();
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
                await (0, mail_service_server_1.enviarCorreoRecordatorioEntrega)({
                    usuario: r.usuario,
                    vehiculo: {
                        marca: r.marca,
                        modelo: r.modelo,
                        matricula: r.matricula,
                    },
                    fechaFin: r.fecha_fin,
                });
            }
        }
        catch (error) {
            console.error('❌ Error en job de recordatorio:', error);
        }
    });
};
exports.iniciarJobRecordatorioEntrega = iniciarJobRecordatorioEntrega;
