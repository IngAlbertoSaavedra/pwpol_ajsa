
import { Router } from "express";
import { listDepartamentos, createDepartamento, updateDepartamento } from "../controllers/departamentos.controller.js";

const router = Router();

router.get("/", listDepartamentos);
router.post("/", createDepartamento);
router.put("/:id", updateDepartamento);

export default router;
