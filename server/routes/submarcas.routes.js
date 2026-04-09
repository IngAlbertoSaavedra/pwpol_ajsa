import { Router } from "express";
import {
  listSubmarcas,
  listSubmarcasCombo,
  getSubmarca,
  createSubmarca,
  updateSubmarca,
  setActivoSubmarca,
} from "../controllers/submarcas.controller.js";

const router = Router();

router.get("/", listSubmarcas);
router.get("/combo", listSubmarcasCombo);
router.get("/:id", getSubmarca);

router.post("/", createSubmarca);
router.put("/:id", updateSubmarca);
router.put("/:id/activo", setActivoSubmarca);

export default router;