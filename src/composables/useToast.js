import { reactive } from 'vue'

const state = reactive({
  show: false,
  text: '',
  variant: 'info', // info | success | warning | danger
  timeoutId: null,
})

export function useToast() {
  function show(text, variant = 'info', ms = 2500) {
    state.text = text
    state.variant = variant
    state.show = true

    if (state.timeoutId) clearTimeout(state.timeoutId)
    state.timeoutId = setTimeout(() => {
      state.show = false
      state.timeoutId = null
    }, ms)
  }

  function hide() {
    state.show = false
    if (state.timeoutId) clearTimeout(state.timeoutId)
    state.timeoutId = null
  }

  return { toast: state, show, hide }
}
