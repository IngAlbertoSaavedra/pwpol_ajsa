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
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' }, // text | number | date | email | password
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
})

const emit = defineEmits(['update:modelValue', 'blur', 'enter'])

const inputmode = computed(() => {
  if (props.type === 'number') return 'decimal'
  if (props.type === 'email') return 'email'
  return 'text'
})

function onInput(e) {
  const raw = e.target.value
  if (props.type === 'number') {
    // Mantén string si está vacío, si no Number
    emit('update:modelValue', raw === '' ? '' : Number(raw))
    return
  }
  emit('update:modelValue', raw)
}
</script>
