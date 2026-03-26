import { execSp } from "../db/execSp.js";
import sql from "mssql";
import bcrypt from "bcrypt";


const SALT_ROUNDS = 10;



export async function listUsuarios(req, res) {
  try {
    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "LIST"},
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
    
    const hash = await bcrypt.hash(u.clave, SALT_ROUNDS);
    
    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "id_empleado", type: sql.Int, value: u.id_empleado ?? null },
      { name: "id_perfil", type: sql.Int, value: u.id_perfil ?? null },
      { name: "usuario", type: sql.VarChar(50), value: u.usuario ?? null },
      { name: "clave", type: sql.VarChar(100), value: hash },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando Usuario" });
  }
}

export async function updateUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE USER" },
      { name: "id", type: sql.Int, value: id },
      { name: "id_empleado", type: sql.Int, value: u.id_empleado ?? null },
      { name: "id_perfil", type: sql.Int, value: u.id_perfil ?? null },
      { name: "usuario", type: sql.VarChar(50), value: u.usuario ?? null },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando Usuario" });
  }
}

export async function updateClave(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;
    const hash = await bcrypt.hash(u.clave, SALT_ROUNDS);
    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE PASS" },
      { name: "id", type: sql.Int, value: id },
      { name: "clave", type: sql.VarChar(100), value: hash },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando clave de usuario" });
  }
}

export async function updateActivarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "SET_ACTIVO" },
      { name: "id", type: sql.Int, value: id },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando estado de usuario" });
  }
}
