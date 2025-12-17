<template>
  <div class="full-widt q-pa-sm">
    <q-card v-for="(item, n) in items" :key="n" flat bordered class="q-mb-sm">
      <q-card-section>
        <q-item-section>
          <q-item-label class="text-bold q-mb-sm text-primary">Pasien Planning Kontrol </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>No Surat Kontrol : <b>{{ item?.noSuratKontrol }}</b> </q-item-label>
          <q-item-label>Tgl rencana Kontrol : <b>{{ item?.tglRencanaKontrol }}</b> </q-item-label>
          <q-item-label>Poli Kontrol : <b>{{ item?.namaPoli }} ({{ item?.poliKontrol }})</b> </q-item-label>
          <q-item-label>Dokter : <b>{{ item?.namaDokter }} </b> </q-item-label>
          <q-item-label line="5">
            Oleh : <b>{{ store?.perawats?.find(x => x?.kdpegsimrs === item?.user_id)?.nama || '-' }}</b>
          </q-item-label>
        </q-item-section>
      </q-card-section>
      <q-card-actions align="right" class="flex q-gutter-sm">

        <q-btn :disable="index === n" :loading="n === index" flat dense round size="sm" padding="sm"
          icon="icon-mat-print" @click="cetakSuratKontrol(item, n)" />
        <q-btn :disable="index === n" :loading="n === index" flat dense round color="negative" size="sm" padding="sm"
          icon="icon-mat-delete" @click="hapusItem(item, n)" />
      </q-card-actions>
    </q-card>


    <DialogCetakSurakontrol v-model="isCetak" :item="itemx" :pasien="pasien" />

  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useQuasar } from 'quasar'
// import { useDischargePlanningRanapStore } from 'src/stores/simrs/ranap/dischargeplanning'
// import { useSkriiningDischargePlanningRanapStore } from 'src/stores/simrs/ranap/skriingdischargeplanning'

// const store = useSkriiningDischargePlanningRanapStore()
const DialogCetakSurakontrol = defineAsyncComponent(() => import('./DialogCetakSuratkontrol.vue'))

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  pasien: {
    type: Object,
    default: null
  },
  store: {
    type: Object,
    default: null
  }
})

const $q = useQuasar()
const index = ref(null)

const isCetak = ref(false)
const itemx = ref(null)

const cetakSuratKontrol = (item, n) => {
  itemx.value = item
  isCetak.value = true
}
const hapusItem = (item, n) => {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah anda yakin ingin menghapus item ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    index.value = n
    props.store.hapus(item?.noSuratKontrol)
      .then(() => {
        index.value = null
      })
  })
}
</script>
