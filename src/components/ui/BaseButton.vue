<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, { 'is-loading': loading }]"
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' }, // button | submit | reset
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | ghost
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
defineEmits(['click'])
</script>
