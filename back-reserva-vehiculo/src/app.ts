import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import reservasRoutes from './routes/reservas.routes';
import vehiculosRoutes from './routes/vehiculos.routes';
import entregaRoutes from './routes/entrega.routes';
import aprobacionRoutes from './routes/aprobacion.routes';
import { getAllowedCorsOrigins } from './config/runtime';

const app = express();
const allowedOrigins = getAllowedCorsOrigins();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/reservas', reservasRoutes);
app.use('/aprobacion', aprobacionRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/entrega', entregaRoutes);
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});


export default app;
