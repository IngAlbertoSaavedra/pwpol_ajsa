<template>
  <div>
    <BackgroundFixed />

    <Navbar />

    <main class="container">
      <router-view />
    </main>

  </div>
</template>

<script setup>
  import BackgroundFixed from "@/components/BackgroundFixed.vue";
  import Navbar from "@/components/Navbar.vue";
</script>

<style scoped>
  .layout {
    position: relative;
    z-index: 1;
  }

  .container {
    padding: 1rem;
    position: relative;
    z-index: 1;
  }
</style>
