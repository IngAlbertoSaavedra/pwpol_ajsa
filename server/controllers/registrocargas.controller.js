import { execSp } from "../db/execSp.js";
import sql from "mssql";

function limpiarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function normalizarFecha(valor) {
  const texto = String(valor ?? "").trim();
  return texto || null;
}

function normalizarHora(valor) {
  const texto = String(valor ?? "").trim();
  return texto || null;
}

function normalizarNumero(valor, permitirDecimal = false) {
  if (valor === null || valor === undefined || valor === "") return null;

  const numero = permitirDecimal ? Number(valor) : parseInt(valor, 10);

  if (Number.isNaN(numero)) return null;

  return numero;
}

export async function consultRegistroCarga(req, res) {
  try {
    const clave = limpiarTexto(req.query.clave);
    const placa = limpiarTexto(req.query.placa);

    if (!clave && !placa) {
      return res.status(400).json({
        ok: false,
        msg: "Debes indicar la clave o la placa",
      });
    }

    const result = await execSp("sp_cargas_combustible", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: null },
      { name: "id_vehiculo", type: sql.Int, value: null },
      { name: "clave", type: sql.VarChar(15), value: clave || null },
      { name: "placa", type: sql.VarChar(15), value: placa || null },
      { name: "fecha", type: sql.Date, value: null },
      { name: "hora", type: sql.Time, value: null },
      { name: "odometro", type: sql.Int, value: null },
      { name: "litros", type: sql.Float, value: null },
      { name: "importe", type: sql.Float, value: null },
      { name: "ids", type: sql.VarChar(sql.MAX), value: null },
      { name: "comentario", type: sql.VarChar(250), value: null },
      { name: "id_empleado", type: sql.Int, value: null },
    ]);

    const vehiculo = result.recordset?.[0] ?? null;

    if (!vehiculo) {
      return res.status(404).json({
        ok: false,
        msg: "Unidad no encontrada",
      });
    }

    res.json({
      ok: true,
      data: vehiculo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando unidad",
    });
  }
}

export async function createRegistroCarga(req, res) {
  try {
    const v = req.body;

    const payload = {
      id_vehiculo: normalizarNumero(v.id_vehiculo),
      clave: limpiarTexto(v.clave),
      placa: limpiarTexto(v.placa),
      fecha: normalizarFecha(v.fecha),
      hora: normalizarHora(v.hora),
      odometro: normalizarNumero(v.odometro),
      litros: normalizarNumero(v.litros, true),
      importe: normalizarNumero(v.importe, true),
    };

    const result = await execSp("sp_cargas_combustible", [
      { name: "accion", type: sql.VarChar(20), value: "INSERT" },
      { name: "id", type: sql.Int, value: null },
      { name: "id_vehiculo", type: sql.Int, value: payload.id_vehiculo },
      { name: "clave", type: sql.VarChar(15), value: payload.clave || null },
      { name: "placa", type: sql.VarChar(15), value: payload.placa || null },
      { name: "fecha", type: sql.Date, value: payload.fecha },
      { name: "hora", type: sql.Time, value: payload.hora },
      { name: "odometro", type: sql.Int, value: payload.odometro },
      { name: "litros", type: sql.Float, value: payload.litros },
      { name: "importe", type: sql.Float, value: payload.importe },
      { name: "ids", type: sql.VarChar(sql.MAX), value: null },
      { name: "comentario", type: sql.VarChar(250), value: null },
      { name: "id_empleado", type: sql.Int, value: null },
    ]);

    res.json({
      ok: true,
      data: result.recordset?.[0] ?? null,
      msg: "Carga registrada correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error registrando carga",
    });
  }
}