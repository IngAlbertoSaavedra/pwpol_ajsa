<template>
  <teleport to="body">
    <div v-if="toast.show" class="toast" :class="`toast--${toast.variant}`" role="status">
      <span class="toast__text">{{ toast.text }}</span>
      <button class="icon-btn" type="button" @click="hide">✕</button>
    </div>
  </teleport>
</template>

<script setup>
  import { useToast } from "@/composables/useToast";

  const { toast, hide } = useToast();
</script>

<style scoped>
  .toast {
    position: fixed;
    right: 16px;
    bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    max-width: 420px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 18px 30px var(--shadow);
    z-index: 950;
  }

  .toast--success {
    background: var(--surface);
    border-color: var(--success);
    color: var(--text);
  }

  .toast--danger,
  .toast--error {
    background: var(--surface);
    border-color: var(--danger);
    color: var(--text);
  }

  .toast--warning {
    background: var(--surface);
    border-color: var(--warning);
    color: var(--text);
  }

  .toast--info {
    background: var(--surface);
    border-color: var(--brand-blue);
    color: var(--text);
  }

  .toast__text {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }

  .icon-btn:hover {
    background: var(--row-alt);
  }
</style>