<script setup>
const rows = defineModel({ default: () => [{ key: '', value: '' }] })

function update(i, field, val) {
  rows.value[i][field] = val
  // keep exactly one trailing blank row so there's always a place to type
  const last = rows.value[rows.value.length - 1]
  if (last.key || last.value) rows.value.push({ key: '', value: '' })
}

function remove(i) {
  rows.value.splice(i, 1)
  if (rows.value.length === 0) rows.value.push({ key: '', value: '' })
}
</script>

<template>
  <div class="kv">
    <div class="kv-row" v-for="(row, i) in rows" :key="i">
      <input type="text" placeholder="key" :value="row.key" @input="update(i, 'key', $event.target.value)" />
      <input type="text" placeholder="value" :value="row.value" @input="update(i, 'value', $event.target.value)" />
      <button class="ghost kv-remove" :disabled="!row.key && !row.value" @click="remove(i)">✕</button>
    </div>
  </div>
</template>

<style scoped>
.kv { display: flex; flex-direction: column; gap: 8px; }
.kv-row { display: flex; gap: 8px; align-items: center; }
.kv-row input { width: auto; flex: 1; }
.kv-remove { padding: 9px 12px; flex-shrink: 0; }
</style>
