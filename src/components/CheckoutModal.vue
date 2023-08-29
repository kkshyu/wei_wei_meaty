<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl w-4/5 mx-4 bg-white rounded-lg space-y-2"
  >
    <div class="p-5">
      <h1 class="text-xl mb-2 flex justify-between">
        <span class="mr-3">桌號：{{ sid }}</span>
        <span>{{
          price.toLocaleString('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
          })
        }}</span>
      </h1>

      <button
        @click="$emit('payByCash')"
        class="mb-2 w-full border border-black py-2 rounded bg-black text-white"
      >
        現金
      </button>
      <button
        @click="$emit('payByLine')"
        class="mb-2 w-full border border-black py-2 rounded bg-black text-white"
      >
        Line Pay
      </button>
      <!-- cancel button -->
      <button class="w-full border border-black py-2 rounded" @click="$emit('close')">取消</button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  sid: string
  price: number
}>()
</script>
