<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAuth } from '@/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()
const router = useRouter()
const route  = useRoute()

// 👇 ARRAY ACTUALIZADO: Dashboard en la raíz y Contactos en /contacts
const links = [
  { name: 'Dashboard', path: '/' },
  { name: 'Contactos', path: '/contacts' },
  { name: 'Items',     path: '/items' },
  { name: 'Gastos',    path: '/expenses' },
  { name: 'Facturas',  path: '/invoices' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
    <div class="flex items-center gap-6">
      <span class="font-bold text-gray-800 text-lg cursor-pointer" @click="router.push('/')">
        FinFlow
      </span>
      <ul class="flex items-center gap-4 text-sm">
        <li
          v-for="link in links"
          :key="link.path"
        >
          <button
            @click="router.push(link.path)"
            :class="[
              'px-2 py-1 rounded transition',
              isActive(link.path)
                ? 'text-blue-700 font-semibold border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            {{ link.name }}
          </button>
        </li>
      </ul>
    </div>

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
</template>