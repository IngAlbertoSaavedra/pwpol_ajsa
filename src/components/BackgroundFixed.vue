<template>
  <div class="background-fixed"></div>
</template>

<style scoped>
    .background-fixed {
    position: fixed;
    inset: 0;

    background-image: url("@/assets/images/fondo_poliacero.png");
    background-size: 800px 600px;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: -1;

    pointer-events: none;
    }
</style>
