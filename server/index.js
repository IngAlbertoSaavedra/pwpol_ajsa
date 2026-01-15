import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "mssql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getPool } from "./db.js";
// Middleware para rutas protegidas
import { authRequired } from "./authRequired.js";

const app = express();
app.use(cors()); // en producción restringe el origen
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const usuario = String(req.body?.usuario || "").trim();
  const clave = String(req.body?.clave || "");

  if (!usuario || !clave) {
    return res.status(400).json({ message: "Usuario y contraseña son obligatorios." });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("usuario", sql.VarChar(50), usuario)
      .query(`
        SELECT TOP 1 id, id_empleado, id_perfil, usuario, clave, activo
        FROM dbo.Usuarios
        WHERE usuario = @usuario
      `);

    const row = result.recordset?.[0];

    if (!row) return res.status(401).json({ message: "Credenciales inválidas." });
    if (row.activo !== true && row.activo !== 1) {
      return res.status(403).json({ message: "Usuario inactivo. Contacta al administrador." });
    }

    const ok = await bcrypt.compare(clave, row.clave);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas." });

    const token = jwt.sign(
      { uid: row.id, id_empleado: row.id_empleado, id_perfil: row.id_perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return res.json({
      token,
      user: {
        id: row.id,
        id_empleado: row.id_empleado,
        id_perfil: row.id_perfil,
        usuario: row.usuario,
      },
    });
  } catch (err) {
    console.error("ERROR DE LOGIN", err);
    return res.status(500).json({ message: "Error de servidor al validar credenciales." });
  }
});


app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Ruta protegida de ejemplo
app.get("/api/me", authRequired, (req, res) => {
  return res.json({ user: req.user });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
