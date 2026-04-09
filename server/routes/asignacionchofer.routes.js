import { Router } from "express";
import {
  buscarVehiculo,
  listChoferes,
  getChofer,
  asignarChofer,
  desasignarChofer,
} from "../controllers/asignacionchofer.controller.js";

const router = Router();

router.get("/vehiculo", buscarVehiculo);
router.get("/choferes", listChoferes);
router.get("/choferes/:id", getChofer);

router.post("/asignar", asignarChofer);
router.post("/desasignar", desasignarChofer);

export default router;