import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listPerfiles(req, res) {
  try {
    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando perfiles" });
  }
}

export async function comboPerfiles(req, res) {
  try {
    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "COMBO" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando combo de perfiles" });
  }
}

export async function getPerfil(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: id },
    ]);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ ok: false, msg: "Perfil no encontrado" });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando perfil" });
  }
}

export async function createPerfil(req, res) {
  try {
    const p = req.body;

    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nombre", type: sql.VarChar(50), value: p.nombre },
      { name: "activo", type: sql.Bit, value: p.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error insertando perfil",
    });
  }
}

export async function updatePerfil(req, res) {
  try {
    const id = Number(req.params.id);
    const p = req.body;

    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "nombre", type: sql.VarChar(50), value: p.nombre },
      { name: "activo", type: sql.Bit, value: p.activo ?? true },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activo: p.activo ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando perfil",
    });
  }
}

export async function setActivoPerfil(req, res) {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body;

    const result = await execSp("sp_perfiles", [
      { name: "accion", type: sql.VarChar(20), value: "SET_ACTIVO" },
      { name: "id", type: sql.Int, value: id },
      { name: "activo", type: sql.Bit, value: activo },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activo: result.recordset?.[0]?.activo ?? activo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando estatus de perfil",
    });
  }
}