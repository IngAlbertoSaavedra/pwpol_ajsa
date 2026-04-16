import { execSp } from "../db/execSp.js";
import sql from "mssql";

function limpiarTexto(valor) {
  return String(valor ?? "").trim().toUpperCase();
}

function armarRespuestaConsulta(result) {
  const vehiculo = result.recordsets?.[0]?.[0] ?? null;
  const historico_asignaciones = result.recordsets?.[1] ?? [];
  const historico_cargas = result.recordsets?.[2] ?? [];

  return {
    vehiculo,
    historico_asignaciones,
    historico_cargas,
  };
}

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

export async function consultVehiculo(req, res) {
  try {
    const clave = limpiarTexto(req.query.clave);
    const placa = limpiarTexto(req.query.placa);

    if (!clave && !placa) {
      return res.status(400).json({
        ok: false,
        msg: "Debes indicar la clave o la placa",
      });
    }

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: null },
      { name: "clave", type: sql.VarChar(15), value: clave || null },
      { name: "placa", type: sql.VarChar(15), value: placa || null },
    ]);

    const data = armarRespuestaConsulta(result);

    if (!data.vehiculo) {
      return res.status(404).json({
        ok: false,
        msg: "Unidad no encontrada",
      });
    }

    res.json({
      ok: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando vehículo",
    });
  }
}

export async function getVehiculo(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        msg: "El id del vehículo no es válido",
      });
    }

    const listResult = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST" },
    ]);

    const vehiculoBase = (listResult.recordset ?? []).find((item) => Number(item.id) === id);

    if (!vehiculoBase) {
      return res.status(404).json({
        ok: false,
        msg: "Vehículo no encontrado",
      });
    }

    const result = await execSp("sp_vehiculos", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id", type: sql.Int, value: null },
      { name: "clave", type: sql.VarChar(15), value: limpiarTexto(vehiculoBase.clave) || null },
      { name: "placa", type: sql.VarChar(15), value: null },
    ]);

    const data = armarRespuestaConsulta(result);

    if (!data.vehiculo) {
      return res.status(404).json({
        ok: false,
        msg: "Vehículo no encontrado",
      });
    }

    res.json({
      ok: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando vehículo",
    });
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