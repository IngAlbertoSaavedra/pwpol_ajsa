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

export async function createVehiculo(req, res) {
  try {
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "clave", type: sql.VarChar(15), value: v.clave },
      { name: "placa", type: sql.VarChar(15), value: v.placa },
      { name: "anio", type: sql.Int, value: v.anio },
      { name: "rend_minimo", type: sql.Int, value: v.rend_minimo },
      { name: "rend_maximo", type: sql.Int, value: v.rend_maximo },
      { name: "id_modelo", type: sql.Int, value: v.modelo },
      { name: "id_sucursal", type: sql.Int, value: v.id_sucursal },
      { name: "id_combustible", type: sql.Int, value: v.id_combustible }
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando vehículo" });
  }
}

export async function updateVehiculo(req, res) {
  try {
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: v.id },
      { name: "clave", type: sql.VarChar(15), value: v.clave },
      { name: "placa", type: sql.VarChar(15), value: v.placa },
      { name: "anio", type: sql.Int, value: v.anio },
      { name: "rend_minimo", type: sql.Int, value: v.rend_minimo },
      { name: "rend_maximo", type: sql.Int, value: v.rend_maximo },
      { name: "id_modelo", type: sql.Int, value: v.modelo },
      { name: "id_sucursal", type: sql.Int, value: v.id_sucursal },
      { name: "id_combustible", type: sql.Int, value: v.id_combustible },
      { name: "chofer", type: sql.Int, value: v.chofer }
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando vehículo" });
  }
}

export async function changeDriver(req, res) {
  try {
    const v = req.body;

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "SET_CHOFER" },
      { name: "id", type: sql.Int, value: v.id },
      { name: "id_empleado", type: sql.Int, value: v.id_empleado },
      { name: "chofer", type: sql.Int, value: v.chofer }
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error al asignar chofer" });
  }
}
