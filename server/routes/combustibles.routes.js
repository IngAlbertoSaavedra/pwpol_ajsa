import { Router } from "express";
import {
  listCombustibles,
  listCombustiblesCombo,
  getCombustible,
  createCombustible,
  updateCombustible,
  setActivoCombustible,
} from "../controllers/combustibles.controller.js";

const router = Router();

router.get("/", listCombustibles);
router.get("/combo", listCombustiblesCombo);
router.get("/:id", getCombustible);

router.post("/", createCombustible);
router.put("/:id", updateCombustible);
router.put("/:id/activo", setActivoCombustible);

export default router;