import { Router } from "express";
import { listMarcas, listMarcasCombo, getMarca, createMarca, updateMarca, setActivoMarca } from "../controllers/marcas.controller.js";

const router = Router();

router.get("/", listMarcas);
router.get("/combo", listMarcasCombo);
router.get("/:id", getMarca);

router.post("/", createMarca);
router.put("/:id", updateMarca);
router.put("/:id/activo", setActivoMarca);

export default router;
