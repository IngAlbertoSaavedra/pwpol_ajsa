<template>
  
  <Transition name="splash" appear>
    <SplashScreen v-if="loading" />
  </Transition> 

  <MainLayout />

</template>


<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import SplashScreen from "@/components/SplashScreen.vue";
  import MainLayout from "@/layouts/MainLayout.vue";
  const router = useRouter();
  const loading = ref(true);

  onMounted(async () => {
    try {
      await router.isReady();
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    } catch (e) {
      console.error("Error:", e);
      loading.value = false;
    }
  });
</script>

<style>
 
</style>
