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

function normalizarIds(ids) {
  if (!Array.isArray(ids)) return "";

  return ids
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0)
    .join(",");
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
      { name: "usuario", type: sql.VarChar(50), value: null },
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
      { name: "usuario", type: sql.VarChar(50), value: null },
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

export async function listDeleteCargas(req, res) {
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
      { name: "accion", type: sql.VarChar(20), value: "LIST_DELETE" },
      { name: "usuario", type: sql.VarChar(50), value: null },
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

    const empleado = result.recordsets?.[0]?.[0] ?? null;
    const vehiculo = result.recordsets?.[1]?.[0] ?? null;
    const cargas = result.recordsets?.[2] ?? [];

    if (!vehiculo) {
      return res.status(404).json({
        ok: false,
        msg: "Unidad no encontrada",
      });
    }

    res.json({
      ok: true,
      data: {
        empleado,
        vehiculo,
        cargas,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando cargas de la unidad",
    });
  }
}

export async function deleteCargas(req, res) {
  try {
    const payload = req.body ?? {};

    const ids = normalizarIds(payload.ids);
    const comentario = String(payload.comentario ?? "").trim().toUpperCase();
    const usuario = limpiarTexto(payload.usuario);

    if (!ids) {
      return res.status(400).json({
        ok: false,
        msg: "Debes seleccionar al menos una carga",
      });
    }

    if (comentario.length < 15) {
      return res.status(400).json({
        ok: false,
        msg: "El motivo es obligatorio y debe tener al menos 15 caracteres",
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontró el usuario logeado",
      });
    }

    const result = await execSp("sp_cargas_combustible", [
      { name: "accion", type: sql.VarChar(20), value: "DELETE_CARGAS" },
      { name: "usuario", type: sql.VarChar(50), value: usuario },
      { name: "id", type: sql.Int, value: null },
      { name: "id_vehiculo", type: sql.Int, value: null },
      { name: "clave", type: sql.VarChar(15), value: null },
      { name: "placa", type: sql.VarChar(15), value: null },
      { name: "fecha", type: sql.Date, value: null },
      { name: "hora", type: sql.Time, value: null },
      { name: "odometro", type: sql.Int, value: null },
      { name: "litros", type: sql.Float, value: null },
      { name: "importe", type: sql.Float, value: null },
      { name: "ids", type: sql.VarChar(sql.MAX), value: ids },
      { name: "comentario", type: sql.VarChar(250), value: comentario },
      { name: "id_empleado", type: sql.Int, value: null },
    ]);

    res.json({
      ok: true,
      data: result.recordset?.[0] ?? null,
      msg: "Cargas eliminadas correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error eliminando cargas",
    });
  }
}