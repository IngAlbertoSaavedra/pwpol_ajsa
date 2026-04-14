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
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
defineEmits(["click"]);
</script>

<style scoped>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn--primary {
    background: var(--brand-blue);
    color: var(--white);
  }

  .btn--primary:hover:not(:disabled) {
    background: var(--pol-blue);
  }

  .btn--secondary {
    background: var(--pol-blue);
    color: var(--white);
  }

  .btn--secondary:hover:not(:disabled) {
    background: var(--brand-blue);
  }

  .btn--danger {
    background: var(--danger);
    color: var(--white);
  }

  .btn--danger:hover:not(:disabled) {
    background: var(--alert-font);
  }

  .btn--ghost {
    background: var(--surface);
    color: var(--pol-blue);
    border-color: var(--border);
  }

  .btn--ghost:hover:not(:disabled) {
    background: var(--bg);
  }

  .spinner {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid var(--glass-18);
    border-top-color: var(--white);
    animation: spin 0.7s linear infinite;
  }

  .btn--ghost .spinner {
    border: 2px solid var(--border);
    border-top-color: var(--pol-blue);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>