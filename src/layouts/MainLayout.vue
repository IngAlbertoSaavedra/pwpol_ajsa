<template>

  <div class="default-view">
    <BackgroundFixed />

    <Navbar v-if="isLoggedIn"/>

    <router-view /> 

  </div>
</template>

<script setup>
  import { computed } from "vue";
  import BackgroundFixed from "@/components/BackgroundFixed.vue";
  import Navbar from "@/components/Navbar.vue";
  import authService from "@/services/auth.service.js";
  
  const isLoggedIn = computed(() => authService.isAuthenticatedRef.value);
  const role = computed(() => authService.roleRef.value);

</script>

<style scoped>

</style>
