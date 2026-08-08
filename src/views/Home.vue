<script setup>
import { tools } from '../tools.js'
</script>

<template>
  <div class="wrap">
    <section class="hero">
      <h1>dev·toy<span class="z">z</span></h1>
      <p>A pocket workbench of everyday developer utilities. Pick a tool off the board and go.</p>
      <span class="privacy"><span class="dot"></span> nothing leaves your browser</span>
    </section>

    <section class="grid">
      <router-link v-for="t in tools" :key="t.slug" :to="`/${t.slug}`" class="card">
        <div class="card-top">
          <h3>{{ t.name }}</h3>
          <span class="tag">{{ t.tag }}</span>
        </div>
        <p>{{ t.blurb }}</p>
      </router-link>
    </section>
  </div>
</template>
