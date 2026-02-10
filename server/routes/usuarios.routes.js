import { Router } from "express";
import { listUsuarios
    , createUsuario
    , updateUsuario 
} from "server/controllers/usuarios.controller";

const router = Router();

router.get("/", listUsuarios);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);

export default router;