<template>
  <v-toolbar flat density="comfortable" class="topbar">
    <div class="menu-row">
      <v-menu
        v-for="(menu, mIndex) in menus"
        :key="mIndex"
        open-on-hover
        location="bottom"
        offset="6"
      >
        <template #activator="{ props }">
          <button class="topbar-item" v-bind="props" type="button">
            <v-icon size="18" class="mr-2">{{ menu.icon }}</v-icon>
            <span class="label">{{ menu.label }}</span>
            <v-icon size="18" class="ml-1">mdi-menu-down</v-icon>
          </button>
        </template>

        <v-list density="compact" class="dropdown">
          <template v-for="(item, iIndex) in menu.items" :key="iIndex">
            <v-divider v-if="item.divider" class="my-1" />

            <v-list-item
              v-else
              :disabled="!!item.disabled"
              :class="{ 'active-item': isActive(item.routeName) }"
              @click="goTo(item.routeName, item.disabled)"
            >
              <v-list-item-title class="dropdown-title">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  menus: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();

function isActive(routeName) {
  return routeName && route.name === routeName;
}

function goTo(name, disabled) {
  if (!name || disabled) return;
  router.push({ name });
}
</script>

<style scoped>
.topbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.menu-row {
  display: flex;
  gap: 18px;
  align-items: center;
  padding-left: 12px;
}

.topbar-item {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;

  display: inline-flex;
  align-items: center;

  height: 40px;
  padding: 0 6px;

  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;

  color: rgba(0, 0, 0, 0.65);
}

.topbar-item:hover {
  color: rgba(0, 0, 0, 0.9);
}

.dropdown {
  min-width: 220px;
}

.dropdown-title {
  font-size: 13px;
}

.active-item {
  background: rgba(0, 0, 0, 0.06);
}

.active-item :deep(.v-list-item-title) {
  font-weight: 700;
}

.active-item :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}
</style>
