
require("dotenv").config();
const bcrypt = require("bcrypt");
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function run() {
  try {
    await sql.connect(config);

    const usuario = "admin";
    const clavePlano = "Admin123*";
    const hash = await bcrypt.hash(clavePlano, 10);

    await sql.query`
      IF NOT EXISTS (SELECT 1 FROM dbo.Usuarios WHERE usuario = ${usuario})
      BEGIN
        INSERT INTO dbo.Usuarios (id_empleado, id_perfil, usuario, clave, activo)
        VALUES (1, 3, ${usuario}, ${hash}, 1)
      END
      ELSE
      BEGIN
        UPDATE dbo.Usuarios
        SET clave = ${hash}, activo = 1, id_perfil = 3
        WHERE usuario = ${usuario}
      END
    `;

    console.log("✅ Usuario listo:");
    console.log("   Usuario:", usuario);
    console.log("   Clave:", clavePlano);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    process.exit(1);
  }
}

run();
