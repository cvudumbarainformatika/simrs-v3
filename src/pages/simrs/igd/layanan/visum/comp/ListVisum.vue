<template>
  <q-card flat bordered square class="full-height bg-teal-2" style="overflow: hidden;">
    <q-bar class="bg-teal text-white z-top" style="width: inherit;">
      <div class="f-12">Data Visum</div>
      <q-space />
      <q-btn flat dense round icon="icon-mat-refresh" :loading="store.loadingHistory" @click="store.getDataVisum(pasien?.noreg)">
        <q-tooltip>Refresh data Visum</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section style="padding: 0" class="full-height bg-grey">
      <div v-if="loading" class="column full-height flex-center text-white">
        <div>Harap Tunggu .....</div>
        <div>Sinkron Data Ke DATABASE</div>
      </div>
      <div v-else-if="!store.items.length" class="column full-height flex-center text-white">
        Belum ada data Visum tersimpan
      </div>
      <q-scroll-area v-else style="height: calc(100% - 32px);">
        <q-list class="bg-white" separator>
          <transition-group name="list">
            <q-item v-for="item in store.items" :key="item.id" class="list-move">
              <q-item-section>
                <q-item-label class="text-weight-bold">Visum {{ item.novisum || '-' }}</q-item-label>
                <q-item-label caption>Tanggal Visum: {{ formatDate(item.tgl_visum) }} {{ item.jam || '' }}</q-item-label>
                <q-item-label caption>DPJP: {{ item.dpjp || '-' }}</q-item-label>
                <q-separator class="q-my-sm" />
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6"><q-item-label>Permintaan: <span class="text-weight-bold">{{ item.permintaan || '-' }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>Dari: <span class="text-weight-bold">{{ item.dari || '-' }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>No. Surat: <span class="text-weight-bold">{{ item.nomorsurat || '-' }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>Tanggal Surat: <span class="text-weight-bold">{{ formatDate(item.tgl_surat) }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>Bangsa: <span class="text-weight-bold">{{ item.bangsa || '-' }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>Umur: <span class="text-weight-bold">{{ item.umur || '-' }}</span></q-item-label></div>
                  <div class="col-12 col-sm-6"><q-item-label>Pekerjaan: <span class="text-weight-bold">{{ item.pekerjaan || '-' }}</span></q-item-label></div>
                  <div class="col-12"><q-item-label>Alamat: <span class="text-weight-bold">{{ item.alamat || '-' }}</span></q-item-label></div>
                </div>
              </q-item-section>
              <q-item-section side top>
                <div class="q-gutter-xs">
                  <q-btn flat round dense color="primary" icon="icon-mat-edit" @click="store.editForm(item)">
                    <q-tooltip>Edit Visum</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense color="negative" icon="icon-mat-delete" @click="hapusItem(item)">
                    <q-tooltip>Hapus Visum</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { Dialog } from 'quasar'
import { useVisumStore } from 'src/stores/simrs/igd/visum'

const props = defineProps({
  pasien: { type: Object, default: null },
  loadingaja: Boolean,
})

const store = useVisumStore()
const loading = computed(() => props.loadingaja || store.loadingHistory)

function formatDate (value) {
  return value || '-'
}

function hapusItem (item) {
  Dialog.create({
    title: 'Hapus Visum',
    message: 'Hapus data Visum ini?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await store.deleteData(props.pasien?.noreg, item.id)
    } catch {
      // Notifikasi kesalahan sudah ditampilkan oleh store.
    }
  })
}
</script>
