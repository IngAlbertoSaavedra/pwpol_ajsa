import { Router } from "express";
import { listEmpresas, createEmpresa, updateEmpresa, updateActivarEmpresa } from "../controllers/empresas.controller.js";

const router = Router();

router.get("/", listEmpresas);
router.post("/", createEmpresa);
router.put("/:id", updateEmpresa);
router.put("/:id/activar", updateActivarEmpresa);

export default router;
