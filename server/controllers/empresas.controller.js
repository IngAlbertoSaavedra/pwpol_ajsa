import { execSp } from "../db/execSp.js";
import sql from "mssql";

export async function listEmpresas(req, res) {
  try {
    const result = await execSp("sp_empresas", [
      { name: "accion", type: sql.VarChar(20), value: "LIST"},
    ]); 

    res.json({ ok: true, data: result.recordset });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando empresas" });
  }
}


export async function createEmpresa(req, res) {
  try {
    const e = req.body;

    const result = await execSp("sp_empresas", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "ncorto", type: sql.VarChar(100), value: e.ncorto },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "rfc", type: sql.VarChar(30), value: e.rfc ?? null },
      { name: "presentacion", type: sql.TinyInt, value: e.presentacion ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error insertando Empresa" });
  }
}

export async function updateEmpresa(req, res) {
  try {
    const id = Number(req.params.id);
    const e = req.body;

    const result = await execSp("sp_empresas", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.TinyInt, value: id },
      { name: "ncorto", type: sql.VarChar(100), value: e.ncorto },
      { name: "nombre", type: sql.VarChar(200), value: e.nombre ?? null },
      { name: "presentacion", type: sql.TinyInt, value: e.presentacion ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error actualizando Empresa" });
  }
}
