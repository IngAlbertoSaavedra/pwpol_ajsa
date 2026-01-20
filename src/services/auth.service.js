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
const userRef = computed(() => session.value?.userusuario ?? '');
const nombreRef = computed(() => session.value?.user.empleado ?? '');
const perfilRef = computed(() => session.value?.user.perfil ?? "visitor");


function setSession(sessionObj) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  session.value = sessionObj; 
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  session.value = null; 
}


export default {
  SESSION_KEY,
  session,
  isAuthenticatedRef,
  perfilRef,
  userRef,
  nombreRef,

  setSession,
  logout,

  getSession() {
    return session.value;
  },
};
