
const SESSION_KEY = "pwpol_session";

/**
  * Tipos de perfiles:
 *  - id_perfil = 1 significa visitante
 *  - id_perfil = 2 significa usuario
 *  - id_perfil = 3 significa administrador
 */
function mapPerfilToRole(id_perfil) {
  const n = Number(id_perfil);
  if (n === 3) return "admin";
  if (n === 2) return "user";
  return "visitor";
}
// ------------------------------------------------------------

function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export default {
  SESSION_KEY,

  setSession(sessionObj) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  },

  getSession() {
    return readSession();
  },

  isAuthenticated() {
    return !!readSession();
  },

  /**
   * Retorna: "visitor" | "user" | "admin"
   */
  getRole() {
    const s = readSession();
    const idPerfil = s?.user?.id_perfil;
    return mapPerfilToRole(idPerfil);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
