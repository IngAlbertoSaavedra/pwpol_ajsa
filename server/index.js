import "dotenv/config";
import express from "express";
import cors from "cors";
import sql from "mssql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPool } from "./db/db.js";
import sucursalesRoutes from "./routes/sucursales.routes.js";
import empresasRoutes from "./routes/empresas.routes.js";

const app = express();
const PORT = 3001;

app.use("/api/empresas", empresasRoutes);
app.use(cors()); 
app.use(express.json());
app.use("/api/sucursales", sucursalesRoutes);

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

    const result = await pool.request()
        .input("usuario", sql.VarChar, usuario)
        .execute("sp_consultar_usuario");


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



app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
