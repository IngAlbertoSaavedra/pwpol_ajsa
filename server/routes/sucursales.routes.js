import { Router } from "express";
import { listSucursales, createSucursal, updateSucursal } from "../controllers/sucursales.controller.js";

const router = Router();

router.get("/", listSucursales);
router.post("/", createSucursal);
router.put("/:id", updateSucursal);

export default router;
