// D:\Repositorios\pwpol_ajsa\server\db.js
import sql from "mssql";
import "dotenv/config";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,

  options: {
    // Si tu SQL Server no usa certificados válidos, deja esto en true
    // (muy común en hosting barato)
    encrypt: false,
    trustServerCertificate: true,
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

/**
 * getPool() reutiliza una conexión del pool.
 */
export async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}
