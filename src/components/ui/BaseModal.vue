<template>
  <teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="close('overlay')">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="modal__header">
          <h3 class="modal__title">{{ title }}</h3>
          <button class="icon-btn" type="button" @click="close('x')">✕</button>
        </header>

        <section class="modal__body">
          <slot />
        </section>

        <footer v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
    import { onMounted, onBeforeUnmount, watch } from 'vue'

    const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    closeOnEsc: { type: Boolean, default: true },
    })

    const emit = defineEmits(['close', 'update:open'])

    function close(reason) {
    emit('update:open', false)
    emit('close', reason)
    }

    function onKey(e) {
    if (!props.open) return
    if (props.closeOnEsc && e.key === 'Escape') close('esc')
    }

    watch(
    () => props.open,
    (v) => {
        // opcional: bloquear scroll cuando está abierto
        document.body.style.overflow = v ? 'hidden' : ''
    }
    )

    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
    })
</script>
