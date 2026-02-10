import { execSp } from "server/db/execSp";

export async function listUsuarios(req, res) {
    try {
        const result = await execSp("sp_empleados", []);
        res.json({ ok: true, data: result.recordset});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ok: false, msg: "Error en lista de Empleados"});
    }
    
}