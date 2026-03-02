<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ExpenseList from '@/components/ExpenseList.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      <ExpenseList />
    </main>
  </div>
</template>