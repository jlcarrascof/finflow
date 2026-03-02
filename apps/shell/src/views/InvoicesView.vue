<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import InvoiceList from '@/components/InvoiceList.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-5xl mx-auto px-6 py-8">
      <InvoiceList />
    </main>
  </div>
</template>