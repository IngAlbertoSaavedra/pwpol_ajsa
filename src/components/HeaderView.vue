<template>
    <div>
        <span> HEADssssssssssssssssssssssssssssssER </span> 
        <v-toolbar-title> {{ viewDesc }} </v-toolbar-title>
        <span> {{ nombre }}</span>
    </div>
</template>

<script setup>
    import { computed, ref, watch, inject } from "vue";
    
    import authService from "@/services/auth.service.js";
    
    const viewDesc = inject("viewDesc");
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