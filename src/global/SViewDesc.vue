<template>
  <div
    id="module-menu-title"
    class="module-title-wrap"
    v-animate:fade="{ type: 'in', direction: 'left', duration: 700, timeout: 500 }"
  >
    <p class="module-title">
      <strong>{{ titleText }}</strong>
    </p>
  </div>
</template>

<script setup>
    import { computed, inject, unref } from "vue";

    const props = defineProps({
    subTitle: {
        type: String,
        default: "",
        required: false,
    },
    });

    const viewDesc = inject("viewDesc", "");

    const titleText = computed(() => {
    const baseTitle = unref(viewDesc) || "";
    return props.subTitle ? `${baseTitle} - ${props.subTitle}` : baseTitle;
    });
</script>

<style scoped>
    .module-title-wrap {
    margin-bottom: 24px;
    }

    .module-title {
    display: inline-block;
    margin: 0;
    padding: 6px 12px 7px;
    border-top: 2px solid var(--danger);
    border-bottom: 2px solid var(--danger);
    background: var(--surface);
    color: var(--pol-blue);
    font-size: 24px;
    font-weight: 800;
    line-height: 1.2;
    border-radius: 6px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
    }
</style>