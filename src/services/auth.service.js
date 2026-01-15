const SESSION_KEY = "pwpol_session";

function mapPerfilToRole(id_perfil) {
  const n = Number(id_perfil);
  if (n === 3) return "admin";
  if (n === 2) return "user";
  return "visitor";
}

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

function notify() {
  window.dispatchEvent(new Event("pwpol-session-changed"));
}

export default {
  setSession(sessionObj) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    notify();
  },

  getSession() {
    return readSession();
  },

  isAuthenticated() {
    return !!readSession()?.token;
  },

  getRole() {
    const s = readSession();
    return mapPerfilToRole(s?.user?.id_perfil);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    notify();
  },
};
