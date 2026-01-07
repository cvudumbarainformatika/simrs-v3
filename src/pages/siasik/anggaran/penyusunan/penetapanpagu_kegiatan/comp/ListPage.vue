<template>
  <div>
    <div v-if="!props?.listmaster?.length" class="column flex-center text-white" style="min-height:400px">
      No Data Available
    </div>
    <q-list v-else bordered class="rounded-borders bg-white" separator square>
      <q-item class="bg-primary text-white">
        <q-item-section>
          No Transaksi
        </q-item-section>
        <q-item-section style="max-width: 50px;">T.A</q-item-section>
        <q-item-section>Bidang/Bagian</q-item-section>
        <q-item-section>Kegiatan</q-item-section>
        <q-item-section class="text-right q-pr-xl">Nilai (Rp)</q-item-section>
        <q-item-section side>
          #
        </q-item-section>
      </q-item>
      <q-item v-for="row in listmaster" :key="row?.id" v-ripple class="q-py-xs">
        <q-item-section>
          {{ row.notrans }}
        </q-item-section>
        <q-item-section style="max-width: 50px;">{{ row.tahun }}</q-item-section>
        <q-item-section>{{ row.namaorganisasi }}</q-item-section>
        <q-item-section>{{ row.kegiatanblud }}</q-item-section>
        <q-item-section class="text-right">{{ formattanpaRp(row.total) }}</q-item-section>
        <q-item-section side>
          <div class="row q-gutter-xs">

            <!-- DELETE (HANYA JIKA BELUM TERKUNCI) -->
            <q-btn v-if="row.kunci !== '1'" flat icon="icon-mat-delete" size="sm" round color="negative"
              @click="emits('delete', row?.id)">
              <q-tooltip>Hapus Data</q-tooltip>
            </q-btn>

            <!-- KUNCI / BUKA KUNCI -->
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
import { useAplikasiStore } from 'src/stores/app/aplikasi';
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

const emits = defineEmits(['rinci', 'edit', 'kunci', 'delete'])
</script>
