// routes/empresas.routes.js
import { Router } from "express";
import { listEmpresas } from "../controllers/empresas.controller.js";

const router = Router();
router.get("/", listEmpresas);
export default router;
