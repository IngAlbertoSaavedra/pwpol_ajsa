<template>
  <div class="field">
    <label v-if="label" class="label" :for="id">
      {{ label }}
      <span v-if="required" class="req">* requerido</span>
    </label>

    <input
      class="input"
      :class="{ 'has-error': !!error }"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      @input="onInput"
      @blur="$emit('blur')"
      @keydown.enter="$emit('enter')"
    />

    <p v-if="hint && !error" class="hint">{{ hint }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  hint: { type: String, default: "" },
  error: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: "" },
  autocomplete: { type: String, default: "off" },
});

const emit = defineEmits(["update:modelValue", "blur", "enter"]);

const inputmode = computed(() => {
  if (props.type === "number") return "decimal";
  if (props.type === "email") return "email";
  return "text";
});

function onInput(e) {
  const raw = e.target.value;
  if (props.type === "number") {
    emit("update:modelValue", raw === "" ? "" : Number(raw));
    return;
  }
  emit("update:modelValue", raw);
}
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
    font-weight: 600;
    margin-left: 4px;
  }

  .input {
    min-height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    outline: none;
    transition: 0.2s ease;
  }

  .input::placeholder {
    color: var(--muted);
  }

  .input:focus {
    border-color: var(--brand-blue);
    box-shadow: 0 0 0 3px var(--pol-blue-light);
  }

  .input:disabled {
    background: var(--bg);
    color: var(--muted);
    cursor: not-allowed;
  }

  .has-error {
    border-color: var(--danger);
  }

  .hint {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .error {
    margin: 0;
    font-size: 12px;
    color: var(--alert-font);
    font-weight: 600;
  }
</style>