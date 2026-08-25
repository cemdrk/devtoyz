<script setup>
import { ref, computed, watch } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'
import KeyValueEditor from '../components/KeyValueEditor.vue'

const method = ref('GET')
const url = ref('')
const params = ref([{ key: '', value: '' }])
const headers = ref([{ key: '', value: '' }])
const body = ref('')

watch(method, (m) => {
  if (m !== 'POST') return
  const hasContentType = headers.value.some((r) => r.key.trim().toLowerCase() === 'content-type')
  if (!hasContentType) headers.value.splice(headers.value.length - 1, 0, { key: 'Content-Type', value: 'application/json' })
})

const loading = ref(false)
const error = ref('')
const response = ref(null)

function activeRows(rows) {
  return rows.filter((r) => r.key.trim())
}

function handleUrlPaste(event) {
  const pasted = event.clipboardData?.getData('text') ?? ''
  try {
    const u = new URL(pasted.trim())
    if (![...u.searchParams].length) return
    // leave the field's own text untouched (default paste inserts it verbatim);
    // just mirror the query string into the params table
    params.value = [...u.searchParams.entries()].map(([key, value]) => ({ key, value }))
    params.value.push({ key: '', value: '' })
  } catch {
    // not a full valid URL, nothing to parse
  }
}

const finalUrl = computed(() => {
  if (!url.value.trim()) return ''
  try {
    const u = new URL(url.value.trim())
    u.search = ''
    for (const r of activeRows(params.value)) u.searchParams.append(r.key, r.value)
    return u.toString()
  } catch {
    return url.value.trim()
  }
})

async function send() {
  error.value = ''
  response.value = null
  if (!url.value.trim()) {
    error.value = 'Enter a URL.'
    return
  }

  const reqHeaderRows = activeRows(headers.value)
  const reqHeaders = {}
  for (const r of reqHeaderRows) reqHeaders[r.key] = r.value

  loading.value = true
  const start = performance.now()
  try {
    const opts = { method: method.value, headers: reqHeaders }
    if (method.value === 'POST') opts.body = body.value
    const res = await fetch(finalUrl.value, opts)
    const time = Math.round(performance.now() - start)
    const resHeaders = [...res.headers.entries()]
    const bodyText = await res.text()

    let responseBody = bodyText
    try {
      responseBody = JSON.stringify(JSON.parse(bodyText), null, 2)
    } catch {
      // not JSON, leave as raw text
    }

    response.value = {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      time,
      requestHeaders: reqHeaderRows.map((r) => [r.key, r.value]),
      headers: resHeaders,
      body: responseBody,
    }
  } catch (e) {
    error.value = `Request failed: ${e.message}\n\nThis usually means the target server doesn't allow cross-origin requests from the browser (CORS), or the URL/network is unreachable. This tool makes requests directly from your browser — there's no server-side proxy.`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ToolLayout name="HTTP Client" desc="Send a GET or POST request and inspect the response, right from your browser.">
    <div class="field">
      <label>URL</label>
      <div class="row" style="flex-wrap: nowrap;">
        <select v-model="method" class="method-select">
          <option>GET</option>
          <option>POST</option>
        </select>
        <input
          type="text"
          v-model="url"
          placeholder="https://api.example.com/users"
          style="flex: 1;"
          @keyup.enter="send"
          @paste="handleUrlPaste"
        />
        <button class="primary" :disabled="loading" @click="send" style="flex-shrink: 0;">
          {{ loading ? 'Sending…' : 'Send' }}
        </button>
      </div>
      <div v-if="finalUrl && finalUrl !== url.trim()" class="hint" style="margin-top: 7px; word-break: break-all;">
        {{ finalUrl }}
      </div>
    </div>

    <div class="field">
      <label>Query params</label>
      <KeyValueEditor v-model="params" />
    </div>

    <div class="field">
      <label>Headers</label>
      <KeyValueEditor v-model="headers" />
    </div>

    <div class="field" v-if="method === 'POST'">
      <label>Body</label>
      <textarea v-model="body" placeholder='{"key":"value"}'></textarea>
    </div>

    <div v-if="error" class="err" style="white-space: pre-wrap;">{{ error }}</div>

    <div v-if="response" class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin: 0;">
          <span :class="response.ok ? 'status-ok' : 'status-err'">{{ response.status }} {{ response.statusText }}</span>
          <span class="hint"> · {{ response.time }}ms</span>
        </label>
        <CopyButton :text="response.body" />
      </div>

      <details class="headers-panel" v-if="response.requestHeaders.length">
        <summary class="hint">Request headers ({{ response.requestHeaders.length }})</summary>
        <div class="kv-list">
          <div v-for="[k, v] in response.requestHeaders" :key="k" class="kv-list-row">
            <span class="kv-key">{{ k }}</span>
            <span>{{ v }}</span>
          </div>
        </div>
      </details>

      <details class="headers-panel" v-if="response.headers.length">
        <summary class="hint">Response headers ({{ response.headers.length }})</summary>
        <div class="kv-list">
          <div v-for="[k, v] in response.headers" :key="k" class="kv-list-row">
            <span class="kv-key">{{ k }}</span>
            <span>{{ v }}</span>
          </div>
        </div>
      </details>

      <textarea class="out" :value="response.body" readonly></textarea>
    </div>
  </ToolLayout>
</template>

<style scoped>
.method-select {
  width: auto;
  font-weight: 700;
  color: var(--green);
  border-color: color-mix(in srgb, var(--green) 35%, var(--line));
  background: color-mix(in srgb, var(--green) 8%, var(--bg-input));
  flex-shrink: 0;
}
.status-ok { color: var(--green); font-family: var(--mono); font-weight: 700; }
.status-err { color: var(--red); font-family: var(--mono); font-weight: 700; }

.headers-panel { margin-bottom: 12px; }
.headers-panel summary { cursor: pointer; }
.kv-list {
  margin-top: 8px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
}
.kv-list-row {
  display: flex;
  gap: 10px;
  padding: 7px 10px;
  font-family: var(--mono);
  font-size: 0.8rem;
  border-bottom: 1px solid var(--line-soft);
}
.kv-list-row:last-child { border-bottom: none; }
.kv-key { color: var(--cyan); flex-shrink: 0; }
</style>
