import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const entregarVehiculo = async (req: Request, res: Response) => {
  const pool = getDB();
  const transaction = pool.transaction();

  try {
    let {
      vehiculoPkid,
      usuario,
      combustibleEstado,
      zonaAparcado,
      problemas
    } = req.body;

    if (!vehiculoPkid || !usuario || !combustibleEstado || !zonaAparcado) {
      return res.status(400).json({ error: 'FALTAN DATOS OBLIGATORIOS' });
    }

    // 🔥 MAYÚSCULAS
    usuario = usuario.toUpperCase();
    combustibleEstado = combustibleEstado.toUpperCase();
    zonaAparcado = zonaAparcado.toUpperCase();
    problemas = problemas ? problemas.toUpperCase() : null;

    await transaction.begin();
    const request = transaction.request();

    /* 1️⃣ INSERTAR ENTREGA */
    await request
      .input('vehiculoPkid', vehiculoPkid)
      .input('usuario', usuario)
      .input('combustible', combustibleEstado)
      .input('zona', zonaAparcado)
      .input('problemas', problemas)
      .query(`
        INSERT INTO UbEntregasVehiculo
        (vehiculo_pkid, usuario, combustible_estado, zona_aparcado, problemas, fecha_entrega)
        VALUES
        (@vehiculoPkid, @usuario, @combustible, @zona, @problemas, GETDATE())
      `);

    /* 2️⃣ ACTUALIZAR RESERVA */
    await request
      .input('vehiculoPkid2', vehiculoPkid)
      .query(`
        UPDATE UbReservaVehiculos
        SET
          estado = 'LIBRE',
          ultima_actualizacion = GETDATE()
        WHERE vehiculo_pkid = @vehiculoPkid2
          AND estado = 'OCUPADO'
      `);

    /* 3️⃣ REACTIVAR VEHÍCULO */
    await request
      .input('vehiculoPkid3', vehiculoPkid)
      .query(`
        UPDATE UbVehiculos
        SET activo = 1
        WHERE pkid = @vehiculoPkid3
      `);

      const detalleLog = `COMBUSTIBLE: ${combustibleEstado} | ZONA: ${zonaAparcado} | PROBLEMAS: ${problemas ?? 'NINGUNO'}`;

    /* 4️⃣ LOG */
    await request
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

  } catch (error) {
    await transaction.rollback();
    console.error('ERROR ENTREGA:', error);

    res.status(500).json({
      error: 'ERROR AL ENTREGAR VEHÍCULO',
      detalle: String(error),
    });
  }
};
