import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Item, CreateItemDto, UpdateItemDto, ApiError } from '@finflow/types'

export function useItems() {
  const items   = ref<Item[]>([])
  const loading = ref(false)
  const error   = ref<ApiError | null>(null)

  const hasError = computed(() => error.value !== null)
  const isEmpty  = computed(() => items.value.length === 0)
  const inStock  = computed(() => items.value.filter(i => i.stock > 0))

  async function fetchItems(): Promise<void> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<{ data: Item[]; total: number }>('/items')
      items.value = data.data 
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  async function createItem(payload: CreateItemDto): Promise<Item | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post<{ data: Item }>('/items', payload)
      items.value.push(data.data) 
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateItem(id: number, payload: UpdateItemDto): Promise<Item | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.put<{ data: Item }>(`/items/${id}`, payload)
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) items.value[index] = data.data 
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: number): Promise<boolean> {
    loading.value = true
    error.value   = null
    try {
      await api.delete(`/items/${id}`)
      items.value = items.value.filter(i => i.id !== id)
      return true
    } catch (err) {
      error.value = err as ApiError
      return false
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, hasError, isEmpty, inStock, fetchItems, createItem, updateItem, deleteItem }
}