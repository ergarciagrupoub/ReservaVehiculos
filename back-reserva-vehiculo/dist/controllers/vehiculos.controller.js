"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarVehiculo = exports.actualizarVehiculo = exports.crearVehiculo = exports.getVehiculos = exports.getVehiculosDisponibles = void 0;
const database_1 = require("../config/database");
const getVehiculosDisponibles = async (_req, res) => {
    try {
        const db = (0, database_1.getDB)();
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
    }
    catch (error) {
        console.error('ERROR VEHICULOS:', error);
        res.status(500).json({ error: 'ERROR AL OBTENER VEHÍCULOS' });
    }
};
exports.getVehiculosDisponibles = getVehiculosDisponibles;
/* 🔹 OBTENER TODOS LOS VEHÍCULOS */
const getVehiculos = async (_req, res) => {
    try {
        const db = (0, database_1.getDB)();
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
    }
    catch (error) {
        console.error('ERROR GET VEHICULOS:', error);
        res.status(500).json({ error: 'ERROR AL OBTENER VEHÍCULOS' });
    }
};
exports.getVehiculos = getVehiculos;
/* 🔹 CREAR NUEVO VEHÍCULO */
const crearVehiculo = async (req, res) => {
    try {
        let { marca, modelo, color, matricula } = req.body;
        if (!marca || !modelo || !matricula) {
            return res.status(400).json({ error: 'FALTAN DATOS OBLIGATORIOS' });
        }
        marca = marca.toUpperCase();
        modelo = modelo.toUpperCase();
        color = color ? color.toUpperCase() : null;
        matricula = matricula.toUpperCase();
        const db = (0, database_1.getDB)();
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
    }
    catch (error) {
        console.error('ERROR CREAR VEHICULO:', error);
        if (error.message?.includes('UNIQUE')) {
            return res.status(400).json({ error: 'LA MATRÍCULA YA EXISTE' });
        }
        res.status(500).json({ error: 'ERROR AL CREAR VEHÍCULO' });
    }
};
exports.crearVehiculo = crearVehiculo;
/* 🔹 ACTUALIZAR VEHÍCULO */
const actualizarVehiculo = async (req, res) => {
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
        const db = (0, database_1.getDB)();
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
    }
    catch (error) {
        console.error('ERROR ACTUALIZAR VEHICULO:', error);
        res.status(500).json({ error: 'ERROR AL ACTUALIZAR VEHÍCULO' });
    }
};
exports.actualizarVehiculo = actualizarVehiculo;
/* 🔹 ELIMINAR VEHÍCULO */
const eliminarVehiculo = async (req, res) => {
    try {
        const { pkid } = req.params;
        if (!pkid) {
            return res.status(400).json({ error: 'PKID NO INFORMADO' });
        }
        const db = (0, database_1.getDB)();
        await db.request()
            .input('pkid', pkid)
            .query(`
        DELETE FROM UbVehiculos
        WHERE pkid = @pkid
      `);
        res.json({ message: 'VEHÍCULO ELIMINADO CORRECTAMENTE' });
    }
    catch (error) {
        console.error('ERROR ELIMINAR VEHICULO:', error);
        res.status(500).json({ error: 'ERROR AL ELIMINAR VEHÍCULO' });
    }
};
exports.eliminarVehiculo = eliminarVehiculo;
