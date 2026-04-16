import { Router } from "express";
import {
  consultRegistroCarga,
  createRegistroCarga,
} from "../controllers/registrocargas.controller.js";

const router = Router();

router.get("/consulta", consultRegistroCarga);
router.post("/", createRegistroCarga);

export default router;