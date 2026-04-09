import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function buscarVehiculo(req, res) {
  try {
    const clave = String(req.query.clave || "").trim();

    const result = await execSp("sp_asignacion_vehiculo", [
      { name: "accion", type: sql.VarChar(20), value: "BUSCAR_VEHICULO" },
      { name: "clave", type: sql.VarChar(15), value: clave },
    ]);

    const row = result.recordset?.[0] ?? null;

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando vehículo",
    });
  }
}

export async function listChoferes(req, res) {
  try {
    const result = await execSp("sp_asignacion_vehiculo", [
      { name: "accion", type: sql.VarChar(20), value: "LIST_CHOFERES" },
    ]);

    res.json({ ok: true, data: result.recordset ?? [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error listando choferes",
    });
  }
}

export async function getChofer(req, res) {
  try {
    const idChofer = Number(req.params.id);

    const result = await execSp("sp_asignacion_vehiculo", [
      { name: "accion", type: sql.VarChar(20), value: "GET_CHOFER" },
      { name: "id_chofer", type: sql.Int, value: idChofer },
    ]);

    const row = result.recordset?.[0] ?? null;

    if (!row) {
      return res.status(404).json({
        ok: false,
        msg: "Chofer no encontrado",
      });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando chofer",
    });
  }
}

export async function asignarChofer(req, res) {
  try {
    const data = req.body;

    const result = await execSp("sp_asignacion_vehiculo", [
      { name: "accion", type: sql.VarChar(20), value: "ASIGNAR" },
      { name: "id_vehiculo", type: sql.Int, value: Number(data.id_vehiculo) },
      { name: "id_chofer", type: sql.Int, value: Number(data.id_chofer) },
      { name: "usuario", type: sql.VarChar(50), value: String(data.usuario || "").trim() },
      { name: "comentario", type: sql.NVarChar(1024), value: String(data.comentario || "").trim() },
    ]);

    res.json({
      ok: true,
      data: result.recordset?.[0] ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error asignando chofer",
    });
  }
}

export async function desasignarChofer(req, res) {
  try {
    const data = req.body;

    const result = await execSp("sp_asignacion_vehiculo", [
      { name: "accion", type: sql.VarChar(20), value: "DESASIGNAR" },
      { name: "id_vehiculo", type: sql.Int, value: Number(data.id_vehiculo) },
      { name: "usuario", type: sql.VarChar(50), value: String(data.usuario || "").trim() },
      { name: "comentario", type: sql.NVarChar(1024), value: String(data.comentario || "").trim() },
    ]);

    res.json({
      ok: true,
      data: result.recordset?.[0] ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error desasignando chofer",
    });
  }
}