<template>
  <!-- <div class="row fit"> -->
  <!-- <div class="col fit"> -->
  <div class="full-height row q-col-gutter-x-xs">
    <div class="full-height" :class="full ? 'col-12' : 'col-8'">
      <q-card flat bordered class="column fit" style="overflow: hidden;">
        <div class="col-auto">
          <BarComp title="Form Pemantauan Intridialitik" bg-color="bg-primary" text-color="text-white"
            @full="full = !full" />
        </div>
        <q-card-section class="col full-height scroll">
          <FormPage />
        </q-card-section>
      </q-card>
    </div>

    <div v-if="!full" class="full-height" :class="full ? 'col-0' : 'col-4'">
      <q-card flat bordered class="column bg-transparent" style="overflow: hidden;">
        <div class="col-auto">
          <BarComp title="Informasi Pemantauan Intridialitik" bg-color="bg-dark" text-color="text-white"
            :btn-full="false" />
        </div>
        <div class="col full-height scroll">
          <ListPage />
        </div>
      </q-card>

    </div>

  </div>
  <!-- </div> -->
  <!-- </div> -->
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const BarComp = defineAsyncComponent(() => import('../../components/BarComp.vue'))
const FormPage = defineAsyncComponent(() => import('./comp/FormPage.vue'))
const ListPage = defineAsyncComponent(() => import('./comp/ListPage.vue'))

const full = ref(false)
</script>
