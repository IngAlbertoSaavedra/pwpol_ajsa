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
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    rows: { type: Number, default: 3 },
    required: { type: Boolean, default: false },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    id: { type: String, default: '' },
    })
    defineEmits(['update:modelValue', 'blur'])
</script>
