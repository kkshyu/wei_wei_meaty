<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 bg-white rounded-lg space-y-2"
  >
    <div class="image-container">
      <img :src="pictureUrl" class="aspect-ratio-2-1" />
    </div>
    <div class="p-4">
      <h1 class="text-xl mb-2">
        <span class="mr-3">{{ title }}</span>
        <span>{{
          price.toLocaleString('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
          })
        }}</span>
      </h1>
      <p class="mb-3 h-24 overflow-auto">
        <slot />
      </p>
      <button
        @click="$emit('submitOrder')"
        class="mb-2 w-full border border-black py-2 rounded bg-black text-white"
      >
        點餐
      </button>
      <!-- cancel button -->
      <button class="w-full border border-black py-2 rounded" @click="$emit('close')">取消</button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  title: string
  price: number
  pictureUrl: string
}>()
</script>

<style scoped>
.image-container {
  width: 100%;
  position: relative;
  padding-bottom: 50%; /* 2:1 aspect ratio */
  overflow: hidden;
}

.aspect-ratio-2-1 {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
