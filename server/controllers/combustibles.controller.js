import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listCombustibles(req, res) {
  try {
    const result = await execSp("sp_combustibles", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando combustibles" });
  }
}

export async function listCombustiblesCombo(req, res) {
  try {
    const result = await execSp("sp_combustibles", [
      { name: "accion", type: sql.VarChar(20), value: "COMBO" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando combustibles activos" });
  }
}

export async function getCombustible(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await execSp("sp_combustibles", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: id },
    ]);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ ok: false, msg: "Combustible no encontrado" });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando combustible" });
  }
}

export async function createCombustible(req, res) {
  try {
    const c = req.body;

    const result = await execSp("sp_combustibles", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nombre", type: sql.VarChar(50), value: c.nombre },
      { name: "activo", type: sql.Bit, value: c.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error insertando combustible",
    });
  }
}

export async function updateCombustible(req, res) {
  try {
    const id = Number(req.params.id);
    const c = req.body;

    const result = await execSp("sp_combustibles", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "nombre", type: sql.VarChar(50), value: c.nombre },
      { name: "activo", type: sql.Bit, value: c.activo ?? true },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activo: c.activo ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando combustible",
    });
  }
}

export async function setActivoCombustible(req, res) {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body;

    const result = await execSp("sp_combustibles", [
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
      msg: err?.message || "Error actualizando estatus de combustible",
    });
  }
}