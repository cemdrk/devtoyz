<script setup>
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const input = ref('')
const output = ref('')
const error = ref('')
const indent = ref(2)

function run(minify = false) {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed, null, minify ? 0 : Number(indent.value))
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <ToolLayout name="JSON" desc="Pretty-print, minify, and validate JSON.">
    <div class="field">
      <label>Input</label>
      <textarea v-model="input" placeholder='{"paste":"your json here"}'></textarea>
    </div>

    <div class="controls">
      <button class="primary" @click="run(false)">Format</button>
      <button @click="run(true)">Minify</button>
      <label class="hint" style="display:flex;align-items:center;gap:8px;">
        indent
        <select v-model="indent" style="width:auto;padding:6px 8px;">
          <option :value="2">2</option>
          <option :value="4">4</option>
        </select>
      </label>
    </div>

    <div class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin:0;">Output</label>
        <CopyButton :text="output" />
      </div>
      <textarea class="out" :value="output" readonly placeholder="Formatted JSON appears here…"></textarea>
      <div v-if="error" class="err">✗ {{ error }}</div>
    </div>
  </ToolLayout>
</template>
