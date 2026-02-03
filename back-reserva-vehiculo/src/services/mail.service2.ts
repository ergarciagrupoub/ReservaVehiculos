import nodemailer from 'nodemailer';
import { getDB } from '../config/database';

/* ================================
   TRANSPORTER SMTP
================================ */

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.es',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: 'cau@grupoub.com',
    pass: '23FG@*saj$',
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('🟥 Error SMTP:', error);
  } else {
    console.log('🟩 SMTP listo para enviar correos');
  }
});

/* ================================
   HELPERS
================================ */

function formatFecha(fechaISO: string) {
  return new Date(fechaISO).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Obtiene info básica del usuario a partir del username
 * (ej: er.garcia@grupoub.com o er.garcia)
 */
async function getUserInfoByUsername(username: string) {
  const db = getDB();

  const cleanUsername = username.includes('@')
    ? username.split('@')[0]
    : username;

  const rows = await db.request()
    .input('username', cleanUsername)
    .query(`
      SELECT
        username,
        Nombre,
        Apellidos
      FROM UbUsersweb
      WHERE username = @username
    `);

  if (!rows.recordset.length) return null;
  return rows.recordset[0];
}

/**
 * Reglas de responsables (igual filosofía que compras)
 * 👉 aquí es donde decides QUIÉN aprueba reservas
 */
function resolveDestinatariosReserva(username: string) {
  const local = username.split('@')[0].toLowerCase();
  const responsables: { email: string; nombre: string }[] = [];

  // =========================
  // FLOTA / ADMINISTRACIÓN
  // =========================
  const flotaUsers = [
    'er.garcia',
    'j.perez',
    'admin',
  ];

  if (flotaUsers.includes(local)) {
    responsables.push({
      email: 'c.marazuela@grupoub.com',
      nombre: 'Carlota Marazuela',
    });
  }

  // =========================
  // IT
  // =========================
  const itUsers = ['m.morlanes'];

  if (itUsers.includes(local)) {
    responsables.push({
      email: 'd.marqueta@grupoub.com',
      nombre: 'Daniel Marqueta',
    });
  }

  return responsables;
}

/* ================================
   CORREO RESERVA PENDIENTE
================================ */

export async function enviarCorreoReservaPendiente({
  usuario,
  vehiculo,
  motivo,
  fechaInicio,
  fechaFin,
  token,
}: {
  usuario: string;
  vehiculo: {
    marca: string;
    modelo: string;
    matricula: string;
  };
  motivo: string;
  fechaInicio: string;
  fechaFin: string;
  token: string;
}) {
  console.log('🟦 [enviarCorreoReservaPendiente] Inicio', {
    usuario,
    vehiculo,
    fechaInicio,
    fechaFin,
  });

  const userInfo = await getUserInfoByUsername(usuario);

  if (!userInfo) {
    console.warn('🟨 Usuario no encontrado:', usuario);
    return;
  }

  const responsables = resolveDestinatariosReserva(usuario);

  if (!responsables.length) {
    console.warn('🟨 Sin responsables configurados para:', usuario);
    return;
  }

  const solicitanteNombre =
    `${userInfo.Nombre || ''} ${userInfo.Apellidos || ''}`.trim() || usuario;

  const correoSolicitante = usuario.includes('@')
    ? usuario
    : `${usuario}@grupoub.com`;

  const toField = responsables
    .map((r) => `${r.nombre} <${r.email}>`)
    .join(', ');

  const inicio = formatFecha(fechaInicio);
  const fin = formatFecha(fechaFin);

  const urlConfirmar = `http://localhost:3001/aprobacion/confirmar?token=${token}`;
  const urlDenegar = `http://localhost:3001/aprobacion/denegar?token=${token}`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">

      <h2 style="margin-top:0; color:#1f2937;">
        🚗 Reserva de vehículo pendiente de aprobación
      </h2>

      <p style="font-size:14px; color:#374151;">
        Se ha solicitado una reserva de vehículo que requiere tu aprobación.
      </p>

      <table style="width:100%; font-size:14px; margin:20px 0;">
        <tr><td><strong>Solicitante:</strong></td><td>${solicitanteNombre}</td></tr>
        <tr><td><strong>Vehículo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td><strong>Matrícula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td><strong>Motivo:</strong></td><td>${motivo || '-'}</td></tr>
        <tr><td><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>

      <div style="text-align:center; margin-top:30px;">
        <a href="${urlConfirmar}"
           style="padding:12px 20px; background:#16a34a; color:white;
                  text-decoration:none; border-radius:6px; font-weight:bold;">
          ✔ Confirmar
        </a>
        &nbsp;
        <a href="${urlDenegar}"
           style="padding:12px 20px; background:#dc2626; color:white;
                  text-decoration:none; border-radius:6px; font-weight:bold;">
          ✖ Denegar
        </a>
      </div>

      <p style="font-size:12px; color:#6b7280; margin-top:30px;">
        Este correo ha sido generado automáticamente por el sistema de reservas de vehículos.
      </p>

    </div>
  </div>
  `;

  const mailOptions = {
    from: '"Reservas Vehículos UB" <cau@grupoub.com>',
    to: toField,
    cc: correoSolicitante,
    subject: `Reserva de vehículo pendiente de aprobación - ${vehiculo.matricula}`,
    html,
  };

  console.log('🟦 [enviarCorreoReservaPendiente] Enviando a:', {
    to: mailOptions.to,
    cc: mailOptions.cc,
  });

  await transporter.sendMail(mailOptions);

  console.log('🟩 [enviarCorreoReservaPendiente] Correo enviado correctamente');
}
