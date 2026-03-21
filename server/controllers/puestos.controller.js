import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listPuestos(req, res) {
  try {
    const result = await execSp("sp_puestos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST"},
    ]); 

    res.json({ ok: true, data: result.recordset });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando puestos" });
  }
}


export async function createPuesto(req, res) {
  try {
    const e = req.body;

    const result = await execSp("sp_puestos", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "sueldo_base", type: sql.Decimal(18, 2), value: e.sueldo_base ?? null },
      { name: "bono", type: sql.Decimal(18, 2), value: e.bono ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando Puesto" });
  }
}

export async function updatePuesto(req, res) {
  try {
    const id = Number(req.params.id);
    const e = req.body;

    const result = await execSp("sp_puestos", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.TinyInt, value: id },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "sueldo_base", type: sql.Decimal(18, 2), value: e.sueldo_base ?? null },
      { name: "bono", type: sql.Decimal(18, 2), value: e.bono ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando Puesto" });
  }
}
