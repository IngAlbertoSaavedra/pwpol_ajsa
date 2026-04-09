<template>
  <section class="vehiculos-admin-module">
    <TopMenus :menus="menus" />

    <div v-if="!hasChild" class="placeholder">
      <h2>Catálogos Vehicular</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
    </div>

    <router-view v-else />
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import TopMenus from "@/components/TopMenus.vue";

const route = useRoute();

const hasChild = computed(() => route.name !== "AdministracionVehiculos");

const menus = [
  {
    label: "CATÁLOGOS VEHICULAR",
    items: [
      { title: "Marcas", routeName: "AdministracionVehiculosMarcas" },
      { title: "Submarcas", routeName: "AdministracionVehiculosSubmarcas" },
      { title: "Combustibles", routeName: "AdministracionVehiculosCombustibles" },
      { divider: true },
      { title: "Vehículos", routeName: "AdministracionVehiculosCatalogo" },
    ],
  },
];
</script>

<style scoped>
.vehiculos-admin-module {
  display: grid;
  gap: 0;
}

.placeholder {
  padding: 18px;
}
</style>