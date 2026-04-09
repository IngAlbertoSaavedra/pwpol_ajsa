import { Router } from "express";
import {
  listPerfiles,
  comboPerfiles,
  getPerfil,
  createPerfil,
  updatePerfil,
  setActivoPerfil,
} from "../controllers/perfiles.controller.js";

const router = Router();

router.get("/", listPerfiles);
router.get("/combo", comboPerfiles);
router.get("/:id", getPerfil);

router.post("/", createPerfil);
router.put("/:id", updatePerfil);
router.put("/:id/activo", setActivoPerfil);

export default router;