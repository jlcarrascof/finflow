<script setup lang="ts">
  import AppHeader from '@/components/AppHeader.vue'
  import ContactList from '@/components/ContactList.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      <ContactList />
    </main>
  </div>
</template>
