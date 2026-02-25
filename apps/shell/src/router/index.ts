import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/ContactsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      // Redirige cualquier ruta desconocida al home
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Guard global — protege todas las rutas con requiresAuth: true
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  // Si ya está autenticado y va al login, redirigir al home
  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
