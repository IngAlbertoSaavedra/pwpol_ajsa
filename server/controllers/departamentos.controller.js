import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listDepartamentos(req, res) {
  try {
    const result = await execSp("sp_departamentos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST"},
    ]); 

    res.json({ ok: true, data: result.recordset });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando departamentos" });
  }
}


export async function createDepartamento(req, res) {
  try {
    const e = req.body;

    const result = await execSp("sp_departamentos", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando Departamento" });
  }
}

export async function updateDepartamento(req, res) {
  try {
    const id = Number(req.params.id);
    const e = req.body;

    const result = await execSp("sp_departamentos", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.TinyInt, value: id },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando Departamento" });
  }
}
