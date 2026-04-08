<template>
  <section class="vehiculos-module">
    <TopMenus :menus="menus" />
    <router-view />
  </section>
</template>

<script setup>
  import TopMenus from "@/components/TopMenus.vue";

  const menus = [
    {
      label: "Flotilla",
      items: [
        {
          title: "Consultar Flotilla",
          routeName: "FlotillaConsultarFlotilla",
          disabled: false,
        },
      ],
    },
    {
      label: "Vehículos",
      items: [
        {
          title: "Consultar Vehículo",
          routeName: "VehiculoConsultarVehiculo",
          disabled: false,
        },
        { divider: true },
        {
          title: "Registrar Carga",
          routeName: "VehiculoRegistrarCarga",
          disabled: false,
        },
      ],
    },
    {
      label: "Consultas",
      items: [
        {
          title: "Rendimiento de Vehículo",
          routeName: "ReporteRendimientoVehiculo",
          disabled: false,
        },
      ],
    },
  ];
</script>

<style scoped>
  .vehiculos-module {
    display: grid;
    gap: 0;
  }
</style>