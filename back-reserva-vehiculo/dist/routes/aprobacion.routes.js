"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aprobacion_controller_1 = require("../controllers/aprobacion.controller");
const router = (0, express_1.Router)();
router.get('/confirmar', aprobacion_controller_1.confirmarReserva);
router.get('/denegar', aprobacion_controller_1.denegarReserva);
exports.default = router;
