import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getVehiculosDisponibles = async (_req: Request, res: Response) => {
  try {
    const db = getDB();

    const result = await db.request().query(`
      SELECT
        pkid,
        marca,
        modelo,
        color,
        matricula,
        activo
      FROM UbVehiculos
      WHERE activo IN (1, 2)
      ORDER BY marca, modelo
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('ERROR VEHICULOS:', error);
    res.status(500).json({ error: 'ERROR AL OBTENER VEHÍCULOS' });
  }
};

/* 🔹 OBTENER TODOS LOS VEHÍCULOS */
export const getVehiculos = async (_req: Request, res: Response) => {
  try {
    const db = getDB();

    const result = await db.request().query(`
      SELECT
        pkid,
        marca,
        modelo,
        color,
        matricula,
        activo
      FROM UbVehiculos
      ORDER BY marca, modelo
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('ERROR GET VEHICULOS:', error);
    res.status(500).json({ error: 'ERROR AL OBTENER VEHÍCULOS' });
  }
};

/* 🔹 CREAR NUEVO VEHÍCULO */
export const crearVehiculo = async (req: Request, res: Response) => {
  try {
    let { marca, modelo, color, matricula } = req.body;

    if (!marca || !modelo || !matricula) {
      return res.status(400).json({ error: 'FALTAN DATOS OBLIGATORIOS' });
    }

    marca = marca.toUpperCase();
    modelo = modelo.toUpperCase();
    color = color ? color.toUpperCase() : null;
    matricula = matricula.toUpperCase();

    const db = getDB();

    await db.request()
      .input('marca', marca)
      .input('modelo', modelo)
      .input('color', color)
      .input('matricula', matricula)
      .query(`
        INSERT INTO UbVehiculos
        (marca, modelo, color, matricula, activo, fecha_creacion)
        VALUES
        (@marca, @modelo, @color, @matricula, 1, GETDATE())
      `);

    res.json({ message: 'VEHÍCULO CREADO CORRECTAMENTE' });

  } catch (error: any) {
    console.error('ERROR CREAR VEHICULO:', error);

    if (error.message?.includes('UNIQUE')) {
      return res.status(400).json({ error: 'LA MATRÍCULA YA EXISTE' });
    }

    res.status(500).json({ error: 'ERROR AL CREAR VEHÍCULO' });
  }
};

/* 🔹 ACTUALIZAR VEHÍCULO */
export const actualizarVehiculo = async (req: Request, res: Response) => {
  try {
    const { pkid } = req.params;
    let { marca, modelo, color, matricula, activo } = req.body;

    if (!pkid) {
      return res.status(400).json({ error: 'PKID NO INFORMADO' });
    }

    marca = marca?.toUpperCase();
    modelo = modelo?.toUpperCase();
    color = color ? color.toUpperCase() : null;
    matricula = matricula?.toUpperCase();

    const db = getDB();

    await db.request()
      .input('pkid', pkid)
      .input('marca', marca)
      .input('modelo', modelo)
      .input('color', color)
      .input('matricula', matricula)
      .input('activo', activo)
      .query(`
        UPDATE UbVehiculos
        SET
          marca = ISNULL(@marca, marca),
          modelo = ISNULL(@modelo, modelo),
          color = ISNULL(@color, color),
          matricula = ISNULL(@matricula, matricula),
          activo = ISNULL(@activo, activo)
        WHERE pkid = @pkid
      `);

    res.json({ message: 'VEHÍCULO ACTUALIZADO CORRECTAMENTE' });

  } catch (error) {
    console.error('ERROR ACTUALIZAR VEHICULO:', error);
    res.status(500).json({ error: 'ERROR AL ACTUALIZAR VEHÍCULO' });
  }
};

/* 🔹 ELIMINAR VEHÍCULO */
export const eliminarVehiculo = async (req: Request, res: Response) => {
  try {
    const { pkid } = req.params;

    if (!pkid) {
      return res.status(400).json({ error: 'PKID NO INFORMADO' });
    }

    const db = getDB();

    await db.request()
      .input('pkid', pkid)
      .query(`
        DELETE FROM UbVehiculos
        WHERE pkid = @pkid
      `);

    res.json({ message: 'VEHÍCULO ELIMINADO CORRECTAMENTE' });

  } catch (error) {
    console.error('ERROR ELIMINAR VEHICULO:', error);
    res.status(500).json({ error: 'ERROR AL ELIMINAR VEHÍCULO' });
  }
};
