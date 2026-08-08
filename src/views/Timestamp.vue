<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const now = ref(Math.floor(Date.now() / 1000))
let timer
onMounted(() => { timer = setInterval(() => (now.value = Math.floor(Date.now() / 1000)), 1000) })
onUnmounted(() => clearInterval(timer))

// unix -> date
const ts = ref('')
const tsError = ref('')
function fromUnix() {
  tsError.value = ''
  const raw = ts.value.trim()
  if (!raw) return { local: '', utc: '', iso: '' }
  let n = Number(raw)
  if (Number.isNaN(n)) { tsError.value = 'Not a number.'; return { local: '', utc: '', iso: '' } }
  // accept seconds or milliseconds
  if (raw.length > 12) n = n // ms
  else n = n * 1000
  const d = new Date(n)
  if (Number.isNaN(d.getTime())) { tsError.value = 'Out of range.'; return { local: '', utc: '', iso: '' } }
  return { local: d.toString(), utc: d.toUTCString(), iso: d.toISOString() }
}

// date -> unix
const dateStr = ref('')
const dateError = ref('')
function toUnix() {
  dateError.value = ''
  if (!dateStr.value.trim()) return ''
  const d = new Date(dateStr.value)
  if (Number.isNaN(d.getTime())) { dateError.value = 'Unrecognized date.'; return '' }
  return String(Math.floor(d.getTime() / 1000))
}
</script>

<template>
  <ToolLayout name="Timestamp" desc="Convert Unix time to human dates and back. Seconds or milliseconds are auto-detected.">
    <div class="field">
      <div class="row" style="justify-content: space-between;">
        <label style="margin:0;">Current Unix time</label>
        <CopyButton :text="String(now)" />
      </div>
      <div style="font-family: var(--mono); font-size: 1.6rem; color: var(--amber); margin-top: 6px;">{{ now }}</div>
    </div>

    <div class="field">
      <label>Unix → date</label>
      <input type="text" v-model="ts" placeholder="e.g. 1700000000" />
      <div v-if="tsError" class="err">{{ tsError }}</div>
      <template v-if="ts && !tsError">
        <div class="hint" style="margin-top:10px;">Local: <span style="color:var(--cyan)">{{ fromUnix().local }}</span></div>
        <div class="hint" style="margin-top:4px;">UTC:&nbsp;&nbsp; <span style="color:var(--cyan)">{{ fromUnix().utc }}</span></div>
        <div class="hint" style="margin-top:4px;">ISO:&nbsp;&nbsp; <span style="color:var(--cyan)">{{ fromUnix().iso }}</span></div>
      </template>
    </div>

    <div class="field">
      <label>Date → Unix</label>
      <input type="text" v-model="dateStr" placeholder="e.g. 2024-01-01 or Jan 1 2024 12:00" />
      <div v-if="dateError" class="err">{{ dateError }}</div>
      <div v-else-if="toUnix()" class="row" style="margin-top:10px;">
        <span class="hint">seconds: <span style="color:var(--cyan)">{{ toUnix() }}</span></span>
        <CopyButton :text="toUnix()" />
      </div>
    </div>
  </ToolLayout>
</template>
