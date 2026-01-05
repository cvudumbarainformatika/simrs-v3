<template>
  <div>
    <div v-if="!props?.listmaster?.length" class="column flex-center text-white" style="min-height:400px">
      No Data Available
    </div>
    <q-list v-else bordered class="rounded-borders bg-white" separator square>
      <q-item class="col bg-primary text-left text-white">
        <q-item-section class="text-left"> No Transaksi </q-item-section>
        <q-item-section class="col">T.A</q-item-section>
        <q-item-section class="col">Rekening</q-item-section>
        <q-item-section class="col-4">Uraian</q-item-section>
        <q-item-section class="text-right">Nilai (Rp)</q-item-section>
        <q-item-section side class="col-2">
          #
        </q-item-section>
      </q-item>
      <q-item v-for="row in listmaster" :key="row?.id" v-ripple class="q-py-xs">
        <q-item-section class="text-left">{{ row.notrans }}</q-item-section>
        <q-item-section class="col">{{ row.tahun }}</q-item-section>
        <q-item-section class="col">{{ row.koderekeningblud }}</q-item-section>
        <q-item-section class="col-4">{{ row.uraian_rekening }}</q-item-section>
        <q-item-section class="text-right">{{ formattanpaRp(row.nilai) }}</q-item-section>
        <q-item-section side class="col-2">
          <div class="row">
            <!-- <q-btn flat icon="icon-mat-layers" size="sm" round color="primary" @click="openRincian(row)" /> -->
            <q-btn v-if="row.kunci !== '1'" flat icon="icon-mat-edit" size="sm" round color="primary"
              @click="emits('edit', row)">
              <q-tooltip>Edit Data</q-tooltip>
            </q-btn>
            <q-btn v-if="row.kunci !== '1'" flat icon="icon-mat-delete" size="sm" round color="negative"
              @click="emits('delete', row?.id)">
              <q-tooltip>Delete Data</q-tooltip>
            </q-btn>
            <q-btn flat :icon="row.kunci === '1' ? 'icon-mat-lock' : 'icon-mat-key'" size="sm" round
              :color="row.kunci === '1' ? 'red-9' : 'orange'" @click="emits('kunci', row)">
              <q-tooltip>
                {{ row.kunci === '1' ? 'Buka Kunci' : 'Kunci Data' }}
              </q-tooltip>
            </q-btn>

          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- <lihat-rincian v-model="showRincian" :listrincian="selectedRincian" /> -->
  </div>
</template>
<script setup>
import { Loading } from 'quasar';
import { formattanpaRp } from 'src/modules/formatter';
import { computed, defineAsyncComponent, ref } from 'vue';

// const LihatRincian = defineAsyncComponent(() => import('./DialogRincian.vue'))
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

const emits = defineEmits(['rinci', 'edit', 'delete', 'kunci'])
</script>
