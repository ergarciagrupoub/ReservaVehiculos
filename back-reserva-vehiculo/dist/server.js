"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const server_1 = require("./config/server");
const database_1 = require("./config/database");
const recordatorioEntrega_job_1 = require("./jobs/recordatorioEntrega.job");
const startServer = async () => {
    await (0, database_1.connectDB)();
    (0, recordatorioEntrega_job_1.iniciarJobRecordatorioEntrega)();
    const port = Number((0, server_1.getPort)());
    const host = (0, server_1.getHost)();
    app_1.default.listen(port, host, () => {
        console.log(`Servidor escuchando en ${host}:${port}`);
    });
};
startServer();
