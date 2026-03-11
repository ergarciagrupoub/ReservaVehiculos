"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.connectDB = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config = {
    user: process.env.DB_USER || 'ubadmin',
    password: process.env.DB_PASSWORD || 'EZFRsuw$QowTrYoV',
    server: process.env.DB_SERVER || 'ubserveraz.database.windows.net',
    database: process.env.DB_NAME || 'ubHR',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};
let pool = null;
const connectDB = async () => {
    try {
        pool = await mssql_1.default.connect(config);
        console.log('Conexión a la base de datos exitosa');
    }
    catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const getDB = () => {
    if (!pool) {
        throw new Error('Base de datos no inicializada');
    }
    return pool;
};
exports.getDB = getDB;
