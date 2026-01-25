import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listSucursales(req, res) {
  try {
    const result = await execSp("sp_sucursales", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando sucursales" });
  }
}

export async function createSucursal(req, res) {
  try {
    const s = req.body;

    const result = await execSp("sp_sucursales", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nombre", type: sql.VarChar(100), value: s.nombre },
      { name: "domicilio", type: sql.VarChar(200), value: s.domicilio ?? null },
      { name: "telefono1", type: sql.VarChar(30), value: s.telefono1 ?? null },
      { name: "telefono2", type: sql.VarChar(30), value: s.telefono2 ?? null },
      { name: "extension", type: sql.VarChar(4), value: s.extension ?? null },
      { name: "correo", type: sql.VarChar(200), value: s.correo ?? null },
      { name: "altitud", type: sql.Float, value: s.altitud ?? null },
      { name: "latitud", type: sql.Float, value: s.latitud ?? null },
      { name: "r_social", type: sql.TinyInt, value: s.r_social ?? null },
      { name: "activo", type: sql.Bit, value: s.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando sucursal" });
  }
}

export async function updateSucursal(req, res) {
  try {
    const id = Number(req.params.id);
    const s = req.body;

    const result = await execSp("sp_sucursales", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "nombre", type: sql.VarChar(100), value: s.nombre },
      { name: "domicilio", type: sql.VarChar(200), value: s.domicilio ?? null },
      { name: "telefono1", type: sql.VarChar(30), value: s.telefono1 ?? null },
      { name: "telefono2", type: sql.VarChar(30), value: s.telefono2 ?? null },
      { name: "extension", type: sql.VarChar(4), value: s.extension ?? null },
      { name: "correo", type: sql.VarChar(200), value: s.correo ?? null },
      { name: "altitud", type: sql.Float, value: s.altitud ?? null },
      { name: "latitud", type: sql.Float, value: s.latitud ?? null },
      { name: "r_social", type: sql.TinyInt, value: s.r_social ?? null },
      { name: "activo", type: sql.Bit, value: s.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando sucursal" });
  }
}
