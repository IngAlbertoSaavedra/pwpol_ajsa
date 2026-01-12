<template>
  <section class="default-view">
    <!-- Fondo fijo -->
    <BackgroundFixed />

    <!-- Contenido SOLO del home -->
    <div class="default-view__content">
      <h2>Bienvenido al sistema PWPol</h2>
      <p>
        Plataforma de control y administración.
      </p>
    </div>
  </section>
</template>

<script setup>
  import BackgroundFixed from "../components/BackgroundFixed.vue";
</script>

<style scoped>
.default-view {
  min-height: 100vh;
  padding: 24px;
}

.default-view__content {
  max-width: 900px;
  padding: 20px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(3px);
}
</style>
