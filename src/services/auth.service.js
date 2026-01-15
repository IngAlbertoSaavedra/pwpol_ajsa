import { ref, computed } from "vue";

const SESSION_KEY = "pwpol_session";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const parsed = safeParse(raw);
  if (!parsed) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return parsed;
}


const session = ref(readSession());

window.addEventListener("storage", (e) => {
  if (e.key === SESSION_KEY) {
    session.value = readSession();
  }
});

const isAuthenticatedRef = computed(() => !!session.value?.token);
const userRef = computed(() => session.value?.user ?? null);
const roleRef = computed(() => {
  const u = userRef.value;
  if (!u) return "visitor";

  const raw = u?.["perfil"];
  if (typeof raw !== "string" || !raw.trim()) return "visitor";

  return raw.trim().toLowerCase();
});

function setSession(sessionObj) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  session.value = sessionObj; 
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  session.value = null; 
}

function isAuthenticated() {
    return !!this.getSession()?.token;
}

function getRole() {
  return roleRef.value;
}

export default {
  SESSION_KEY,
  session,
  isAuthenticatedRef,
  roleRef,
  userRef,

  setSession,
  logout,


  getSession() {
    return session.value;
  },

};
