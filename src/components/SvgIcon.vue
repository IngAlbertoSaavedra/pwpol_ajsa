<template>
  <svg
    v-if="path"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    class="svg-icon"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>

<script setup>
import { computed } from "vue";
import { icons } from "@/icons/icons.js";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 22 },
});

const path = computed(() => icons[props.name] || "");
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
