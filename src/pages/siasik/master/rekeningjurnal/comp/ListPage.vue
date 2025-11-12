<template>
  <div>
    <div v-if="!props?.listmaster?.length" class="column flex-center text-white" style="min-height:400px">
      No Data Available
    </div>
    <q-list v-else bordered class="rounded-borders bg-white" separator square>
      <q-item class="bg-primary text-white">
        <q-item-section style="max-width: 100px;">
          Rekening LRA
        </q-item-section>
        <q-item-section>Uraian</q-item-section>
        <q-item-section side>
          #
        </q-item-section>
      </q-item>
      <q-item v-for="row in listmaster" :key="row?.id" v-ripple class="q-py-xs">
        <q-item-section style="max-width: 100px;">
          {{ row.kode50 }}
        </q-item-section>
        <q-item-section>{{ row.uraian50 }}</q-item-section>
        <q-item-section side>
          <div class="row q-gutter-xs">
            <q-btn flat icon="icon-mat-layers" size="sm" round color="primary" @click="openRincian(row)" />
            <q-btn flat icon="icon-mat-edit" size="sm" round color="primary" @click="emits('edit', row)" />
            <q-btn flat icon="icon-mat-delete" size="sm" round color="negative" @click="emits('delete', row?.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <lihat-rincian v-model="showRincian" :listrincian="selectedRincian" />
  </div>
</template>
<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';

const LihatRincian = defineAsyncComponent(() => import('./DialogRincian.vue'))
const props = defineProps({
  listmaster: {
    type: Array,
    default: () => []
  }
})
const showRincian = ref(false)
const selectedRincian = ref(null)

const openRincian = (row) => {
  selectedRincian.value = row
  showRincian.value = true
}

const emits = defineEmits(['rinci', 'edit', 'delete'])
</script>
