import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.es',
  port: 587,
  secure: false,
  auth: {
    user: 'cau@grupoub.com',
    pass: '23FG@*saj$',
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('🟥 Error SMTP:', error);
  } else {
    console.log('🟩 SMTP listo');
  }
});

import { getDB } from '../config/database';

type UserInfo = {
  username: string;
  Nombre: string;
  Apellidos: string;
};

/**
 * Obtiene información básica del usuario por username
 */
async function getUserInfoByUsername(username: string): Promise<UserInfo | null> {
  const db = getDB();

  const result = await db.request()
    .input('username', username)
    .query(`
      SELECT
        username,
        Nombre,
        Apellidos
      FROM UbUsersweb
      WHERE username = @username
         OR username = REPLACE(@username, '@GRUPOUB.COM', '')
    `);

  if (!result.recordset.length) {
    return null;
  }

  return result.recordset[0];
}

function formatFecha(fechaISO: string) {
  return new Date(fechaISO).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function enviarCorreoReservaPendiente({
  usuario,
  vehiculo,
  motivo,
  fechaInicio,
  fechaFin,
  token,
  destinatarios = ['Daniel Marqueta <d.marqueta@grupoub.com>, Pilar Escanero <p.escanero@grupoub.com>, Bustar Salinas Santos <b.salinas@grupoub.com>, Estefania Muñoz <e.munoz@grupoub.com>, Carlota Marazuela <c.marazuela@grupoub.com>'],
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
  destinatarios?: string[];
}) {
  const inicio = formatFecha(fechaInicio);
  const fin = formatFecha(fechaFin);

  const urlConfirmar = `http://192.168.1.19:3001/aprobacion/confirmar?token=${token}`;
  const urlDenegar = `http://192.168.1.19:3001/aprobacion/denegar?token=${token}`;

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">

      <h2 style="margin-top:0; color:#1f2937;">
        🚗 Reserva pendiente de aprobación
      </h2>

      <p style="font-size:14px; color:#374151;">
        Se ha solicitado una reserva de vehículo que requiere tu aprobación.
      </p>

      <table style="width:100%; font-size:14px; margin:20px 0; border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;"><strong>Solicitante:</strong></td>
          <td>${usuario}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Vehículo:</strong></td>
          <td>${vehiculo.marca} ${vehiculo.modelo}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Matrícula:</strong></td>
          <td>${vehiculo.matricula}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Motivo / Lugar:</strong></td>
          <td>${motivo}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Desde:</strong></td>
          <td>${inicio}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Hasta:</strong></td>
          <td>${fin}</td>
        </tr>
      </table>

      <div style="text-align:center; margin-top:30px;">
        <a href="${urlConfirmar}"
           style="display:inline-block; padding:12px 20px; margin-right:10px;
                  background:#16a34a; color:white; text-decoration:none;
                  border-radius:6px; font-weight:bold;">
          ✔ Confirmar
        </a>

        <a href="${urlDenegar}"
           style="display:inline-block; padding:12px 20px;
                  background:#dc2626; color:white; text-decoration:none;
                  border-radius:6px; font-weight:bold;">
          ✖ Denegar
        </a>
      </div>

      <p style="font-size:12px; color:#6b7280; margin-top:30px;">
        Este correo ha sido generado automáticamente por el sistema de reservas de vehículos.
      </p>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: '"Reservas Vehículos UB" <cau@grupoub.com>',
    to: destinatarios.join('Daniel Marqueta <d.marqueta@grupoub.com>, Pilar Escanero <p.escanero@grupoub.com>, Bustar Salinas Santos <b.salinas@grupoub.com>, Estefania Muñoz <e.munoz@grupoub.com>, Carlota Marazuela <c.marazuela@grupoub.com>'),
    subject: 'Reserva de vehículo pendiente de aprobación',
    html,
  });
}

export async function enviarCorreoReservaAprobada({
  usuario,
  vehiculo,
  fechaInicio,
  fechaFin,
}: {
  usuario: string;
  vehiculo: {
    marca: string;
    modelo: string;
    matricula: string;
  };
  fechaInicio: string;
  fechaFin: string;
}) {
  console.log('🟦 [enviarCorreoReservaAprobada] Inicio', {
    usuario,
    vehiculo,
  });

  const userInfo = await getUserInfoByUsername(usuario);

  if (!userInfo) {
    console.warn('🟨 Usuario no encontrado:', usuario);
    return;
  }

  const solicitanteNombre =
    `${userInfo.Nombre || ''} ${userInfo.Apellidos || ''}`.trim() || usuario;

  const correoSolicitante = usuario.includes('@')
    ? usuario
    : `${usuario}@grupoub.com`;

  const inicio = formatFecha(fechaInicio);
  const fin = formatFecha(fechaFin);

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">

      <h2 style="margin-top:0; color:#166534;">
        ✔ Reserva de vehículo aprobada
      </h2>

      <p style="font-size:14px; color:#374151;">
        Tu solicitud de reserva ha sido <strong>aprobada</strong>.
      </p>

      <table style="width:100%; font-size:14px; margin:20px 0;">
        <tr><td><strong>Vehículo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td><strong>Matrícula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>

      <p style="font-size:14px; color:#166534;">
        Puedes pasar a recoger el vehículo en la fecha indicada.
      </p>

      <p style="font-size:12px; color:#6b7280; margin-top:30px;">
        Sistema de reservas de vehículos UB
      </p>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: '"Reservas Vehículos UB" <cau@grupoub.com>',
    to: correoSolicitante,
    subject: `Reserva aprobada - ${vehiculo.matricula}`,
    html,
  });

  console.log('🟩 [enviarCorreoReservaAprobada] Correo enviado');
}

export async function enviarCorreoReservaDenegada({
  usuario,
  vehiculo,
  fechaInicio,
  fechaFin,
  motivoDenegacion,
}: {
  usuario: string;
  vehiculo: {
    marca: string;
    modelo: string;
    matricula: string;
  };
  fechaInicio: string;
  fechaFin: string;
  motivoDenegacion?: string;
}) {
  console.log('🟦 [enviarCorreoReservaDenegada] Inicio', {
    usuario,
    vehiculo,
  });

  const userInfo = await getUserInfoByUsername(usuario);

  if (!userInfo) {
    console.warn('🟨 Usuario no encontrado:', usuario);
    return;
  }

  const solicitanteNombre =
    `${userInfo.Nombre || ''} ${userInfo.Apellidos || ''}`.trim() || usuario;

  const correoSolicitante = usuario.includes('@')
    ? usuario
    : `${usuario}@grupoub.com`;

  const inicio = formatFecha(fechaInicio);
  const fin = formatFecha(fechaFin);

  const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">

      <h2 style="margin-top:0; color:#991b1b;">
        ✖ Reserva de vehículo denegada
      </h2>

      <p style="font-size:14px; color:#374151;">
        Tu solicitud de reserva ha sido <strong>denegada</strong>.
      </p>

      <table style="width:100%; font-size:14px; margin:20px 0;">
        <tr><td><strong>Vehículo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td><strong>Matrícula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>

      ${
        motivoDenegacion
          ? `<p style="font-size:14px; color:#7c2d12;">
               <strong>Motivo:</strong> ${motivoDenegacion}
             </p>`
          : ''
      }

      <p style="font-size:12px; color:#6b7280; margin-top:30px;">
        Si tienes dudas, contacta con el departamento de administración.
      </p>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: '"Reservas Vehículos UB" <cau@grupoub.com>',
    to: correoSolicitante,
    subject: `Reserva denegada - ${vehiculo.matricula}`,
    html,
  });

  console.log('🟩 [enviarCorreoReservaDenegada] Correo enviado');
}
