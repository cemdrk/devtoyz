<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const mode = ref('encode')
const input = ref('')
const error = ref('')

function encode(str) {
  // UTF-8 safe: encode to bytes first, then Base64
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)))
}
function decode(str) {
  const bytes = Uint8Array.from(atob(str), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const output = computed(() => {
  error.value = ''
  if (!input.value) return ''
  try {
    return mode.value === 'encode' ? encode(input.value) : decode(input.value)
  } catch {
    error.value = mode.value === 'decode' ? 'Not valid Base64 input.' : 'Could not encode input.'
    return ''
  }
})
</script>

<template>
  <ToolLayout name="Base64" desc="Encode text to Base64 or decode it back. UTF-8 safe.">
    <div class="controls">
      <div class="seg">
        <button :class="{ on: mode === 'encode' }" @click="mode = 'encode'">Encode</button>
        <button :class="{ on: mode === 'decode' }" @click="mode = 'decode'">Decode</button>
      </div>
    </div>

    <div class="field">
      <label>{{ mode === 'encode' ? 'Plain text' : 'Base64' }}</label>
      <textarea v-model="input" :placeholder="mode === 'encode' ? 'Type or paste text…' : 'Paste Base64…'"></textarea>
    </div>

    <div class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin: 0;">{{ mode === 'encode' ? 'Base64' : 'Plain text' }}</label>
        <CopyButton :text="output" />
      </div>
      <textarea class="out" :value="output" readonly placeholder="Result appears here…"></textarea>
      <div v-if="error" class="err">{{ error }}</div>
    </div>
  </ToolLayout>
</template>
