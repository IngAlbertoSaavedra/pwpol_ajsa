<template>
  <div class="layout" :style="{ '--nav-offset': navOffset + 'px' }">
    <BackgroundFixed />

    <Navbar
      v-if="isLoggedIn"
      @nav-offset="navOffset = $event"
    />

    <main class="content">
      <Header 
        v-if="isLoggedIn"
        @nav-offset="navOffset = $event"
      />

      <router-view />
    </main>
  </div>
</template>

<script setup>
  import { computed, ref, provide } from "vue";
  import { useRoute } from "vue-router";

  import BackgroundFixed from "@/components/BackgroundFixed.vue";
  import Navbar from "@/components/Navbar.vue";
  import authService from "@/services/auth.service.js";
  import Header from "@/components/HeaderView.vue";

  const isLoggedIn = computed(() => authService.isAuthenticatedRef.value);
  const navOffset = ref(80);

  const route = useRoute();
  
  const viewDesc = computed(() => {
    const direct = route.meta?.viewDesc;
    if (direct) return direct;

    const fromMatched = [...route.matched].reverse().find(r => r.meta?.viewDesc)?.meta?.viewDesc;
    return fromMatched || "";
  });

  provide("viewDesc", viewDesc);
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    position: relative;
  }


  .content {
    padding-left: var(--nav-offset);
    padding-top: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    box-sizing: border-box;
  }
</style>
