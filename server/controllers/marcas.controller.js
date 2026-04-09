import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listMarcas(req, res) {
  try {
    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando marcas" });
  }
}

export async function listMarcasCombo(req, res) {
  try {
    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "COMBO" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando marcas activas" });
  }
}

export async function getMarca(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.TinyInt, value: id },
    ]);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ ok: false, msg: "Marca no encontrada" });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando marca" });
  }
}

export async function createMarca(req, res) {
  try {
    const m = req.body;

    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "marca", type: sql.VarChar(50), value: m.marca },
      { name: "activa", type: sql.Bit, value: m.activa ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error insertando marca",
    });
  }
}

export async function updateMarca(req, res) {
  try {
    const id = Number(req.params.id);
    const m = req.body;

    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.TinyInt, value: id },
      { name: "marca", type: sql.VarChar(50), value: m.marca },
      { name: "activa", type: sql.Bit, value: m.activa ?? true },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activa: m.activa ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando marca",
    });
  }
}

export async function setActivoMarca(req, res) {
  try {
    const id = Number(req.params.id);
    const { activa } = req.body;

    const result = await execSp("sp_marcas", [
      { name: "accion", type: sql.VarChar(20), value: "SET_ACTIVO" },
      { name: "id", type: sql.TinyInt, value: id },
      { name: "activa", type: sql.Bit, value: activa },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activa: result.recordset?.[0]?.activa ?? activa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando estatus de marca",
    });
  }
}