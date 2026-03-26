import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listEmpleados(req, res) {
  try {
    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando empleados" });
  }
}

export async function createEmpleado(req, res) {
  try {
    const e = req.body;

    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nomina", type: sql.Int, value: e.nomina ?? null },
      { name: "nombres", type: sql.VarChar(60), value: e.nombres ?? null },
      { name: "apellido_p", type: sql.VarChar(60), value: e.apellido_p ?? null },
      { name: "apellido_m", type: sql.VarChar(60), value: e.apellido_m ?? null },
      { name: "curp", type: sql.VarChar(60), value: e.curp ?? null },
      { name: "rfc", type: sql.VarChar(15), value: e.rfc ?? null },
      { name: "fecha_ingreso", type: sql.VarChar(60), value: e.fecha_ingreso ?? null },
      { name: "fecha_salida", type: sql.VarChar(60), value: e.fecha_salida ?? null },
      { name: "foto", type: sql.VarChar(60), value: e.foto ?? null },
      { name: "id_puesto", type: sql.Int, value: e.id_puesto ?? null },
      { name: "id_sucursal", type: sql.Int, value: e.id_sucursal ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando Empleado" });
  }
}

export async function updateEmpleado(req, res) {
  try {
    const id = Number(req.params.id);
    const e = req.body;

    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "nomina", type: sql.Int, value: e.nomina ?? null },
      { name: "nombres", type: sql.VarChar(60), value: e.nombres ?? null },
      { name: "apellido_p", type: sql.VarChar(60), value: e.apellido_p ?? null },
      { name: "apellido_m", type: sql.VarChar(60), value: e.apellido_m ?? null },
      { name: "curp", type: sql.VarChar(60), value: e.curp ?? null },
      { name: "rfc", type: sql.VarChar(15), value: e.rfc ?? null },
      { name: "fecha_ingreso", type: sql.VarChar(60), value: e.fecha_ingreso ?? null },
      { name: "fecha_salida", type: sql.VarChar(60), value: e.fecha_salida ?? null },
      { name: "foto", type: sql.VarChar(60), value: e.foto ?? null },
      { name: "id_puesto", type: sql.Int, value: e.id_puesto ?? null },
      { name: "id_sucursal", type: sql.Int, value: e.id_sucursal ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando Empleado" });
  }
}