<script setup>
import { ref, computed } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import CopyButton from '../components/CopyButton.vue'

const count = ref(5)
const uppercase = ref(false)
const list = ref([])

function gen() {
  const n = Math.min(Math.max(Number(count.value) || 1, 1), 500)
  list.value = Array.from({ length: n }, () => crypto.randomUUID())
}

const shown = computed(() =>
  (uppercase.value ? list.value.map((u) => u.toUpperCase()) : list.value).join('\n')
)

gen()
</script>

<template>
  <ToolLayout name="UUID" desc="Generate RFC 4122 version 4 UUIDs.">
    <div class="controls">
      <button class="primary" @click="gen">Generate</button>
      <label class="hint" style="display:flex;align-items:center;gap:8px;">
        count
        <input type="number" v-model="count" min="1" max="500" style="width:80px;" @keyup.enter="gen" />
      </label>
      <label class="hint" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input type="checkbox" v-model="uppercase" style="width:auto;" /> uppercase
      </label>
    </div>

    <div class="field">
      <div class="row" style="justify-content: space-between; margin-bottom: 7px;">
        <label style="margin:0;">{{ list.length }} UUID{{ list.length === 1 ? '' : 's' }}</label>
        <CopyButton :text="shown" label="Copy all" />
      </div>
      <textarea class="out" :value="shown" readonly rows="10"></textarea>
    </div>
  </ToolLayout>
</template>
