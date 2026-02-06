import { execSp } from "../db/execSp.js";

export async function listEmpresas(req, res) {
  try {
    const result = await execSp("sp_lista_empresas", []); 
    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando empresas" });
  }
}
