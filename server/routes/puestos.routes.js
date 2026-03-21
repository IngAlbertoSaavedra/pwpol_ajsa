
import { Router } from "express";
import { listPuestos, createPuesto, updatePuesto } from "../controllers/puestos.controller.js";

const router = Router();

router.get("/", listPuestos);
router.post("/", createPuesto);
router.put("/:id", updatePuesto);

export default router;
