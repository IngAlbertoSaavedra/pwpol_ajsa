import { Router } from "express";
import {
  consultRegistroCarga,
  createRegistroCarga,
  listDeleteCargas,
  deleteCargas,
} from "../controllers/cargascombustible.controller.js";

const router = Router();

router.get("/consulta", consultRegistroCarga);
router.post("/", createRegistroCarga);

router.get("/eliminar/consulta", listDeleteCargas);
router.post("/eliminar", deleteCargas);

export default router;