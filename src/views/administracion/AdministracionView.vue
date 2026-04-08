<template>
  <TopMenus :menus="menus" />

  <div v-if="!hasChild" class="placeholder">
    <h2>Administración</h2>
    <p>Selecciona una opción del menú para comenzar.</p>
  </div>

  <router-view v-else />
</template>


<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import TopMenus from "@/components/TopMenus.vue";

const route = useRoute();

const hasChild = computed(() => route.name !== "Administracion");

const menus = [
  {
    label: "CATÁLOGOS",
    items: [
      { title: "Sucursales", routeName: "AdministracionSucursales" },
      { title: "Departamentos", routeName: "AdministracionDepartamentos" },
      { title: "Empresas", routeName: "AdministracionEmpresas" },
      { title: "Empleados", routeName: "AdministracionEmpleados" },
      { title: "Puestos", routeName: "AdministracionPuestos" },
      { title: "Vehículos", routeName: "AdministracionVehiculos" },
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
