"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const reservas_routes_1 = __importDefault(require("./routes/reservas.routes"));
const vehiculos_routes_1 = __importDefault(require("./routes/vehiculos.routes"));
const entrega_routes_1 = __importDefault(require("./routes/entrega.routes"));
const aprobacion_routes_1 = __importDefault(require("./routes/aprobacion.routes"));
const runtime_1 = require("./config/runtime");
const app = (0, express_1.default)();
const allowedOrigins = (0, runtime_1.getAllowedCorsOrigins)();
app.use((0, cors_1.default)({
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
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/reservas', reservas_routes_1.default);
app.use('/aprobacion', aprobacion_routes_1.default);
app.use('/vehiculos', vehiculos_routes_1.default);
app.use('/entrega', entrega_routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
exports.default = app;
