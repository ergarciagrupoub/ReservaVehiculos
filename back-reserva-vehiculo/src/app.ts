import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import reservasRoutes from './routes/reservas.routes';
import vehiculosRoutes from './routes/vehiculos.routes';
import entregaRoutes from './routes/entrega.routes';
import aprobacionRoutes from './routes/aprobacion.routes';

const app = express();

app.use(cors({
  origin: 'http://192.168.1.19:5174',
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
