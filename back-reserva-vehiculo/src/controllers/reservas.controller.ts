import { Request, Response } from 'express';
import { getDB } from '../config/database';
import { enviarCorreoReservaPendiente } from '../services/mail.service';
import crypto from 'crypto';

type UsuarioParams = {
  usuario: string;
};

/* 🔹 RESERVAR VEHÍCULO */
export const reservarVehiculo = async (req: Request, res: Response) => {
  const pool = getDB();
  const transaction = pool.transaction();

  try {
    let { vehiculoPkid, usuario, motivo, fechaInicio, fechaFin } = req.body;

    if (!vehiculoPkid || !usuario || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'FALTAN DATOS OBLIGATORIOS' });
    }

    usuario = usuario.toUpperCase();
    motivo = motivo ? motivo.toUpperCase() : null;

    const fechaInicioSQL = new Date(fechaInicio);
    const fechaFinSQL = new Date(fechaFin);

    const tokenAprobacion = crypto.randomUUID();

    await transaction.begin();
    const request = transaction.request();

    /* 1️⃣ COMPROBAR VEHÍCULO */
    const vehiculo = await request
      .input('vehiculoPkid', vehiculoPkid)
      .query(`
        SELECT
          activo,
          marca,
          modelo,
          matricula
        FROM UbVehiculos
        WHERE pkid = @vehiculoPkid
      `);

    if (!vehiculo.recordset.length) {
    await transaction.rollback();
    return res.status(400).json({ error: 'VEHÍCULO NO ENCONTRADO' });
        }

        const {
              activo: estadoVehiculo,
              marca,
              modelo,
              matricula
            } = vehiculo.recordset[0];
        // 0 = LIBRE
        // 1 = OCUPADO
        // 2 = PENDIENTE
        if (estadoVehiculo !== 1) {
          await transaction.rollback();
          return res.status(400).json({ error: 'EL VEHÍCULO NO ESTÁ DISPONIBLE' });
        }


    /* 2️⃣ RESERVA → PENDIENTE */
    await request
      .input('vehiculoPkid2', vehiculoPkid)
      .input('usuario', usuario)
      .input('motivo', motivo)
      .input('fechaInicio', fechaInicioSQL)
      .input('fechaFin', fechaFinSQL)
      .input('token', tokenAprobacion)
      .query(`
        UPDATE UbReservaVehiculos
        SET
          usuario = @usuario,
          motivo = @motivo,
          fecha_inicio = @fechaInicio,
          fecha_fin = @fechaFin,
          estado = 'PENDIENTE',
          token_aprobacion = @token,
          ultima_actualizacion = GETDATE()
        WHERE vehiculo_pkid = @vehiculoPkid2
      `);

    /* 3️⃣ VEHÍCULO → PENDIENTE (2) */
    await request
      .input('vehiculoPkid3', vehiculoPkid)
      .query(`
        UPDATE UbVehiculos
        SET activo = 2
        WHERE pkid = @vehiculoPkid3
      `);

    /* 4️⃣ LOG */
    await request
      .input('vehiculoPkid4', vehiculoPkid)
      .input('usuarioLog', usuario)
      .query(`
        INSERT INTO UbReservaVehiculosLOG
        (vehiculo_pkid, accion, usuario_accion, estado_anterior, estado_nuevo, fecha_log)
        VALUES
        (@vehiculoPkid4, 'RESERVAR', @usuarioLog, 'LIBRE', 'PENDIENTE', GETDATE())
      `);

    await transaction.commit();

    /* 5️⃣ CORREO */
      await enviarCorreoReservaPendiente({
        usuario,
        vehiculo: {
          marca,
          modelo,
          matricula,
        },
        motivo,
        fechaInicio: fechaInicioSQL.toISOString(),
        fechaFin: fechaFinSQL.toISOString(),
        token: tokenAprobacion,
      });
    res.json({ message: 'RESERVA REGISTRADA Y PENDIENTE DE APROBACIÓN' });

  } catch (error) {
    await transaction.rollback();
    console.error('ERROR RESERVAR:', error);
    res.status(500).json({
      error: 'ERROR AL RESERVAR VEHÍCULO',
      detalle: String(error),
    });
  }
};


export const getReservasActivasPorUsuario = async (
  req: Request<UsuarioParams>,
  res: Response
) => {
  try {
    const usuarioUpper = req.params.usuario.toUpperCase();
    const db = getDB();

    const result = await db.request()
      .input('usuario', usuarioUpper)
      .query(`
        SELECT
          r.pkid               AS reserva_pkid,
          r.vehiculo_pkid,
          v.marca,
          v.modelo,
          v.color,
          v.matricula,
          r.motivo,
          r.fecha_inicio,
          r.fecha_fin,
          r.estado
        FROM UbReservaVehiculos r
        INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
        WHERE r.usuario = @usuario
          AND r.estado = 'OCUPADO'
        ORDER BY r.fecha_inicio DESC
      `);

    res.json(result.recordset);

  } catch (error) {
    console.error('ERROR RESERVAS ACTIVAS:', error);
    res.status(500).json({ error: 'ERROR AL OBTENER RESERVAS ACTIVAS' });
  }
};



export const getHistoricoReservasPorUsuario = async (
  req: Request<UsuarioParams>,
  res: Response
) => {
  try {
    const usuarioUpper = req.params.usuario.toUpperCase();
    const db = getDB();

    const result = await db.request()
      .input('usuario', usuarioUpper)
      .query(`
        SELECT
          r.pkid                AS reserva_pkid,
          v.pkid                AS vehiculo_pkid,
          v.marca,
          v.modelo,
          v.color,
          v.matricula,
          r.fecha_inicio,
          r.fecha_fin,
          e.fecha_entrega,
          e.combustible_estado,
          e.zona_aparcado,
          e.problemas
        FROM UbReservaVehiculos r
        INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
        LEFT JOIN UbEntregasVehiculo e ON e.vehiculo_pkid = r.vehiculo_pkid
        WHERE r.usuario = @usuario
        ORDER BY r.fecha_inicio DESC
      `);
    res.json(result.recordset);

  } catch (error) {
    console.error('ERROR HISTORICO:', error);
    res.status(500).json({ error: 'ERROR AL OBTENER HISTÓRICO DE RESERVAS' });
  }
};


export const getHistoricoReservasGlobal = async (_req: Request, res: Response) => {
  try {
    const db = getDB();

    const result = await db.request().query(`
      SELECT
        r.pkid,
        r.usuario,
        v.marca,
        v.modelo,
        v.matricula,
        r.fecha_inicio,
        r.fecha_fin,
        r.estado,
        r.ultima_actualizacion
      FROM UbReservaVehiculos r
      INNER JOIN UbVehiculos v ON v.pkid = r.vehiculo_pkid
      ORDER BY r.fecha_inicio DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: 'ERROR HISTÓRICO GLOBAL' });
  }
};

export const getEstadoActualVehiculos = async (_req: Request, res: Response) => {
  try {
    const db = getDB();

    const result = await db.request().query(`
      WITH UltimoLog AS (
        SELECT
          l.pkid,
          l.vehiculo_pkid,
          l.usuario_accion,
          l.estado_nuevo,
          l.detalle,
          l.fecha_log,
          ROW_NUMBER() OVER (
            PARTITION BY l.vehiculo_pkid
            ORDER BY l.fecha_log DESC
          ) AS rn
        FROM UbReservaVehiculosLOG l
      )
      SELECT
        ul.vehiculo_pkid,
        ul.usuario_accion,
        ul.estado_nuevo,
        ul.detalle,
        ul.fecha_log,
        v.marca,
        v.modelo,
        v.matricula
      FROM UltimoLog ul
      INNER JOIN UbVehiculos v ON v.pkid = ul.vehiculo_pkid
      WHERE ul.rn = 1
      ORDER BY v.matricula;
    `);

    const data = result.recordset.map((row: any) => ({
      vehiculoPkid: row.vehiculo_pkid,
      marca: row.marca,
      modelo: row.modelo,
      matricula: row.matricula,
      usuario: row.usuario_accion,
      detalle: row.detalle,
      fecha: row.fecha_log,
      estado: row.estado_nuevo,
    }));

    res.json(data);
  } catch (error) {
    console.error('ERROR ESTADO VEHÍCULOS:', error);
    res.status(500).json({ error: 'ERROR OBTENIENDO ESTADO VEHÍCULOS' });
  }
};

