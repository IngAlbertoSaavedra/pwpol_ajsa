<template>
    <div>
        <span> HEADssssssssssssssssssssssssssssssER </span> 
        <span> {{ nombre.value }}</span>
    </div>
</template>

<script setup>
    import { computed, ref, watch } from "vue";
    import authService from "@/services/auth.service.js";
    
    const isPinned = ref(false);


    const isLoggedIn = computed(() => authService.isAuthenticatedRef.value);
    const role = computed(() => authService.roleRef.value);
    const nombre = computed(() => authService.nombreRef.value);
    const usuario = computed(() => authService.userRef.value);

    const RAIL = 80;
    const EXPANDED = 256;

    const emit = defineEmits(["nav-offset"]);
    const reservedWidth = computed(() => (isPinned.value ? EXPANDED : RAIL));

    watch(
        reservedWidth,
        (w) => emit("nav-offset", w),
        { immediate: true }
    );

</script>

<style lang="scss" scoped>

</style>