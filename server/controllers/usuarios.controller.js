import { execSp } from "../db/execSp.js";
import sql from "mssql";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

function usuarioValido(usuario = "") {
  return /^[a-zA-Z]+$/.test(String(usuario).trim());
}

export async function listUsuarios(req, res) {
  try {
    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando usuarios" });
  }
}

export async function getEmpleadoByNomina(req, res) {
  try {
    const nomina = Number(req.params.nomina);

    if (!Number.isInteger(nomina) || nomina <= 0) {
      return res.status(400).json({ ok: false, msg: "La nomina es invalida" });
    }

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "GET EMPLEADO" },
      { name: "nomina", type: sql.Int, value: nomina },
    ]);

    const empleado = result.recordset?.[0];

    if (!empleado) {
      return res.status(404).json({ ok: false, msg: "No se encontro el empleado" });
    }

    if (!empleado.activo) {
      return res.status(400).json({ ok: false, msg: "El empleado no esta activo" });
    }

    res.json({ ok: true, data: empleado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando empleado" });
  }
}

export async function createUsuario(req, res) {
  try {
    const u = req.body;

    if (!u.id_empleado) {
      return res.status(400).json({ ok: false, msg: "El empleado es obligatorio" });
    }

    if (!u.id_perfil) {
      return res.status(400).json({ ok: false, msg: "El perfil es obligatorio" });
    }

    if (!String(u.usuario ?? "").trim()) {
      return res.status(400).json({ ok: false, msg: "El usuario es obligatorio" });
    }

    if (!usuarioValido(u.usuario)) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario solo puede contener letras sin espacios, numeros ni caracteres especiales",
      });
    }

    if (!String(u.clave ?? "").trim()) {
      return res.status(400).json({ ok: false, msg: "La contraseña es obligatoria" });
    }

    if (String(u.clave).length < 6) {
      return res.status(400).json({ ok: false, msg: "La contraseña debe tener minimo 6 caracteres" });
    }

    const hash = await bcrypt.hash(u.clave, SALT_ROUNDS);

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "id_empleado", type: sql.Int, value: Number(u.id_empleado) || null },
      { name: "id_perfil", type: sql.Int, value: Number(u.id_perfil) || null },
      { name: "usuario", type: sql.VarChar(50), value: String(u.usuario ?? "").trim() },
      { name: "clave", type: sql.VarChar(100), value: hash },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err?.originalError?.info?.message || "Error insertando Usuario" });
  }
}

export async function updateUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, msg: "El id es invalido" });
    }

    if (!u.id_empleado) {
      return res.status(400).json({ ok: false, msg: "El empleado es obligatorio" });
    }

    if (!u.id_perfil) {
      return res.status(400).json({ ok: false, msg: "El perfil es obligatorio" });
    }

    if (!String(u.usuario ?? "").trim()) {
      return res.status(400).json({ ok: false, msg: "El usuario es obligatorio" });
    }

    if (!usuarioValido(u.usuario)) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario solo puede contener letras sin espacios, numeros ni caracteres especiales",
      });
    }

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE USER" },
      { name: "id", type: sql.Int, value: id },
      { name: "id_empleado", type: sql.Int, value: Number(u.id_empleado) || null },
      { name: "id_perfil", type: sql.Int, value: Number(u.id_perfil) || null },
      { name: "usuario", type: sql.VarChar(50), value: String(u.usuario ?? "").trim() },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err?.originalError?.info?.message || "Error actualizando Usuario" });
  }
}

export async function updateClave(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, msg: "El id es invalido" });
    }

    if (!String(u.clave ?? "").trim()) {
      return res.status(400).json({ ok: false, msg: "La contraseña es obligatoria" });
    }

    if (String(u.clave).length < 6) {
      return res.status(400).json({ ok: false, msg: "La contraseña debe tener minimo 6 caracteres" });
    }

    const hash = await bcrypt.hash(u.clave, SALT_ROUNDS);

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE PASS" },
      { name: "id", type: sql.Int, value: id },
      { name: "clave", type: sql.VarChar(100), value: hash },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err?.originalError?.info?.message || "Error actualizando clave de usuario" });
  }
}

export async function updateActivarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const u = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, msg: "El id es invalido" });
    }

    const result = await execSp("sp_usuarios", [
      { name: "accion", type: sql.VarChar(20), value: "SET_ACTIVO" },
      { name: "id", type: sql.Int, value: id },
      { name: "activo", type: sql.Bit, value: u.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err?.originalError?.info?.message || "Error actualizando estado de usuario" });
  }
}