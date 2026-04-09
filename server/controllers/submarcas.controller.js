import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listSubmarcas(req, res) {
  try {
    const result = await execSp("sp_submarcas", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando submarcas" });
  }
}

export async function listSubmarcasCombo(req, res) {
  try {
    const idMarca = req.query.id_marca ? Number(req.query.id_marca) : null;

    const params = [
      { name: "accion", type: sql.VarChar(20), value: "COMBO" },
    ];

    if (idMarca !== null && !Number.isNaN(idMarca)) {
      params.push({
        name: "id_marca",
        type: sql.TinyInt,
        value: idMarca,
      });
    }

    const result = await execSp("sp_submarcas", params);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando submarcas activas" });
  }
}

export async function getSubmarca(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await execSp("sp_submarcas", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: id },
    ]);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ ok: false, msg: "Submarca no encontrada" });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando submarca" });
  }
}

export async function createSubmarca(req, res) {
  try {
    const s = req.body;

    const result = await execSp("sp_submarcas", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "id_marca", type: sql.TinyInt, value: Number(s.id_marca) },
      { name: "submarca", type: sql.VarChar(50), value: s.submarca },
      { name: "activa", type: sql.Bit, value: s.activa ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error insertando submarca",
    });
  }
}

export async function updateSubmarca(req, res) {
  try {
    const id = Number(req.params.id);
    const s = req.body;

    const result = await execSp("sp_submarcas", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "id_marca", type: sql.TinyInt, value: Number(s.id_marca) },
      { name: "submarca", type: sql.VarChar(50), value: s.submarca },
      { name: "activa", type: sql.Bit, value: s.activa ?? true },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activa: s.activa ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando submarca",
    });
  }
}

export async function setActivoSubmarca(req, res) {
  try {
    const id = Number(req.params.id);
    const { activa } = req.body;

    const result = await execSp("sp_submarcas", [
      { name: "accion", type: sql.VarChar(20), value: "SET_ACTIVO" },
      { name: "id", type: sql.Int, value: id },
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
      msg: err?.message || "Error actualizando estatus de submarca",
    });
  }
}