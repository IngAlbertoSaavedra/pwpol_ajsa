<template>
  <div>
    <h1>Vehículos</h1>
    <p>Solo usuario o administradores.</p>

    <div class="menus-bar">
      <button @click="goTo('VehiculoRegistrarCarga')">Vehiculo → Registrar Carga</button>
      <button @click="goTo('VehiculoConsultarVehiculo')">Vehiculo → Consultar Vehiculo</button>
      <button @click="goTo('FlotillaConsultarFlotilla')">Flotilla → Consultar Flotilla</button>
      <button @click="goTo('ReporteRendimientoVehiculo')">Reportes → Rendimiento de Vehiculo</button>
    
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
</script>

<style scoped>
  .vehiculos-page {
    padding: 16px;
  }
  .menus-bar {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 12px;
  }
</style>