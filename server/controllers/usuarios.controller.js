import { exceSP } from "..db/execSp.js";
import e from "express";
import sql from "mssql";


export async function listUsuarios(req, res) {
    try {
        const result = await exceSP("sp_usuarios", [
            { name: "accion", type: sql.VarChar(20), value: "LIST" },
        ]);

        res.json({ ok: true, data: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Error listando usuarios" });
    }
}

export async function createUsuario(req, res) {
    try {
        const u = req.body;

        const result = await exceSP("sp_usuarios", [
            {name: "accion", type: sql.VarChar(20), value: "INSERT" },
            {name: "id_empleado", type: sql.Int, value: u.id_empleado },
            {name: "usuario", type: sql.VarChar(50), value: u.usuario },
            {name: "clave", type: sql.VarChar(100), value: u.clave },
            {name: "activo", type: sql.Bit, value: u.activo ?? true }
            // pendiente password_hash
        ]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Error insertando usuario" });
    }

}

export async function updateUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        const u = req.body;

        const result = await exceSP("sp_usuarios", [
            {name: "accion", type: sql.VarChar(20), value: "UPDATE" },
            {name: "id", type: sql.Int, value: id },
            {name: "id_empleado", type: sql.Int, value: u.id_empleado },
            {name: "usuario", type: sql.VarChar(50), value: u.usuario },
            {name: "clave", type: sql.VarChar(100), value: u.clave },
            {name: "activo", type: sql.Bit, value: u.activo ?? true }
            // pendiente password_hash
        ]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: "Error actualizando usuario" });
    }
}