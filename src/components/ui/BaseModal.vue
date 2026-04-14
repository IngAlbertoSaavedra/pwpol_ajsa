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
import { onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "" },
  closeOnEsc: { type: Boolean, default: true },
});

const emit = defineEmits(["close", "update:open"]);

function close(reason) {
  emit("update:open", false);
  emit("close", reason);
}

function onKey(e) {
  if (!props.open) return;
  if (props.closeOnEsc && e.key === "Escape") close("esc");
}

watch(
  () => props.open,
  (v) => {
    document.body.style.overflow = v ? "hidden" : "";
  }
);

onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 20px;
    background: var(--glass-18);
    z-index: 900;
  }

  .modal {
    width: min(720px, 100%);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    box-shadow: 0 24px 40px var(--shadow);
    overflow: hidden;
  }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 18px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .modal__title {
    margin: 0;
    font-size: 18px;
    color: var(--pol-blue);
  }

  .icon-btn {
    width: 38px;
    height: 38px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }

  .icon-btn:hover {
    background: var(--row-alt);
  }

  .modal__body {
    padding: 18px;
    color: var(--text);
  }

  .modal__footer {
    padding: 16px 18px;
    border-top: 1px solid var(--border);
    background: var(--bg);
  }
</style>