import { execSp } from "../db/execSp.js";
import sql from "mssql";

const MAX_FOTO_BYTES = 1024 * 1024;
const MIME_VALIDOS = ["image/png", "image/jpg", "image/jpeg"];

function bufferToBase64(row) {
  if (!row?.foto) return null;

  const buffer = Buffer.isBuffer(row.foto)
    ? row.foto
    : row.foto?.type === "Buffer" && Array.isArray(row.foto.data)
    ? Buffer.from(row.foto.data)
    : null;

  if (!buffer) return null;

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

function normalizarEmpleados(rows = []) {
  return rows.map((row) => ({
    ...row,
    foto_base64: bufferToBase64(row),
  }));
}

function convertirBase64ABuffer(foto) {
  if (!foto) return null;

  if (typeof foto !== "object") {
    throw new Error("Formato de foto inválido");
  }

  const mimeType = String(foto.mimeType || "").toLowerCase().trim();
  const base64 = String(foto.base64 || "").trim();

  if (!MIME_VALIDOS.includes(mimeType)) {
    throw new Error("La foto debe ser un archivo PNG o JPG");
  }

  if (!base64) {
    throw new Error("La foto no contiene información válida");
  }

  const buffer = Buffer.from(base64, "base64");

  if (!buffer.length) {
    throw new Error("La foto no contiene información válida");
  }

  if (buffer.length > MAX_FOTO_BYTES) {
    throw new Error("La foto no debe ser mayor a 1 MB");
  }

  return buffer;
}

function prepararFotoParaSP(foto, esUpdate = false) {
  if (foto === undefined) {
    return null;
  }

  if (foto === null || foto === "") {
    return null;
  }

  if (esUpdate && typeof foto === "string") {
    return null;
  }

  return convertirBase64ABuffer(foto);
}

export async function listEmpleados(req, res) {
  try {
    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    const data = normalizarEmpleados(result.recordset || []);

    res.json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error listando empleados" });
  }
}

export async function createEmpleado(req, res) {
  try {
    const e = req.body;
    const fotoBuffer = prepararFotoParaSP(e.foto, false);

    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "nomina", type: sql.Int, value: e.nomina ?? null },
      { name: "nombres", type: sql.VarChar(60), value: e.nombres ?? null },
      { name: "apellido_p", type: sql.VarChar(60), value: e.apellido_p ?? null },
      { name: "apellido_m", type: sql.VarChar(60), value: e.apellido_m ?? null },
      { name: "curp", type: sql.VarChar(60), value: e.curp ?? null },
      { name: "rfc", type: sql.VarChar(60), value: e.rfc ?? null },
      { name: "fecha_ingreso", type: sql.VarChar(60), value: e.fecha_ingreso ?? null },
      { name: "fecha_salida", type: sql.VarChar(60), value: e.fecha_salida ?? null },
      { name: "foto", type: sql.VarBinary(sql.MAX), value: fotoBuffer },
      { name: "id_puesto", type: sql.Int, value: e.id_puesto ?? null },
      { name: "id_sucursal", type: sql.Int, value: e.id_sucursal ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err.message || "Error insertando empleado" });
  }
}

export async function updateEmpleado(req, res) {
  try {
    const id = Number(req.params.id);
    const e = req.body;
    const fotoBuffer = prepararFotoParaSP(e.foto, true);

    const result = await execSp("sp_empleados", [
      { name: "accion", type: sql.VarChar(20), value: "UPDATE" },
      { name: "id", type: sql.Int, value: id },
      { name: "nomina", type: sql.Int, value: e.nomina ?? null },
      { name: "nombres", type: sql.VarChar(60), value: e.nombres ?? null },
      { name: "apellido_p", type: sql.VarChar(60), value: e.apellido_p ?? null },
      { name: "apellido_m", type: sql.VarChar(60), value: e.apellido_m ?? null },
      { name: "curp", type: sql.VarChar(60), value: e.curp ?? null },
      { name: "rfc", type: sql.VarChar(60), value: e.rfc ?? null },
      { name: "fecha_ingreso", type: sql.VarChar(60), value: e.fecha_ingreso ?? null },
      { name: "fecha_salida", type: sql.VarChar(60), value: e.fecha_salida ?? null },
      { name: "foto", type: sql.VarBinary(sql.MAX), value: fotoBuffer },
      { name: "id_puesto", type: sql.Int, value: e.id_puesto ?? null },
      { name: "id_sucursal", type: sql.Int, value: e.id_sucursal ?? null },
      { name: "activo", type: sql.Bit, value: e.activo ?? true },
    ]);

    res.json({ ok: true, id: result.recordset?.[0]?.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: err.message || "Error actualizando empleado" });
  }
}