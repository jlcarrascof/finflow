import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Contact, CreateContactDto, UpdateContactDto, ApiError } from '@finflow/types'

export function useContacts() {
  // ── Estado reactivo ────────────────────────────────────────────────────────
  const contacts = ref<Contact[]>([])
  const loading  = ref(false)
  const error    = ref<ApiError | null>(null)

  // ── Computed ───────────────────────────────────────────────────────────────
  const hasError  = computed(() => error.value !== null)
  const isEmpty   = computed(() => contacts.value.length === 0)

  // ── GET /contacts ──────────────────────────────────────────────────────────
  async function fetchContacts(): Promise<void> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<Contact[]>('/contacts')
      contacts.value = data
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  // ── POST /contacts ─────────────────────────────────────────────────────────
  async function createContact(payload: CreateContactDto): Promise<Contact | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post<Contact>('/contacts', payload)
      contacts.value.push(data)
      return data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── PUT /contacts/:id ──────────────────────────────────────────────────────
  async function updateContact(id: number, payload: UpdateContactDto): Promise<Contact | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.put<Contact>(`/contacts/${id}`, payload)
      const index = contacts.value.findIndex(c => c.id === id)
      if (index !== -1) contacts.value[index] = data
      return data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── DELETE /contacts/:id ───────────────────────────────────────────────────
  async function deleteContact(id: number): Promise<boolean> {
    loading.value = true
    error.value   = null
    try {
      await api.delete(`/contacts/${id}`)
      contacts.value = contacts.value.filter(c => c.id !== id)
      return true
    } catch (err) {
      error.value = err as ApiError
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // estado
    contacts,
    loading,
    error,
    // computed
    hasError,
    isEmpty,
    // métodos
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  }
}
