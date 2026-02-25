<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'
import ContactList from '@/components/ContactList.vue'

const authStore = useAuthStore()
const { logout } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <span class="font-bold text-gray-800 text-lg">FinFlow</span>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">
          {{ authStore.user?.name }}
          <span class="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
            {{ authStore.user?.role }}
          </span>
        </span>
        <button
          @click="logout"
          class="text-sm text-red-500 hover:text-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>

    <!-- Contenido -->
    <main class="max-w-4xl mx-auto px-6 py-8">
      <ContactList />
    </main>
  </div>
</template>
