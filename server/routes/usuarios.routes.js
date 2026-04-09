import { Router } from "express";
import {
  listUsuarios,
  getEmpleadoByNomina,
  createUsuario,
  updateUsuario,
  updateActivarUsuario,
  updateClave,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", listUsuarios);
router.get("/empleado/:nomina", getEmpleadoByNomina);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.put("/:id/activar", updateActivarUsuario);
router.put("/:id/clave", updateClave);

export default router;