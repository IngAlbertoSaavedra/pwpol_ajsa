import { Router } from "express";
import {
  listPerfiles,
  listModulos,
  getPermisosByPerfil,
  savePermiso,
} from "../controllers/permisos.controller.js";

const router = Router();

router.get("/perfiles", listPerfiles);
router.get("/modulos", listModulos);
router.get("/:id", getPermisosByPerfil);
router.post("/", savePermiso);

export default router;