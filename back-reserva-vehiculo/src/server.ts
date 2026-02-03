import app from './app';
import { getPort } from './config/server';
import { connectDB } from './config/database';

const startServer = async () => {
  await connectDB();

  const port = getPort();
  app.listen(3001, '0.0.0.0', () => {
    console.log(`Servidor escuchando en puerto ${port}`);
  });
};

startServer();