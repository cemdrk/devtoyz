<script setup>
defineProps({
  name: { type: String, required: true },
  desc: { type: String, default: '' },
})
</script>

<template>
  <section class="tool">
    <div class="wrap">
      <div class="crumb"><router-link to="/">devtoyz</router-link> / {{ name.toLowerCase() }}</div>
      <h2>{{ name }}</h2>
      <p class="desc">{{ desc }}</p>
      <slot />
    </div>
  </section>
</template>
