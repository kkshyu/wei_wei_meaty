<template>
  <main class="pt-24">
    <div class="mb-10">
      <h1 v-if="defaultSid" class="w-full text-center text-2xl">桌號：{{ sid }}</h1>
      <input
        v-else
        type="text"
        v-model="sid"
        autofocus
        placeholder="請輸入桌號"
        class="border border-black w-full leading-10 px-3 rounded"
      />
    </div>

    <button
      v-if="sid"
      @click="startOrder"
      class="w-full bg-black text-white py-2 rounded relative bottom-3"
    >
      開始點餐
    </button>
  </main>
</template>

<script setup lang="ts">
import { useSupabaseStore } from '@/stores/supabase'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { supabase } = useSupabaseStore()

const defaultSid = route.query.sid?.toString() || ''
const sid = ref(defaultSid)

const startOrder = () => {
  supabase
    .from('order')
    .insert({ sid: sid.value })
    .select()
    .then(({ data, error }) => {
      const order = data?.[0]
      if (order) {
        router.push({ name: 'order', params: { id: order.id } })
      } else {
        alert(`無法點餐：${error}`)
      }
    })
}
</script>
