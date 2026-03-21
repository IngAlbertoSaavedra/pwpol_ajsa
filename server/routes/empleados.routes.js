
import { Router } from "express";
import { listEmpleados, createEmpleado, updateEmpleado } from "../controllers/empleados.controller.js";

const router = Router();

router.get("/", listEmpleados);
router.post("/", createEmpleado);
router.put("/:id", updateEmpleado);

export default router;
