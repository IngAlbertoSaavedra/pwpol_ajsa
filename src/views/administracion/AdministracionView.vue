<template>
  <TopMenus :menus="menus" />

  <!-- Si NO hay hijo activo, mostramos un mensaje -->
  <div v-if="!hasChild" class="placeholder">
    <h2>Administración</h2>
    <p>Selecciona una opción del menú para comenzar.</p>
  </div>

  <!-- Aquí se renderizan Sucursales, Usuarios, etc. -->
  <router-view v-else />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import TopMenus from "@/components/TopMenus.vue";

const route = useRoute();

// Si estás exactamente en /administracion, no hay vista hija cargada
const hasChild = computed(() => route.name !== "Administracion");

const menus = [
  {
    label: "CATÁLOGOS",
    icon: "mdi-folder-cog-outline",
    items: [
      { title: "Sucursales", routeName: "AdministracionSucursales" },
      { title: "Empresas", routeName: "AdministracionEmpresas" },
      { title: "Empleados", routeName: "AdministracionEmpleados" },
      { divider: true },
      { title: "Usuarios", routeName: "AdministracionUsuarios" },
      { title: "Perfiles", routeName: "AdministracionPerfiles" },
    ],
  },
];
</script>

<style scoped>
.placeholder {
  padding: 18px;
}
</style>
