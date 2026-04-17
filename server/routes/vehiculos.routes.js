import { Router } from "express";
import {
  listVehiculos,
  consultVehiculo,
  getVehiculo,
  historyVehiculo,
  createVehiculo,
  updateVehiculo,
  changeDriver,
  setActivoVehiculo,
} from "../controllers/vehiculos.controller.js";

const router = Router();

router.get("/", listVehiculos);
router.get("/consulta", consultVehiculo);
router.get("/historial", historyVehiculo);
router.get("/:id", getVehiculo);

router.post("/", createVehiculo);
router.put("/:id", updateVehiculo);
router.put("/:id/chofer", changeDriver);
router.put("/:id/activo", setActivoVehiculo);

export default router;