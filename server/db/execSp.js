import { getPool } from "./db.js";

export async function execSp(spName, params = []) {
  const pool = await getPool();
  const request = pool.request();

  for (const p of params) {
    request.input(p.name, p.type, p.value);
  }

  return request.execute(spName);
}
