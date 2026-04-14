<template>
  <aside
    class="drawer"
    :class="{ expanded: isExpanded }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="hasFocusInside = true"
    @focusout="hasFocusInside = false"
    aria-label="Navegación principal"
  >
    <div class="drawer__header">
      <img
        src="../assets/images/logo_small.png"
        alt="Logo PWPol"
        class="drawer__logo"
      />

      <span class="drawer__title" v-show="isExpanded">PWPol {{ nombre.value }}</span>

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

    <nav class="drawer__nav" aria-label="Secciones">
      <router-link class="nav-item" to="/default">
        <span class="nav-item__icon" aria-hidden="true">
          <SvgIcon name="home" />
        </span>
        <span class="nav-item__label">Inicio</span>
      </router-link>

      <router-link class="nav-item" to="/vehiculos">
        <span class="nav-item__icon" aria-hidden="true">
          <SvgIcon name="car" />
        </span>
        <span class="nav-item__label">Vehiculos</span>
      </router-link>

      <router-link class="nav-item" to="/administracion">
        <span class="nav-item__icon" aria-hidden="true">
          <SvgIcon name="config" />
        </span>
        <span class="nav-item__label">Administración</span>
      </router-link>
      
      <button v-if="isLoggedIn" class="btn" @click="logout">
        Salir
      </button>
    </nav>
  </aside>
</template>

<script setup>
  import { computed, ref, watch } from "vue";
  import authService from "@/services/auth.service.js";
  import SvgIcon from "@/components/SvgIcon.vue";
  import { useRouter } from "vue-router";
  
  const SLIM = 90;
  const EXPANDED = 270;

  const isHovered = ref(false);
  const hasFocusInside = ref(false);
  const isPinned = ref(false);
  const isExpanded = computed(() => isPinned.value || isHovered.value || hasFocusInside.value);

  const isLoggedIn = computed(() => authService.isAuthenticatedRef.value);
  const nombre = computed(() => authService.nombreRef.value);
  const router = useRouter();
  
  const emit = defineEmits(["nav-offset"]);
  const reservedWidth = computed(() => (isPinned.value ? EXPANDED : SLIM));

  watch(
    reservedWidth,
    (w) => emit("nav-offset", w),
    { immediate: true }
  );
  
  const logout = () => {
    authService.logout();
    router.push("/login");
  };
</script>

<style scoped>
  .drawer {
    --drawer-SLIM-width: 75px;
    --drawer-expanded-width: 256px;

    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;

    width: var(--drawer-SLIM-width);
    background: var(--pol-blue);
    color: var(--white);
    z-index: 300;

    overflow: hidden;
    transition: width 180ms ease;
    box-shadow: 8px 0 18px var(--shadow);
  }

  .drawer.expanded {
    width: var(--drawer-expanded-width);
  }

  .drawer__header {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 10px;
    border-bottom: 1px solid var(--glass-18);
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
    color: var(--white);
  }

  .drawer__pin {
    margin-left: auto;
    background: transparent;
    border: none;
    color: var(--white);
    cursor: pointer;
    font-size: 16px;
    padding: 6px 8px;
    border-radius: 8px;
  }

  .drawer__pin:hover,
  .drawer__pin:focus-visible {
    background: var(--glass-18);
    outline: none;
  }

  .drawer__nav {
    display: flex;
    flex-direction: column;
    padding: 10px 6px;
    gap: 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    padding: 0 10px;
    border-radius: 12px;
    color: var(--white);
    text-decoration: none;
    white-space: nowrap;
    background: transparent;
    transition: background 0.2s ease;
  }

  .nav-item.router-link-active {
    background: var(--glass-18);
    font-weight: 700;
  }

  .nav-item:hover,
  .nav-item:focus-visible {
    background: var(--glass-18);
    outline: none;
  }

  .nav-item__icon {
    width: 24px;
    display: inline-flex;
    justify-content: center;
    color: var(--white);
  }

  .nav-item__label {
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .drawer.expanded .nav-item__label {
    opacity: 1;
    transform: translateX(0);
  }

  .btn {
    height: 44px;
    border-radius: 14px;
    border: none;
    background: var(--brand-blue);
    color: var(--white);
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .btn:hover {
    background: var(--brand-green);
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer,
    .nav-item__label {
      transition: none;
    }
  }
</style>