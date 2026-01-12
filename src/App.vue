<template>
  <Transition name="splash" appear> 
    <SplashScreen v-if="loading" />
  </Transition>

  <router-view v-if="!loading" />
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import SplashScreen from "./components/SplashScreen.vue";

  const loading = ref(true);
    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 2000); // cada mil = un segundo
    });

</script>

<style>
  div {
    font-family: Arial, Helvetica, sans-serif;
  }
  .splash-enter-active,
  .splash-leave-active {
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .splas-enter-from,
  .splash-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .splash-enter-to,
  .splash-leave-from {
    opacity: 1;
    transform: scale(1);
  }
  * {
    --brand-green: #04b500;
    --brand-blue: #0689b0;
    --pol-blue: #002455;
  }
</style>