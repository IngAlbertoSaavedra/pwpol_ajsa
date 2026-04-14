<template>
  <div class="field">
    <label v-if="label" class="label" :for="id">
      {{ label }}
      <span v-if="required" class="req">* requerido</span>
    </label>

    <select
      class="select"
      :class="{ 'has-error': !!error }"
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', $event.target.value)"
      @blur="emit('blur')"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
  label: { type: String, default: "" },
  required: { type: Boolean, default: false },
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: "" },
  placeholder: { type: String, default: "Selecciona una opción" },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);
</script>

<style scoped>
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
  }

  .req {
    color: var(--danger);
    margin-left: 4px;
  }

  .select {
    min-height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    outline: none;
    transition: 0.2s ease;
  }

  .select:focus {
    border-color: var(--brand-blue);
    box-shadow: 0 0 0 3px var(--pol-blue-light);
  }

  .select:disabled {
    background: var(--bg);
    color: var(--muted);
    cursor: not-allowed;
  }

  .has-error {
    border-color: var(--danger);
  }

  .error {
    margin: 0;
    font-size: 12px;
    color: var(--alert-font);
    font-weight: 600;
  }
</style>