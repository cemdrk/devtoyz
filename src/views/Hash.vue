<script setup>
import { ref, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const input = ref('')
const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']
const results = ref({})

async function digest(algo, str) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function run() {
  if (!input.value) {
    results.value = {}
    return
  }
  const out = {}
  for (const a of algos) out[a] = await digest(a, input.value)
  results.value = out
}

watch(input, run)
</script>

<template>
  <ToolLayout name="Hash" desc="Compute SHA digests via the browser's SubtleCrypto. No MD5 — it isn't available in the Web Crypto API and isn't safe anyway.">
    <div class="field">
      <label>Text to hash</label>
      <textarea v-model="input" placeholder="Type or paste text…"></textarea>
    </div>

    <div v-for="a in algos" :key="a" class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin:0;">{{ a }}</label>
        <CopyButton :text="results[a] || ''" />
      </div>
      <textarea class="out" :value="results[a] || ''" readonly rows="2" placeholder="—"></textarea>
    </div>
  </ToolLayout>
</template>
