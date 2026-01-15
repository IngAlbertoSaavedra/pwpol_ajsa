import { defineStore } from "pinia";

const KEY = "pwpol_session";

function readSession() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    session: readSession(), // { token, user, createdAt }
  }),
  getters: {
    isAuthenticated: (s) => !!s.session?.token,
    idPerfil: (s) => s.session?.user?.id_perfil ?? null,
    role: (s) => {
      const p = s.session?.user?.id_perfil;
      if (p === 3) return "admin";
      if (p === 2) return "user";
      return "visitor";
    },
  },
  actions: {
    setSession(session) {
      this.session = session;
      localStorage.setItem(KEY, JSON.stringify(session));
    },
    logout() {
      this.session = null;
      localStorage.removeItem(KEY);
    },
    loadFromStorage() {
      this.session = readSession();
    }
  },
});
