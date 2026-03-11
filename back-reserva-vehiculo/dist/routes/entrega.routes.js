"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entrega_controller_1 = require("../controllers/entrega.controller");
const router = (0, express_1.Router)();
router.post('/entregar', entrega_controller_1.entregarVehiculo);
exports.default = router;
