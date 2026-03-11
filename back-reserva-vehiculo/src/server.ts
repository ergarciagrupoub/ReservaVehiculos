import 'dotenv/config';
import app from './app';
import { getHost, getPort } from './config/server';
import { connectDB } from './config/database';
import { iniciarJobRecordatorioEntrega } from './jobs/recordatorioEntrega.job';


const startServer = async () => {
  await connectDB();
  iniciarJobRecordatorioEntrega();
  const port = Number(getPort());
  const host = getHost();
  app.listen(port, host, () => {
    console.log(`Servidor escuchando en ${host}:${port}`);
  });
};

startServer();
