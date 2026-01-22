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
          <v-list-item
            v-for="(item, iIndex) in menu.items"
            :key="iIndex"
            @click="goTo(item.routeName)"
          >
            <v-list-item-title class="dropdown-title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
  
    <router-view />
  
  
</template>

<script setup>
  import { useRouter } from "vue-router";

  const router = useRouter();

  function goTo(name) {
    router.push({ name });
  }

  const menus = [
    {
      label: "FLOTILLA",
      icon: "mdi-car-multiple",
      items: [{ title: "Consultar Flotilla", routeName: "FlotillaConsultarFlotilla" }],
    },
    {
      label: "VEHÍCULOS",
      icon: "mdi-car",
      items: [
        { title: "Consultar Vehículo", routeName: "VehiculoConsultarVehiculo" },
        { title: "Registrar Carga", routeName: "VehiculoRegistrarCarga" },
      ],
    },
    {
      label: "CONSULTAS",
      icon: "mdi-help-circle-outline",
      items: [{ title: "Rendimiento de Vehículo", routeName: "ReporteRendimientoVehiculo" }],
    },
  ];
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

  /* Botón textual (no parece botón) */
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
</style>
