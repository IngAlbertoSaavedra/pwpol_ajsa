<template>
  <section class="page">
    <div class="page-card">
      <h2 class="page-title">Vehículos</h2>
      <p class="page-text">Vista en construcción.</p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
  .page {
    padding: 0;
  }

  .page-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 20px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.05);
  }

  .page-title {
    margin: 0 0 8px;
    color: var(--pol-blue);
    font-size: 24px;
    font-weight: 800;
  }

  .page-text {
    margin: 0;
    color: var(--muted);
    font-size: 15px;
  }
</style>