<template>
  <VueFinalModal
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-md w-4/5 mx-4 bg-white rounded-lg space-y-2 p-5"
    @before-open="fetchOrderProducts"
  >
    <div v-if="orderProducts.length == 0">目前訂單是空的</div>

    <div v-if="orderProducts.filter((orderProduct) => orderProduct.ordered_at).length > 0">
      <h1 class="text-xl mb-2">
        <span class="mr-3">已下單</span>
        <span>{{
          orderProducts
            .filter((orderProduct) => orderProduct.ordered_at)
            .map((orderProduct) => orderProduct.price)
            .reduce((accum, value) => accum + value, 0)
            .toLocaleString('zh-TW', {
              style: 'currency',
              currency: 'TWD',
              minimumFractionDigits: 0
            })
        }}</span>
      </h1>
      <ol class="list-decimal px-5">
        <li
          v-for="orderProduct in orderProducts.filter((orderProduct) => orderProduct.ordered_at)"
          :key="orderProduct.id"
          class="border-b mb-3"
        >
          {{ orderProduct.name }}:
          {{
            orderProduct.price.toLocaleString('zh-TW', {
              style: 'currency',
              currency: 'TWD',
              minimumFractionDigits: 0
            })
          }}
        </li>
      </ol>
    </div>
    <button class="w-full border border-black py-2 rounded" @click="$emit('close')">取消</button>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { useSupabaseStore } from '@/stores/supabase'
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

const orderProducts = ref<OrderProduct[]>([])
const { supabase } = useSupabaseStore()

const props = defineProps<{
  orderId: number
}>()

const fetchOrderProducts = () => {
  supabase
    .from('order_product')
    .select()
    .eq('order_id', props.orderId)
    .then(({ data, error }) => {
      if (error) {
        alert(`無法取得訂單產品資料：${error.message}`)
      } else {
        orderProducts.value = data as OrderProduct[]
      }
    })
}
</script>
