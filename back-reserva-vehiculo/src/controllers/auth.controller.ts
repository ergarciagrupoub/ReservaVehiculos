import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const db = getDB();

    const result = await db.request()
      .input('username', username)
      .query(`
        SELECT password 
        FROM UbUsersweb 
        WHERE username = @username
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const storedPassword = result.recordset[0].password;

    if (storedPassword !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};
