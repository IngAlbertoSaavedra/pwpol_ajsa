// D:\Repositorios\pwpol_ajsa\server\index.js
import express from "express";
import cors from "cors";
import { getPool } from "./db.js";

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

    // Importante: query parametrizada para evitar SQL Injection
    const result = await pool
      .request()
      .input("usuario", usuario)
      .input("clave", clave)
      .query(`
        SELECT TOP 1 id, id_empleado, id_perfil, usuario, activo
        FROM usuarios
        WHERE usuario = @usuario
          AND clave = @clave AND activo = 1
      `);

    const row = result.recordset?.[0];

    if (!row) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    if (row.activo !== true && row.activo !== 1) {
      return res.status(403).json({ message: "Usuario inactivo. Contacta al administrador." });
    }

    // Sesión simple (para clase). Para algo serio: JWT + hash de claves.
    const session = {
      user: {
        id: row.id,
        id_empleado: row.id_empleado,
        id_perfil: row.id_perfil,
        usuario: row.usuario,
      },
      createdAt: new Date().toISOString(),
    };

    return res.json({ session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error de servidor al validar credenciales." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
