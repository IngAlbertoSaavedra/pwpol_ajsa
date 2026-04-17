import { execSp } from "../db/execSp.js";
import sql from "mssql";

// listar perfiles activos
export async function listPerfiles(req, res) {
  try {
    const result = await execSp("sp_permisos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST_PERFILES" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error listando perfiles",
    });
  }
}

// listar modulos y opciones activas
export async function listModulos(req, res) {
  try {
    const result = await execSp("sp_permisos", [
      { name: "accion", type: sql.VarChar(20), value: "LIST_MODULOS" },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error listando modulos",
    });
  }
}

// obtener permisos por perfil
export async function getPermisosByPerfil(req, res) {
  try {
    const id_perfil = Number(req.params.id);

    if (!id_perfil) {
      return res.status(400).json({
        ok: false,
        msg: "El id del perfil es obligatorio",
      });
    }

    const result = await execSp("sp_permisos", [
      { name: "accion", type: sql.VarChar(20), value: "GET" },
      { name: "id_perfil", type: sql.Int, value: id_perfil },
    ]);

    res.json({ ok: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error consultando permisos del perfil",
    });
  }
}

// guardar permiso
export async function savePermiso(req, res) {
  try {
    const id_perfil = Number(req.body.id_perfil);
    const id_opcion = Number(req.body.id_opcion);
    const activo = req.body.activo;

    if (!id_perfil) {
      return res.status(400).json({
        ok: false,
        msg: "El id_perfil es obligatorio",
      });
    }

    if (!id_opcion) {
      return res.status(400).json({
        ok: false,
        msg: "El id_opcion es obligatorio",
      });
    }

    if (activo === undefined || activo === null) {
      return res.status(400).json({
        ok: false,
        msg: "El activo es obligatorio",
      });
    }

    const result = await execSp("sp_permisos", [
      { name: "accion", type: sql.VarChar(20), value: "SAVE" },
      { name: "id_perfil", type: sql.Int, value: id_perfil },
      { name: "id_opcion", type: sql.Int, value: id_opcion },
      { name: "activo", type: sql.Bit, value: activo ? 1 : 0 },
    ]);

    res.json({
      ok: true,
      data: result.recordset?.[0] ?? null,
      msg: "Permiso actualizado correctamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: err?.message || "Error guardando permiso",
    });
  }
}