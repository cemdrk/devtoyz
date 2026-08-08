<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  label: { type: String, default: 'Copy' },
})

const copied = ref(false)

async function copy() {
  if (!props.text) return
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1200)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <button class="ghost" :class="{ copied }" @click="copy">
    {{ copied ? 'Copied' : label }}
  </button>
</template>
