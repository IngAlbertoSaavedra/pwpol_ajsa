<template>
  <div class="field">
    <label v-if="label" class="label" :for="id">
      {{ label }}
      <span v-if="required" class="req">* requerido</span>
    </label>

    <textarea
      class="textarea"
      :class="{ 'has-error': !!error }"
      :id="id"
      :rows="rows"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    ></textarea>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 3 },
  required: { type: Boolean, default: false },
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: "" },
});
defineEmits(["update:modelValue", "blur"]);
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

  .textarea {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    outline: none;
    resize: vertical;
    transition: 0.2s ease;
  }

  .textarea::placeholder {
    color: var(--muted);
  }

  .textarea:focus {
    border-color: var(--brand-blue);
    box-shadow: 0 0 0 3px var(--pol-blue-light);
  }

  .textarea:disabled {
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