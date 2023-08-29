import { createClient } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const SUPABASE_URL = 'https://vdbqalvdpryrjckjpocb.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnFhbHZkcHJ5cmpja2pwb2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMzMjI4NDIsImV4cCI6MjAwODg5ODg0Mn0.2svkMkY0Hf5pWjzSt1T-bch9cbrqYcb9V7JUKnnX7SI'

export const useSupabaseStore = defineStore('supabase', () => {
  const supabase = ref(createClient(SUPABASE_URL, SUPABASE_ANON_KEY))

  return { supabase }
})
