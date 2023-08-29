<template>
  <main class="pt-5">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl p-3">桌號：{{ order?.sid }}</h2>
      <button @click="() => vfm.open('cart')" class="border rounded bg-black text-white p-3">
        查看餐點
      </button>
      <CartModal
        v-if="order"
        modal-id="cart"
        :order-id="order.id"
        @close="() => vfm.close('cart')"
      />
    </div>

    <!-- map product -->
    <div
      v-for="product in products"
      :key="product.id"
      @click="() => vfm.open(product.id)"
      class="cursor-pointer p-3 mb-2 border rounded-md hover:border-black"
    >
      <div class="flex justify-between">
        <span>{{ product.name }}</span>
        <span>{{
          product.price.toLocaleString('zh-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
          })
        }}</span>
      </div>
      <ProductModal
        :modal-id="product.id"
        :title="product.name"
        :picture-url="product.picture_url"
        :price="product.price"
        @close="() => vfm.close(product.id)"
        @submitOrder="() => submitOrder(product.id)"
      >
        {{ product.description }}
      </ProductModal>
    </div>
  </main>
</template>
<script setup lang="ts">
import CartModal from '@/components/CartModal.vue'
import ProductModal from '@/components/ProductModal.vue'
import { useSupabaseStore } from '@/stores/supabase'
import { ref } from 'vue'
import { useVfm } from 'vue-final-modal'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabaseStore()
const products = ref<Product[]>([])
const order = ref<Order>()

const vfm = useVfm()

// get order
supabase
  .from('order')
  .select()
  .eq('id', route.params.id)
  .then(({ data }) => {
    if (data?.[0]) {
      order.value = data?.[0] as Order
    } else {
      router.push('/not-found')
    }
  })

supabase
  .from('product')
  .select()
  .then(({ data }) => {
    products.value = data as Product[]
  })

const submitOrder = (productId: number) => {
  if (confirm('確定要點餐嗎？')) {
    supabase
      .from('order_product')
      .insert({
        order_id: order.value?.id,
        product_id: productId,
        name: products.value.find((v) => v.id === productId)?.name,
        price: products.value.find((v) => v.id === productId)?.price,
        ordered_at: new Date()
      })
      .then(({ data, error }) => {
        if (error) {
          alert(`無法下單：${error.message}`)
        } else {
          alert('下單成功！')
          vfm.close(productId)
        }
      })
  }
}
</script>
