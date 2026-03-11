import { Request, Response } from 'express';
import { getDB } from '../config/database';
import {
  enviarCorreoReservaAprobada,
  enviarCorreoReservaDenegada,
} from '../services/mail.service server';

/* ============================
   CONFIRMAR RESERVA
============================ */
export const confirmarReserva = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Token inválido');
  }

  const db = getDB();

  try {
    /* 1️⃣ OBTENER DATOS DE LA RESERVA */
    const reserva = await db.request()
      .input('token', token)
      .query(`
        SELECT
          r.usuario,
          r.fecha_inicio,
          r.fecha_fin,
          v.marca,
          v.modelo,
          v.matricula,
          v.pkid AS vehiculo_pkid
        FROM UbReservaVehiculos r
        INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
        WHERE r.token_aprobacion = @token
      `);

    if (!reserva.recordset.length) {
      return res.status(404).send('Reserva no encontrada');
    }

    const {
      usuario,
      fecha_inicio,
      fecha_fin,
      marca,
      modelo,
      matricula,
      vehiculo_pkid,
    } = reserva.recordset[0];

    /* 2️⃣ RESERVA → OCUPADO */
    await db.request()
      .input('token', token)
      .query(`
        UPDATE UbReservaVehiculos
        SET estado = 'OCUPADO'
        WHERE token_aprobacion = @token
      `);

    /* 3️⃣ VEHÍCULO → OCUPADO (0) */
    await db.request()
      .input('vehiculoPkid', vehiculo_pkid)
      .query(`
        UPDATE UbVehiculos
        SET activo = 0
        WHERE pkid = @vehiculoPkid
      `);

    /* 4️⃣ LOG */
    await db.request()
      .input('vehiculoPkid', vehiculo_pkid)
      .input('usuario', usuario)
      .query(`
        INSERT INTO UbReservaVehiculosLOG
        (vehiculo_pkid, accion, usuario_accion, estado_anterior, estado_nuevo, fecha_log, detalle)
        VALUES
        (@vehiculoPkid, 'APROBAR', @usuario, 'PENDIENTE', 'OCUPADO', GETDATE(), 'Reserva aprobada')
      `);

    /* 5️⃣ CORREO AL SOLICITANTE */
    await enviarCorreoReservaAprobada({
      usuario,
      vehiculo: { marca, modelo, matricula },
      fechaInicio: fecha_inicio.toISOString(),
      fechaFin: fecha_fin.toISOString(),
    });

    res.send('<h2>✅ Reserva confirmada correctamente</h2>');

  } catch (error) {
    console.error('ERROR CONFIRMAR RESERVA:', error);
    res.status(500).send('Error confirmando la reserva');
  }
};

/* ============================
   DENEGAR RESERVA
============================ */
export const denegarReserva = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Token inválido');
  }

  const db = getDB();

  try {
    /* 1️⃣ OBTENER DATOS DE LA RESERVA */
    const reserva = await db.request()
      .input('token', token)
      .query(`
        SELECT
          r.usuario,
          r.fecha_inicio,
          r.fecha_fin,
          v.marca,
          v.modelo,
          v.matricula,
          v.pkid AS vehiculo_pkid
        FROM UbReservaVehiculos r
        INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
        WHERE r.token_aprobacion = @token
      `);

    if (!reserva.recordset.length) {
      return res.status(404).send('Reserva no encontrada');
    }

    const {
      usuario,
      fecha_inicio,
      fecha_fin,
      marca,
      modelo,
      matricula,
      vehiculo_pkid,
    } = reserva.recordset[0];

    /* 2️⃣ RESERVA → DENEGADA */
    await db.request()
      .input('token', token)
      .query(`
        UPDATE UbReservaVehiculos
        SET estado = 'DENEGADA'
        WHERE token_aprobacion = @token
      `);

    /* 3️⃣ VEHÍCULO → LIBRE (1) */
    await db.request()
      .input('vehiculoPkid', vehiculo_pkid)
      .query(`
        UPDATE UbVehiculos
        SET activo = 1
        WHERE pkid = @vehiculoPkid
      `);

    /* 4️⃣ LOG */
    await db.request()
      .input('vehiculoPkid', vehiculo_pkid)
      .input('usuario', usuario)
      .query(`
        INSERT INTO UbReservaVehiculosLOG
        (vehiculo_pkid, accion, usuario_accion, estado_anterior, estado_nuevo, fecha_log, detalle)
        VALUES
        (@vehiculoPkid, 'DENEGAR', @usuario, 'PENDIENTE', 'DENEGADA', GETDATE(), 'Reserva denegada')
      `);

    /* 5️⃣ CORREO AL SOLICITANTE */
    await enviarCorreoReservaDenegada({
      usuario,
      vehiculo: { marca, modelo, matricula },
      fechaInicio: fecha_inicio.toISOString(),
      fechaFin: fecha_fin.toISOString(),
    });

    res.send('<h2>❌ Reserva denegada</h2>');

  } catch (error) {
    console.error('ERROR DENEGAR RESERVA:', error);
    res.status(500).send('Error denegando la reserva');
  }
};
