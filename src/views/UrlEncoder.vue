<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const mode = ref('encode')
const scope = ref('component') // component | full
const input = ref('')
const error = ref('')

const output = computed(() => {
  error.value = ''
  if (!input.value) return ''
  try {
    if (mode.value === 'encode') {
      return scope.value === 'component'
        ? encodeURIComponent(input.value)
        : encodeURI(input.value)
    }
    return scope.value === 'component'
      ? decodeURIComponent(input.value)
      : decodeURI(input.value)
  } catch {
    error.value = 'Malformed input — could not decode.'
    return ''
  }
})
</script>

<template>
  <ToolLayout name="URL" desc="Percent-encode and decode URLs. Component covers query values; full leaves URL structure intact.">
    <div class="controls">
      <div class="seg">
        <button :class="{ on: mode === 'encode' }" @click="mode = 'encode'">Encode</button>
        <button :class="{ on: mode === 'decode' }" @click="mode = 'decode'">Decode</button>
      </div>
      <div class="seg">
        <button :class="{ on: scope === 'component' }" @click="scope = 'component'">Component</button>
        <button :class="{ on: scope === 'full' }" @click="scope = 'full'">Full URL</button>
      </div>
    </div>

    <div class="field">
      <label>Input</label>
      <textarea v-model="input" placeholder="Type or paste…"></textarea>
    </div>

    <div class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin:0;">Output</label>
        <CopyButton :text="output" />
      </div>
      <textarea class="out" :value="output" readonly></textarea>
      <div v-if="error" class="err">{{ error }}</div>
    </div>
  </ToolLayout>
</template>
