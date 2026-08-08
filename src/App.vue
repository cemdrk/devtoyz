<script setup>
import { tools } from './tools.js'
</script>

<template>
  <header class="site-header">
    <div class="wrap">
      <router-link to="/" class="wordmark">
        <span class="bracket">[</span>devtoy<span class="z">z</span><span class="bracket">]</span>
      </router-link>
      <nav class="nav">
        <router-link v-for="t in tools" :key="t.slug" :to="`/${t.slug}`">
          {{ t.name.toLowerCase() }}
        </router-link>
      </nav>
    </div>
  </header>

  <main>
    <router-view />
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <span>devtoyz · everything runs in your browser</span>
      <a href="https://github.com/cemdrk/devtoyz" target="_blank" rel="noopener">github</a>
    </div>
  </footer>
</template>
