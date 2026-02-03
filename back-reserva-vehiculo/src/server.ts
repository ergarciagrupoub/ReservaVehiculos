import app from './app';
import { getPort } from './config/server';
import { connectDB } from './config/database';
import { iniciarJobRecordatorioEntrega } from './jobs/recordatorioEntrega.job';


const startServer = async () => {
  await connectDB();
  iniciarJobRecordatorioEntrega();
  // const port = getPort();
  // app.listen(3001, '0.0.0.0', () => {
  //   console.log(`Servidor escuchando en puerto ${port}`);
  // });

  const port = getPort();
  app.listen(3001, 'localhost', () => {
    console.log(`Servidor escuchando en puerto ${port}`);
  });

};

startServer();