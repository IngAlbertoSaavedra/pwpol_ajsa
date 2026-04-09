import { Router } from "express";
import {
  listModelos,
  listModelosCombo,
  getModelo,
  createModelo,
  updateModelo,
  setActivoModelo,
} from "../controllers/modelos.controller.js";

const router = Router();

router.get("/", listModelos);
router.get("/combo", listModelosCombo);
router.get("/:id", getModelo);

router.post("/", createModelo);
router.put("/:id", updateModelo);
router.put("/:id/activo", setActivoModelo);

export default router;