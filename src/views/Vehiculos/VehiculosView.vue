<template>
  <div>
    <h1>Vehículos</h1>

    <div class="menus">
      <v-menu
        v-for="(menu, mIndex) in menus"
        :key="mIndex"
        transition="slide-y-transition"
        
      >
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            {{ menu.label }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, iIndex) in menu.items"
            :key="iIndex"
            @click="goTo(item.routeName)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <router-view />
  </div>
</template>

<script setup>
  import { useRouter } from "vue-router";

  const router = useRouter();

  function goTo(name) {
    router.push({ name });
  }

  const menus = [
    {
      label: "VEHÍCULOS",
      items: [
        { title: "Consultar Vehículo", routeName: "VehiculoConsultarVehiculo" },
        { title: "Registrar Carga", routeName: "VehiculoRegistrarCarga" },
      ],
    },
    {
      label: "FLOTILLA",
      items: [
        { title: "Consultar Flotilla", routeName: "FlotillaConsultarFlotilla" },
      ],
    },
    {
      label: "REPORTES",
      items: [
        { title: "Rendimiento de Vehículo", routeName: "ReporteRendimientoVehiculo" },
      ],
    },
    {
      label: "CATÁLOGO",
      items: [
        { title: "Consultar Flotilla", routeName: "FlotillaConsultarFlotilla" },
      ],
    },
  ];

</script>

<style scoped>
  .menus {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
</style>