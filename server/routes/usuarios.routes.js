import { Router } from "express";
import { 
    listUsuarios
    , createUsuario
    , updateUsuario 
    , updateActivarUsuario  
    , updateClave
} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", listUsuarios);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.put("/:id/activar", updateActivarUsuario);
router.put("/:id/clave", updateClave);

export default router;