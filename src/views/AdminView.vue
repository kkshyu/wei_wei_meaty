<template>
  <div class="p-5">
    <div
      v-for="order in orders"
      :key="order.id"
      class="border border-black rounded p-3 mb-3"
      :class="order.paid_at && 'opacity-40'"
    >
      <CheckoutModal
        :modal-id="order.id"
        :sid="order.sid"
        :price="getOrderPrice(order.id)"
        @close="() => vfm.close(order.id)"
        @payByCash="() => payOrder(order.id, 'cash')"
        @payByLine="() => payOrder(order.id, 'line')"
      />

      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <h2 class="text-2xl mr-3 w-12">{{ order.sid }}</h2>
          <small>
            <div>{{ dayjs(order.created_at).format('HH:mm') }}</div>
            <div>{{ dayjs(order.created_at).format('YYYY/MM/DD') }}</div>
          </small>
        </div>
      </div>
      <div class="mb-3">
        <!-- map order products checkbox -->
        <div
          v-for="orderProduct in order.orderProducts"
          :key="orderProduct.id"
          class="border-b mb-3"
        >
          <label class="flex items-center">
            <input
              type="checkbox"
              :checked="!!orderProduct.completed_at"
              :disabled="!!order.paid_at"
              @change="() => completeOrderProduct(orderProduct.id, !orderProduct.completed_at)"
              class="mr-3"
            />
            <span>{{ orderProduct.name }}:</span>
            <span>{{
              orderProduct.price.toLocaleString('zh-TW', {
                style: 'currency',
                currency: 'TWD',
                minimumFractionDigits: 0
              })
            }}</span>
          </label>
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="() => deleteOrder(order.id)" class="text-red-500 text-link py-1">刪除</button>
        <span v-if="order.paid_at">
          {{ order.paid_by == 'cash' ? '現金' : 'Line Pay' }}
          {{
            getOrderPrice(order.id).toLocaleString('zh-TW', {
              style: 'currency',
              currency: 'TWD',
              minimumFractionDigits: 0
            })
          }}
        </span>
        <button
          v-else-if="
            !order.paid_at &&
            !order.orderProducts.some((orderProduct) => !orderProduct.completed_at)
          "
          @click="() => vfm.open(order.id)"
          class="border rounded bg-black text-white px-3"
        >
          結帳
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckoutModal from '@/components/CheckoutModal.vue'
import { useSupabaseStore } from '@/stores/supabase'
import dayjs from 'dayjs'
import { onMounted, onUnmounted, ref } from 'vue'
import { useVfm } from 'vue-final-modal'

const { supabase } = useSupabaseStore()
const orders = ref<(Order & { orderProducts: OrderProduct[] })[]>([])
const vfm = useVfm()

const fetchOrders = () => {
  supabase
    .from('order')
    .select(`*, order_product ( * )`)
    .then(({ data, error }) => {
      if (error) {
        alert(`無法取得訂單產品資料：${error.message}`)
      } else {
        orders.value = data
          .filter((v) => v.order_product.length > 0)
          .sort((a: Order, b: Order) => (a.created_at < b.created_at ? 1 : -1))
          .map((v) => {
            return {
              id: v.id,
              sid: v.sid,
              created_at: v.created_at,
              paid_at: v.paid_at,
              paid_by: v.paid_by,
              orderProducts: v.order_product.sort((a: OrderProduct, b: OrderProduct) =>
                a.id > b.id ? 1 : -1
              )
            }
          })
      }
    })
}

const completeOrderProduct = (orderProductId: number, completed: Boolean) => {
  supabase
    .from('order_product')
    .update({ completed_at: completed ? new Date() : null })
    .match({ id: orderProductId })
    .then(({ data, error }) => {
      if (error) {
        alert(`無法完成訂單產品：${error.message}`)
      } else {
        fetchOrders()
      }
    })
}

const getOrderPrice = (orderId: number) => {
  return (
    orders.value
      .find((order) => order.id == orderId)
      ?.orderProducts.filter((orderProduct) => orderProduct.completed_at)
      .reduce((accum, v) => accum + v.price, 0) || 0
  )
}

const payOrder = (orderId: number, paidBy: 'cash' | 'line') => {
  supabase
    .from('order')
    .update({ paid_at: new Date(), paid_by: paidBy })
    .match({ id: orderId })
    .then(({ data, error }) => {
      if (error) {
        alert(`無法完成訂單產品：${error.message}`)
      } else {
        fetchOrders()
      }
      vfm.close(orderId)
    })
}

const deleteOrder = (orderId: number) => {
  if (confirm('確定要刪除訂單嗎？此動作無法復原。')) {
    supabase
      .from('order_product')
      .delete()
      .match({ order_id: orderId })
      .then(({ data, error }) => {
        if (error) {
          alert(`無法刪除訂單產品：${error.message}`)
        } else {
          fetchOrders()
        }
      })
      .then(() => {
        supabase
          .from('order')
          .delete()
          .match({ id: orderId })
          .then(({ data, error }) => {
            if (error) {
              alert(`無法刪除訂單：${error.message}`)
            } else {
              fetchOrders()
            }
          })
      })
  }
}

// set interval to fetch orders while mounted, and remove interval while unmounted
onMounted(() => {
  fetchOrders()
  const interval = setInterval(() => {
    fetchOrders()
  }, 1000)
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
