<template>
  <q-page>
    <Suspense>
      <NewSsoPage />
      <template #fallback>
        <app-loading />
      </template>
    </Suspense>
  </q-page>
</template>

<script setup>

import { defineAsyncComponent } from 'vue'
const NewSsoPage = defineAsyncComponent(() => import('./NewSsoPage.vue'))
const AppLoading = defineAsyncComponent(() => import('src/components/~global/AppLoading.vue'))
</script>
