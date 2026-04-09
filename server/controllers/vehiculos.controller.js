import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listVehiculos(req, res) {
  try {
    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando vehículos" });
  }
}

export async function getVehiculo(req, res) {
  try {
    const id = Number(req.params.id);

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: id },
    ]);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(404).json({ ok: false, msg: "Vehículo no encontrado" });
    }

    res.json({ ok: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error consultando vehículo" });
  }
}

export async function createVehiculo(req, res) {
  try {
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "clave", type: sql.VarChar(15), value: v.clave },
      { name: "placa", type: sql.VarChar(15), value: v.placa },
      { name: "anio", type: sql.Int, value: Number(v.anio) },
      { name: "rend_minimo", type: sql.Int, value: Number(v.rend_minimo) },
      { name: "rend_maximo", type: sql.Int, value: Number(v.rend_maximo) },
      { name: "id_modelo", type: sql.Int, value: Number(v.id_modelo) },
      {
        name: "id_empleado",
        type: sql.Int,
        value: v.id_empleado != null && v.id_empleado !== "" ? Number(v.id_empleado) : null,
      },
      { name: "id_sucursal", type: sql.Int, value: Number(v.id_sucursal) },
      { name: "id_combustible", type: sql.Int, value: Number(v.id_combustible) },
      { name: "chofer", type: sql.Bit, value: v.chofer ?? false },
      { name: "activo", type: sql.Bit, value: v.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error insertando vehículo",
    });
  }
}

export async function updateVehiculo(req, res) {
  try {
    const id = Number(req.params.id);
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "clave", type: sql.VarChar(15), value: v.clave },
      { name: "placa", type: sql.VarChar(15), value: v.placa },
      { name: "anio", type: sql.Int, value: Number(v.anio) },
      { name: "rend_minimo", type: sql.Int, value: Number(v.rend_minimo) },
      { name: "rend_maximo", type: sql.Int, value: Number(v.rend_maximo) },
      { name: "id_modelo", type: sql.Int, value: Number(v.id_modelo) },
      { name: "id_sucursal", type: sql.Int, value: Number(v.id_sucursal) },
      { name: "id_combustible", type: sql.Int, value: Number(v.id_combustible) },
      { name: "activo", type: sql.Bit, value: v.activo ?? true },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
      activo: v.activo ?? true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando vehículo",
    });
  }
}

export async function changeDriver(req, res) {
  try {
    const id = Number(req.params.id);
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "SET_CHOFER" },
      { name: "id", type: sql.Int, value: id },
      {
        name: "id_empleado",
        type: sql.Int,
        value: v.id_empleado != null && v.id_empleado !== "" ? Number(v.id_empleado) : null,
      },
      { name: "chofer", type: sql.Bit, value: v.chofer ?? false },
    ]);

    res.json({
      ok: true,
      id: result.recordset?.[0]?.id ?? id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error actualizando chofer",
    });
  }
}

export async function setActivoVehiculo(req, res) {
  try {
    const id = Number(req.params.id);
    const { activo } = req.body;

    const result = await execSp("sp_vehiculos", [
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
      msg: err?.message || "Error actualizando estatus de vehículo",
    });
  }
}