// routes/empresas.routes.js
import { Router } from "express";
import { listEmpresas, createEmpresa, updateEmpresa } from "../controllers/empresas.controller.js";

const router = Router();

router.get("/", listEmpresas);
router.post("/", createEmpresa);
router.put("/:id", updateEmpresa);

export default router;
