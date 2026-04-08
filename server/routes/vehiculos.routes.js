import { Router } from "express";
import { listVehiculos, createVehiculo, updateVehiculo, changeDriver } from "../controllers/vehiculos.controller.js";

const router = Router();

router.get("/", listVehiculos);
router.post("/", createVehiculo);
router.put("/:id", updateVehiculo);
router.put("/:id/chofer", changeDriver);

export default router;
