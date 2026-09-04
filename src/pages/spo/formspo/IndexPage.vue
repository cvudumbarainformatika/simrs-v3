<template>
  <q-page class="q-pa-md">
    <FormSpoPage v-if="showForm" />
    <ManageSpoPage v-else />
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FormSpoPage from './comp/FormSpoPage.vue'
import ManageSpoPage from './comp/ManageSpoPage.vue'

const route = useRoute()
const showForm = computed(() => route.query.mode === 'form' || !!route.query.id)
</script>
