<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="p-3 border-b border-black">
    <RouterLink to="/" class="flex items-center">
      <img alt="logo" src="@/assets/logo.png" width="48" height="48" class="mr-3" />
      <h1 class="text-lg">點餐系統</h1>
    </RouterLink>
  </header>
  <div class="max-w-lg mx-auto p-3">
    <RouterView />
  </div>
</template>
