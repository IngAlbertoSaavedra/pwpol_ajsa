<template>
  <section class="default-view">
    
    <BackgroundFixed />

    <Navbar />
    
    <div class="default-view__content">
      <h2>Bienvenido al sistema PWPol</h2>
      <p>
        Plataforma de control y administración.
      </p>
    </div>
  </section>
</template>

<script setup>
  import Navbar from "@/components/Navbar.vue";

</script>

<style scoped>
.default-view {
  min-height: 100vh;
  padding: 24px;
}

.default-view__content {
  position: relative;
  z-index: -1;
  max-width: 900px;
  padding: 20px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(3px);
}
</style>
