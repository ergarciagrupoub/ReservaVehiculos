import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER || 'ubadmin',
  password: process.env.DB_PASSWORD || 'EZFRsuw$QowTrYoV',
  server: process.env.DB_SERVER || 'ubserveraz.database.windows.net',
  database: process.env.DB_NAME || 'ubHR',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error('Base de datos no inicializada');
  }
  return pool;
};