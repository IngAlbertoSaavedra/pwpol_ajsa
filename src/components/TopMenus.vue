<template>
  <nav class="topbar" aria-label="Menú superior">
    <div class="menu-row">
      <div
        v-for="(menu, mIndex) in menus"
        :key="mIndex"
        class="menu-group"
        @mouseenter="openMenu(mIndex)"
        @mouseleave="scheduleClose(mIndex)"
      >
        <button
          type="button"
          class="topbar-item"
          :class="{ 'topbar-item--open': openIndex === mIndex }"
          @click="toggleMenu(mIndex)"
        >
          <span class="label">{{ menu.label }}</span>
          <span class="caret" :class="{ 'caret--open': openIndex === mIndex }">▾</span>
        </button>

        <div
          v-if="openIndex === mIndex"
          class="dropdown"
          role="menu"
        >
          <template v-for="(item, iIndex) in menu.items" :key="iIndex">
            <div v-if="item.divider" class="dropdown-divider"></div>

            <button
              v-else
              type="button"
              class="dropdown-item"
              :class="{
                'dropdown-item--active': isActive(item.routeName),
                'dropdown-item--disabled': !!item.disabled
              }"
              :disabled="!!item.disabled"
              @click="goTo(item.routeName, item.disabled)"
            >
              {{ item.title }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useRouter, useRoute } from "vue-router";

  defineProps({
    menus: {
      type: Array,
      required: true,
    },
  });

  const router = useRouter();
  const route = useRoute();

  const openIndex = ref(null);
  let closeTimer = null;

  function isActive(routeName) {
    return !!routeName && route.name === routeName;
  }

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function openMenu(index) {
    clearCloseTimer();
    openIndex.value = index;
  }

  function scheduleClose(index) {
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      if (openIndex.value === index) {
        openIndex.value = null;
      }
    }, 180);
  }

  function toggleMenu(index) {
    clearCloseTimer();
    openIndex.value = openIndex.value === index ? null : index;
  }

  function goTo(name, disabled) {
    if (!name || disabled) return;
    clearCloseTimer();
    openIndex.value = null;
    router.push({ name });
  }

  function handleClickOutside(event) {
    const menuRoot = event.target.closest(".menu-group");
    if (!menuRoot) {
      clearCloseTimer();
      openIndex.value = null;
    }
  }

  function handleEscape(event) {
    if (event.key === "Escape") {
      clearCloseTimer();
      openIndex.value = null;
    }
  }

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
  });

  onBeforeUnmount(() => {
    clearCloseTimer();
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  });
</script>

<style scoped>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 8px 10px;
    margin-bottom: 10px;
    box-shadow: 0 8px 18px var(--shadow);
  }

  .menu-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .menu-group {
    position: relative;
  }

  .topbar-item {
    appearance: none;
    border: 1px solid transparent;
    background: transparent;
    color: var(--pol-blue);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 14px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .topbar-item:hover,
  .topbar-item--open {
    background: var(--pol-blue-light);
    border-color: var(--border);
    color: var(--pol-blue);
  }

  .label {
    white-space: nowrap;
  }

  .caret {
    font-size: 12px;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  .caret--open {
    transform: rotate(180deg);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 240px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: none;
    border-radius: 0 0 14px 14px;
    padding: 8px;
    box-shadow: 0 18px 34px var(--shadow);
    z-index: 50;
  }

  .dropdown-divider {
    height: 1px;
    background: var(--border);
    margin: 8px 2px;
  }

  .dropdown-item {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--text);
    text-align: left;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .dropdown-item:hover {
    background: var(--row-alt);
  }

  .dropdown-item--active {
    background: var(--pol-blue-light);
    color: var(--pol-blue);
    font-weight: 700;
  }

  .dropdown-item--disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .topbar {
      padding: 10px;
    }

    .menu-row {
      gap: 8px;
    }

    .topbar-item {
      width: 100%;
      justify-content: space-between;
    }

    .menu-group,
    .dropdown {
      width: 100%;
    }

    .dropdown {
      position: static;
      margin-top: 6px;
      border-top: 1px solid var(--border);
      border-radius: 14px;
    }
  }
</style>