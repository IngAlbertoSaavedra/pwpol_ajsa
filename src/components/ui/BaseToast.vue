<template>
  <teleport to="body">
    <div v-if="toast.show" class="toast" :class="`toast--${toast.variant}`" role="status">
      <span class="toast__text">{{ toast.text }}</span>
      <button class="icon-btn" type="button" @click="hide">✕</button>
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toast, hide } = useToast()
</script>
