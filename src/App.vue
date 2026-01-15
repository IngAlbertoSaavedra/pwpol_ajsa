<template>
  <Transition name="splash" appear>
    <SplashScreen v-if="loading" />
  </Transition>

  <router-view v-if="!loading" />
</template>


<script setup>
  import { ref, onMounted } from "vue";
  import SplashScreen from "@/components/SplashScreen.vue";
  import router from "@/router/index.js";

  const loading = ref(true);

  onMounted(async () => {
    try {
      await router.isReady();

      setTimeout(() => {
        loading.value = false;
        //console.log("pasamos");
      }, 2000);
    } catch (e) {
      console.error("Error:", e);
      loading.value = false;
    }
  });
</script>

<style>
  :root {
    --white: #ffffff;
    --black: #000000;

    --brand-green: #04b500;
    --brand-blue: #0689b0;
    --pol-blue: #002455;
    --pol-blue-light: #BBE0EF;

    --bg: #f6f8fb;
    --surface: #ffffff;
    --text: #0f172a;
    --muted: rgba(255, 255, 255, 0.75);
    --gay-18: rgba(255, 255, 255, 0.18);
    --shadow: rgba(0,0,0,0.14);

    --danger: #ef4444;
    --warning: #f59e0b;
    --success: #22c55e;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }


  .splash-enter-active,
  .splash-leave-active {
    transition: opacity 0.25s ease;
  }

  .splash-enter-from,
  .splash-leave-to {
    opacity: 0;
  }
</style>
