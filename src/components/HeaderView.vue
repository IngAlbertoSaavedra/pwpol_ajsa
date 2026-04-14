<template>
  <header class="app-header">
    <div class="header-left">
      <div class="header-top">
        <h1 class="page-title">
          {{ currentTitle }}
        </h1>

        <p v-if="currentDescription" class="page-description">
          {{ currentDescription }}
        </p>
      </div>

      <nav
        v-if="breadcrumbs.length"
        class="breadcrumb"
        aria-label="Breadcrumb"
      >
        <router-link to="/default" class="breadcrumb-link">
          Inicio
        </router-link>

        <template v-for="(item, index) in breadcrumbs" :key="item.to">
          <span class="breadcrumb-separator">/</span>

          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="item.to"
            class="breadcrumb-link"
          >
            {{ item.label }}
          </router-link>

          <span v-else class="breadcrumb-current">
            {{ item.label }}
          </span>
        </template>
      </nav>
    </div>

    <div class="header-right" ref="menuRef">
      <button class="user-button" type="button" @click="toggleMenu">
        <div class="user-info">
          <span class="user-name">{{ displayName }}</span>
          <span class="user-role">{{ displayRole }}</span>
        </div>

        <div class="user-avatar">
          {{ initials }}
        </div>
      </button>

      <transition name="menu-fade">
        <div v-if="menuOpen" class="user-menu">
          <div class="user-menu-header">
            <div class="menu-avatar">
              {{ initials }}
            </div>

            <div class="menu-user-data">
              <div class="menu-user-name">{{ displayName }}</div>
              <div class="menu-user-role">{{ displayRole }}</div>
            </div>
          </div>

          <div class="user-menu-body">
            <button class="menu-item menu-item-danger" type="button" @click="logout">
              Cerrar sesión
            </button>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
  import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import authService from "@/services/auth.service.js";

  const route = useRoute();
  const router = useRouter();

  const viewDesc = inject("viewDesc", computed(() => ""));

  const menuOpen = ref(false);
  const menuRef = ref(null);

  const displayName = computed(() => {
    return (
      authService.nombreRef?.value ||
      authService.userRef?.value?.empleado ||
      authService.userRef?.value?.nombre ||
      authService.userRef?.value?.usuario ||
      "Usuario"
    );
  });

  const displayRole = computed(() => {
    return (
      authService.roleRef?.value ||
      authService.userRef?.value?.perfil ||
      "Sin perfil"
    );
  });

  const initials = computed(() => {
    const parts = String(displayName.value)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    if (!parts.length) return "US";

    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
  });

  const currentDescription = computed(() => viewDesc?.value || "");

  function prettifySegment(segment) {
    return String(segment || "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  }

  const breadcrumbs = computed(() => {
    const matched = route.matched.filter((item) => item.path && item.path !== "/");

    if (matched.length) {
      let fullPath = "";

      const items = matched.map((item) => {
        let pathPart = item.path || "";

        if (!pathPart.startsWith("/")) {
          fullPath = `${fullPath}/${pathPart}`.replace(/\/+/g, "/");
        } else {
          fullPath = pathPart;
        }

        const rawLabel =
          item.meta?.breadcrumb ||
          item.meta?.title ||
          item.name ||
          prettifySegment(fullPath.split("/").filter(Boolean).pop());

        return {
          label: String(rawLabel),
          to: fullPath,
        };
      });

      return items.filter((item) => {
        const label = item.label.toLowerCase();
        return label !== "inicio" && label !== "default";
      });
    }

    const segments = route.path.split("/").filter(Boolean);
    let full = "";

    return segments
      .map((segment) => {
        full += `/${segment}`;
        return {
          label: prettifySegment(segment),
          to: full,
        };
      })
      .filter((item) => {
        const label = item.label.toLowerCase();
        return label !== "inicio" && label !== "default";
      });
  });

  const currentTitle = computed(() => {
    const lastCrumb = breadcrumbs.value[breadcrumbs.value.length - 1];

    if (route.meta?.title) return route.meta.title;
    if (route.meta?.breadcrumb) return route.meta.breadcrumb;
    if (route.name) return String(route.name);
    if (lastCrumb?.label) return lastCrumb.label;

    return "Inicio";
  });

  function toggleMenu() {
    menuOpen.value = !menuOpen.value;
  }

  function closeMenu() {
    menuOpen.value = false;
  }

  function handleClickOutside(event) {
    if (!menuRef.value) return;
    if (!menuRef.value.contains(event.target)) {
      closeMenu();
    }
  }

  async function logout() {
    closeMenu();

    try {
      if (typeof authService.logout === "function") {
        await authService.logout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      router.push("/login");
    }
  }

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<style scoped>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 20px;
    padding: 14px 18px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface);
    box-shadow: 0 10px 24px var(--shadow);
    position: relative;
    z-index: 200;
  }

  .header-left {
    min-width: 0;
    flex: 1;
  }

  .header-top {
    margin-bottom: 8px;
  }

  .page-title {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.15;
    color: var(--pol-blue);
  }

  .page-description {
    margin: 6px 0 0;
    font-size: 14px;
    color: var(--muted);
  }

  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
  }

  .breadcrumb-link {
    color: var(--brand-blue);
    text-decoration: none;
    font-weight: 600;
  }

  .breadcrumb-link:hover {
    color: var(--pol-blue);
    text-decoration: underline;
  }

  .breadcrumb-separator {
    color: var(--muted);
  }

  .breadcrumb-current {
    color: var(--text);
    font-weight: 700;
  }

  .header-right {
    position: relative;
    flex-shrink: 0;
    z-index: 210;
  }

  .user-button {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 58px;
    padding: 8px 10px 8px 14px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    cursor: pointer;
    transition: 0.2s ease;
    box-shadow: 0 4px 14px var(--shadow);
  }

  .user-button:hover {
    background: var(--bg);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 0;
  }

  .user-name {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  .user-role {
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .user-avatar,
  .menu-avatar {
    display: grid;
    place-items: center;
    border-radius: 999px;
    font-weight: 800;
    color: var(--white);
    background: var(--danger);
  }

  .user-avatar {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  .user-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    width: 290px;
    border-radius: 14px;
    overflow: hidden;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 18px 40px var(--shadow);
    z-index: 250;
  }

  .user-menu-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .menu-avatar {
    width: 48px;
    height: 48px;
    font-size: 16px;
    flex-shrink: 0;
  }

  .menu-user-data {
    min-width: 0;
  }

  .menu-user-name {
    font-size: 17px;
    font-weight: 700;
    color: var(--text);
  }

  .menu-user-role {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .user-menu-body {
    padding: 10px;
  }

  .menu-item {
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
    color: var(--text);
  }

  .menu-item:hover {
    background: var(--row-alt);
  }

  .menu-item-danger {
    color: var(--danger);
    text-align: center;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .menu-item-danger:hover {
    background: var(--alert-bg);
    color: var(--alert-font);
  }

  .menu-fade-enter-active,
  .menu-fade-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
    transform-origin: top right;
  }

  .menu-fade-enter-from,
  .menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }

  @media (max-width: 900px) {
    .app-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-right {
      align-self: flex-end;
    }

    .user-name {
      max-width: 160px;
    }

    .page-title {
      font-size: 22px;
    }
  }

  @media (max-width: 640px) {
    .app-header {
      padding: 12px;
    }

    .user-button {
      width: 100%;
      justify-content: space-between;
      border-radius: 14px;
    }

    .header-right {
      width: 100%;
    }

    .user-menu {
      width: 100%;
    }
  }
</style>