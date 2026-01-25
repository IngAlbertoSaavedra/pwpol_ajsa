<template>
  <TopMenus :menus="menus" />
  <router-view />
</template>

<script setup>
  import TopMenus from "@/components/TopMenus.vue";

const menus = [
  {
    label: "FLOTILLA",
    icon: "mdi-car-multiple",
    items: [{ title: "Consultar Flotilla", routeName: "FlotillaConsultarFlotilla", disabled: false }],
  },
  {
    label: "VEHÍCULOS",
    icon: "mdi-car",
    items: [
      { title: "Consultar Vehículo", routeName: "VehiculoConsultarVehiculo", disabled: false },
      { divider: true },
      { title: "Registrar Carga", routeName: "VehiculoRegistrarCarga", disabled: false },
    ],
  },
  {
    label: "CONSULTAS",
    icon: "mdi-help-circle-outline",
    items: [{ title: "Rendimiento de Vehículo", routeName: "ReporteRendimientoVehiculo", disabled: false }],
  },
];
</script>
