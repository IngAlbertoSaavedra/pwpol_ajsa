<template>
  <!--
    Drawer lateral fijo estilo "expand on hover":
    - Colapsado (rail) muestra solo iconos.
    - Al pasar el mouse o al recibir foco (teclado), se expande y muestra texto.
  -->
  <aside
    class="drawer"
    :class="{ expanded: isExpanded }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="hasFocusInside = true"
    @focusout="hasFocusInside = false"
    aria-label="Navegación principal"
  >
    <!-- Header -->
    <div class="drawer__header">
      <!-- ✅ Existe en tu proyecto: src/assets/images/logo_small.png -->
      <img
        src="../assets/images/logo_small.png"
        alt="Logo PWPol"
        class="drawer__logo"
      />

      <!-- Texto solo cuando está expandido -->
      <span class="drawer__title" v-show="isExpanded">PWPol</span>

      <!-- Pin: deja fijo expandido (opcional pero útil) -->
      <button
        class="drawer__pin"
        type="button"
        @click="isPinned = !isPinned"
        :aria-pressed="isPinned ? 'true' : 'false'"
        aria-label="Fijar menú lateral"
        title="Fijar menú lateral"
      >
        {{ isPinned ? "📌" : "📍" }}
      </button>
    </div>

    <!-- Menú -->
    <nav class="drawer__nav" aria-label="Secciones">
      <!-- ✅ Público (visitante) -->
      <router-link class="nav-item" to="/">
        <span class="nav-item__icon" aria-hidden="true">🏠</span>
        <span class="nav-item__label">Inicio</span>
      </router-link>

      <!-- 🔒 Protegido (usuario y admin): ruta /panel -->
      <router-link v-if="isLoggedIn" class="nav-item" to="/panel">
        <span class="nav-item__icon" aria-hidden="true">📋</span>
        <span class="nav-item__label">Panel</span>
      </router-link>

      <!-- 🔒 Solo admin: ruta /administracion -->
      <router-link v-if="isLoggedIn && role === 'admin'" class="nav-item" to="/administracion">
        <span class="nav-item__icon" aria-hidden="true">⚙️</span>
        <span class="nav-item__label">Administración</span>
      </router-link>

      <!-- Si NO hay sesión => mostrar login -->
      <router-link v-if="!isLoggedIn" class="nav-item" to="/login">
        <span class="nav-item__icon" aria-hidden="true">🔐</span>
        <span class="nav-item__label">Iniciar sesión</span>
      </router-link>

      <!-- Si SÍ hay sesión => mostrar cerrar sesión -->
      <button
        v-if="isLoggedIn"
        class="nav-item nav-item--button"
        type="button"
        @click="onLogout"
      >
        <span class="nav-item__icon" aria-hidden="true">🚪</span>
        <span class="nav-item__label">Cerrar sesión</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import authService from "../services/auth.service.js";

/**
 * -----------------------------
 * 1) Estado del drawer (UI)
 * -----------------------------
 * isHovered: true mientras el mouse está encima
 * hasFocusInside: true cuando navegas con teclado y el foco cae dentro
 * isPinned: fija expandido
 */
const isHovered = ref(false);
const hasFocusInside = ref(false);
const isPinned = ref(false);

/**
 * isExpanded: se expande si:
 * - está "pinned"
 * - o hay hover
 * - o hay foco (accesibilidad)
 */
const isExpanded = computed(() => isPinned.value || isHovered.value || hasFocusInside.value);

/**
 * -----------------------------
 * 2) Estado de sesión (Auth)
 * -----------------------------
 */
const router = useRouter();

const isLoggedIn = computed(() => authService.isAuthenticated());
const role = computed(() => authService.getRole());

/**
 * Cerrar sesión:
 * - borra localStorage (pwpol_session)
 * - redirige a /login
 */
const onLogout = () => {
  authService.logout();
  router.push("/login");
};
</script>

<style scoped>
/* Drawer rail/expanded */
.drawer {
  --drawer-rail-width: 56px;
  --drawer-expanded-width: 256px;

  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;

  width: var(--drawer-rail-width);
  background: var(--pol-blue, #002455);
  color: white;
  z-index: 1000;

  overflow: hidden;
  transition: width 180ms ease;
}

.drawer.expanded {
  width: var(--drawer-expanded-width);
}

/* Header */
.drawer__header {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  padding: 0 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.drawer__logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.drawer__title {
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* Pin button */
.drawer__pin {
  margin-left: auto;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 6px 8px;
  border-radius: 8px;
}

.drawer__pin:hover,
.drawer__pin:focus-visible {
  background: rgba(255, 255, 255, 0.16);
  outline: none;
}

/* Nav */
.drawer__nav {
  display: flex;
  flex-direction: column;
  padding: 10px 6px;
  gap: 4px;
}

/* Items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;

  height: 44px;
  padding: 0 10px;
  border-radius: 10px;

  color: white;
  text-decoration: none;
  white-space: nowrap;

  background: transparent;
}

/* Para el botón (cerrar sesión) que no es router-link */
.nav-item--button {
  border: none;
  cursor: pointer;
  text-align: left;
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.18);
  font-weight: 700;
}

.nav-item:hover,
.nav-item:focus-visible {
  background: rgba(255, 255, 255, 0.12);
  outline: none;
}

.nav-item__icon {
  width: 24px;
  display: inline-flex;
  justify-content: center;
}

/* Labels: ocultos en rail */
.nav-item__label {
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 120ms ease, transform 120ms ease;
}

/* Labels visibles cuando se expande */
.drawer.expanded .nav-item__label {
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .drawer,
  .nav-item__label {
    transition: none;
  }
}
</style>
