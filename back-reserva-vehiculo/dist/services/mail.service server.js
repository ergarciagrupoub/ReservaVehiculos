"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreoRecordatorioEntrega = void 0;
exports.enviarCorreoReservaPendiente = enviarCorreoReservaPendiente;
exports.enviarCorreoReservaAprobada = enviarCorreoReservaAprobada;
exports.enviarCorreoReservaDenegada = enviarCorreoReservaDenegada;
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = require("../config/database");
const runtime_1 = require("../config/runtime");
const transporter = nodemailer_1.default.createTransport({
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
        console.error('SMTP error:', error);
    }
    else {
        console.log('SMTP ready');
    }
});
const publicApiBaseUrl = (0, runtime_1.getPublicApiBaseUrl)();
const DESTINATARIOS_APROBACION = [
    'Daniel Marqueta <d.marqueta@grupoub.com>',
    'Pilar Escanero <p.escanero@grupoub.com>',
    'Bustar Salinas Santos <b.salinas@grupoub.com>',
    'Estefania Munoz <e.munoz@grupoub.com>',
    'Carlota Marazuela <c.marazuela@grupoub.com>',
    // 'Ernesto Garcia <er.garcia@grupoub.com>',
];
const formatFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
const correoUsuario = (usuario) => {
    return usuario.includes('@') ? usuario : `${usuario}@grupoub.com`;
};
async function getUserInfoByUsername(username) {
    const db = (0, database_1.getDB)();
    const result = await db
        .request()
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
async function enviarCorreoReservaPendiente({ usuario, vehiculo, motivo, fechaInicio, fechaFin, token, }) {
    const inicio = formatFecha(fechaInicio);
    const fin = formatFecha(fechaFin);
    const urlConfirmar = `${publicApiBaseUrl}/aprobacion/confirmar?token=${token}`;
    const urlDenegar = `${publicApiBaseUrl}/aprobacion/denegar?token=${token}`;
    const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
      <h2 style="margin-top:0; color:#1f2937;">Reserva pendiente de aprobacion</h2>
      <p style="font-size:14px; color:#374151;">Se ha solicitado una reserva de vehiculo que requiere tu aprobacion.</p>

      <table style="width:100%; font-size:14px; margin:20px 0; border-collapse:collapse;">
        <tr><td style="padding:6px 0;"><strong>Solicitante:</strong></td><td>${usuario}</td></tr>
        <tr><td style="padding:6px 0;"><strong>Vehiculo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td style="padding:6px 0;"><strong>Matricula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td style="padding:6px 0;"><strong>Motivo / Lugar:</strong></td><td>${motivo ?? '-'}</td></tr>
        <tr><td style="padding:6px 0;"><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td style="padding:6px 0;"><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>

      <div style="text-align:center; margin-top:30px;">
        <a href="${urlConfirmar}" style="display:inline-block; padding:12px 20px; margin-right:10px; background:#16a34a; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Confirmar</a>
        <a href="${urlDenegar}" style="display:inline-block; padding:12px 20px; background:#dc2626; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Denegar</a>
      </div>

      <p style="font-size:12px; color:#6b7280; margin-top:30px;">Este correo ha sido generado automaticamente por el sistema de reservas de vehiculos.</p>
    </div>
  </div>
  `;
    await transporter.sendMail({
        from: '"Reservas Vehiculos UB" <cau@grupoub.com>',
        to: DESTINATARIOS_APROBACION.join(', '),
        subject: 'Reserva de vehiculo pendiente de aprobacion',
        html,
    });
}
async function enviarCorreoReservaAprobada({ usuario, vehiculo, fechaInicio, fechaFin, }) {
    const userInfo = await getUserInfoByUsername(usuario);
    if (!userInfo) {
        console.warn('Usuario no encontrado:', usuario);
        return;
    }
    const inicio = formatFecha(fechaInicio);
    const fin = formatFecha(fechaFin);
    const correoSolicitante = correoUsuario(usuario);
    const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
      <h2 style="margin-top:0; color:#166534;">Reserva de vehiculo aprobada</h2>
      <p style="font-size:14px; color:#374151;">Tu solicitud de reserva ha sido <strong>aprobada</strong>.</p>
      <table style="width:100%; font-size:14px; margin:20px 0;">
        <tr><td><strong>Vehiculo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td><strong>Matricula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>
      <p style="font-size:14px; color:#166534;">Puedes pasar a recoger el vehiculo en la fecha indicada.</p>
      <p style="font-size:12px; color:#6b7280; margin-top:30px;">Sistema de reservas de vehiculos UB</p>
    </div>
  </div>
  `;
    await transporter.sendMail({
        from: '"Reservas Vehiculos UB" <cau@grupoub.com>',
        to: correoSolicitante,
        subject: `Reserva aprobada - ${vehiculo.matricula}`,
        html,
    });
}
async function enviarCorreoReservaDenegada({ usuario, vehiculo, fechaInicio, fechaFin, motivoDenegacion, }) {
    const userInfo = await getUserInfoByUsername(usuario);
    if (!userInfo) {
        console.warn('Usuario no encontrado:', usuario);
        return;
    }
    const inicio = formatFecha(fechaInicio);
    const fin = formatFecha(fechaFin);
    const correoSolicitante = correoUsuario(usuario);
    const html = `
  <div style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
      <h2 style="margin-top:0; color:#991b1b;">Reserva de vehiculo denegada</h2>
      <p style="font-size:14px; color:#374151;">Tu solicitud de reserva ha sido <strong>denegada</strong>.</p>
      <table style="width:100%; font-size:14px; margin:20px 0;">
        <tr><td><strong>Vehiculo:</strong></td><td>${vehiculo.marca} ${vehiculo.modelo}</td></tr>
        <tr><td><strong>Matricula:</strong></td><td>${vehiculo.matricula}</td></tr>
        <tr><td><strong>Desde:</strong></td><td>${inicio}</td></tr>
        <tr><td><strong>Hasta:</strong></td><td>${fin}</td></tr>
      </table>
      ${motivoDenegacion
        ? `<p style="font-size:14px; color:#7c2d12;"><strong>Motivo:</strong> ${motivoDenegacion}</p>`
        : ''}
      <p style="font-size:12px; color:#6b7280; margin-top:30px;">Si tienes dudas, contacta con administracion.</p>
    </div>
  </div>
  `;
    await transporter.sendMail({
        from: '"Reservas Vehiculos UB" <cau@grupoub.com>',
        to: correoSolicitante,
        subject: `Reserva denegada - ${vehiculo.matricula}`,
        html,
    });
}
const enviarCorreoRecordatorioEntrega = async ({ usuario, vehiculo, fechaFin, }) => {
    const correoSolicitante = correoUsuario(usuario);
    const asunto = 'Recordatorio de entrega de vehiculo';
    const html = `
    <p>Hola <b>${usuario}</b>,</p>
    <p>Te recordamos que tienes pendiente la entrega del siguiente vehiculo:</p>
    <ul>
      <li><b>Marca:</b> ${vehiculo.marca}</li>
      <li><b>Modelo:</b> ${vehiculo.modelo}</li>
      <li><b>Matricula:</b> ${vehiculo.matricula}</li>
      <li><b>Fecha limite:</b> ${new Date(fechaFin).toLocaleString('es-ES')}</li>
    </ul>
    <p>Por favor, realiza la entrega lo antes posible.</p>
    <p>Gracias.</p>
  `;
    await transporter.sendMail({
        from: '"Reserva Vehiculos" <cau@grupoub.com>',
        to: correoSolicitante,
        subject: asunto,
        html,
    });
};
exports.enviarCorreoRecordatorioEntrega = enviarCorreoRecordatorioEntrega;
