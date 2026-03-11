"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entregarVehiculo = void 0;
const database_1 = require("../config/database");
const entregarVehiculo = async (req, res) => {
    const pool = (0, database_1.getDB)();
    const transaction = pool.transaction();
    try {
        let { vehiculoPkid, usuario, combustibleEstado, zonaAparcado, autonomiaDepositoKm, problemas, } = req.body;
        const autonomiaKm = Number(autonomiaDepositoKm);
        const autonomiaInvalida = autonomiaDepositoKm === undefined ||
            autonomiaDepositoKm === null ||
            !Number.isInteger(autonomiaKm) ||
            autonomiaKm < 0;
        if (!vehiculoPkid || !usuario || !combustibleEstado || !zonaAparcado || autonomiaInvalida) {
            return res.status(400).json({ error: 'FALTAN DATOS OBLIGATORIOS' });
        }
        usuario = usuario.toUpperCase();
        combustibleEstado = combustibleEstado.toUpperCase();
        zonaAparcado = zonaAparcado.toUpperCase();
        problemas = problemas ? problemas.toUpperCase() : null;
        await transaction.begin();
        const schemaCheck = await transaction.request().query(`
      SELECT
        CASE
          WHEN COL_LENGTH('UbEntregasVehiculo', 'autonomia_deposito_km') IS NULL THEN 0
          ELSE 1
        END AS hasAutonomia
    `);
        const hasAutonomiaColumn = schemaCheck.recordset[0]?.hasAutonomia === 1;
        const insertRequest = transaction
            .request()
            .input('vehiculoPkid', vehiculoPkid)
            .input('usuario', usuario)
            .input('combustible', combustibleEstado)
            .input('zona', zonaAparcado)
            .input('autonomiaDepositoKm', autonomiaKm)
            .input('problemas', problemas);
        if (hasAutonomiaColumn) {
            await insertRequest.query(`
        INSERT INTO UbEntregasVehiculo
        (vehiculo_pkid, usuario, combustible_estado, zona_aparcado, autonomia_deposito_km, problemas, fecha_entrega)
        VALUES
        (@vehiculoPkid, @usuario, @combustible, @zona, @autonomiaDepositoKm, @problemas, GETDATE())
      `);
        }
        else {
            await insertRequest.query(`
        INSERT INTO UbEntregasVehiculo
        (vehiculo_pkid, usuario, combustible_estado, zona_aparcado, problemas, fecha_entrega)
        VALUES
        (@vehiculoPkid, @usuario, @combustible, @zona, @problemas, GETDATE())
      `);
        }
        await transaction
            .request()
            .input('vehiculoPkid2', vehiculoPkid)
            .query(`
        UPDATE UbReservaVehiculos
        SET
          estado = 'LIBRE',
          ultima_actualizacion = GETDATE()
        WHERE vehiculo_pkid = @vehiculoPkid2
          AND estado = 'OCUPADO'
      `);
        await transaction
            .request()
            .input('vehiculoPkid3', vehiculoPkid)
            .query(`
        UPDATE UbVehiculos
        SET activo = 1
        WHERE pkid = @vehiculoPkid3
      `);
        const detalleLog = `COMBUSTIBLE: ${combustibleEstado} | AUTONOMIA: ${autonomiaKm} KM | ZONA: ${zonaAparcado} | PROBLEMAS: ${problemas ?? 'NINGUNO'}`;
        await transaction
            .request()
            .input('vehiculoPkid4', vehiculoPkid)
            .input('usuarioLog', usuario)
            .input('detalle', detalleLog)
            .query(`
        INSERT INTO UbReservaVehiculosLOG
        (vehiculo_pkid, accion, usuario_accion, estado_anterior, estado_nuevo, detalle, fecha_log)
        VALUES
        (@vehiculoPkid4, 'ENTREGAR', @usuarioLog, 'OCUPADO', 'FINALIZADO', @detalle, GETDATE())
      `);
        await transaction.commit();
        res.json({ message: 'ENTREGA REGISTRADA CORRECTAMENTE' });
    }
    catch (error) {
        await transaction.rollback();
        console.error('ERROR ENTREGA:', error);
        res.status(500).json({
            error: 'ERROR AL ENTREGAR VEHICULO',
            detalle: String(error),
        });
    }
};
exports.entregarVehiculo = entregarVehiculo;
