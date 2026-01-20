import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "mssql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "./db.js";


const app = express();
app.use(cors()); 
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const usuario = String(req.body?.usuario || "").trim();
  const clave = String(req.body?.clave || "");

  if (!usuario || !clave) {
    return res.status(400).json({ message: "Usuario y contraseña son obligatorios." });
  }
  console.log("Intento de login:", usuario);
  console.log("Clave recibida:", clave);
  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("usuario", sql.VarChar(50), usuario)
      .query(`
          SELECT TOP 1 U.id, Emp.nombres, P.nombre as perfil, usuario, clave, U.activo
              FROM dbo.Usuarios as U
              Inner Join dbo.Empleados as Emp on Emp.id=U.id_empleado
              Inner Join dbo.Perfiles as P on P.id=U.id_perfil
              WHERE usuario = @usuario
      `);

    const row = result.recordset?.[0];

    if (!row) return res.status(401).json({ message: "Credenciales inválidas." });
    if (row.activo !== true && row.activo !== 1) {
      return res.status(403).json({ message: "Usuario inactivo. Marca a la extensión 736." });
    }

    const ok = await bcrypt.compare(clave, row.clave);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas." });

    const token = jwt.sign(
      { uid: row.id, empleado: row.nombres, perfil: row.perfil, usuario: row.usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    return res.json({
      token,
      user: {
        id: row.id,
        empleado: row.nombres,
        perfil: row.perfil,
        usuario: row.usuario,
      },
    });
  } catch (err) {
    console.error("ERROR DE LOGIN", err);
    return res.status(500).json({ message: "Error de servidor al validar credenciales." });
  }
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
