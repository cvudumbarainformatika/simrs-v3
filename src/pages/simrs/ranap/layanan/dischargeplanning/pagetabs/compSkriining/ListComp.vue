<template>
  <div class="full-widt q-pa-sm">
    <q-card v-for="(item, n) in items" :key="n" flat bordered class="q-mb-sm">
      <q-card-section>
        <q-item-section>
          <q-item-label>{{ getSkriningLabel(n) }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label line="5">
            Oleh : <b>{{store?.perawats?.find(x => x?.kdpegsimrs === item?.user_input)?.nama}}</b>
          </q-item-label>
        </q-item-section>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat dense round size="sm" icon="icon-mat-delete" @click="hapusItem(item)" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
// import { useDischargePlanningRanapStore } from 'src/stores/simrs/ranap/dischargeplanning'
import { useSkriiningDischargePlanningRanapStore } from 'src/stores/simrs/ranap/skriingdischargeplanning'

const store = useSkriiningDischargePlanningRanapStore()

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  pasien: {
    type: Object,
    default: null
  }
})
console.log('items', props?.items)
console.log('pasien', props?.pasien)
const $q = useQuasar()

const hapusItem = (item) => {
  $q.dialog({
    title: 'Konfirmasi',
    message: 'Apakah anda yakin ingin menghapus item ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusdata(props?.pasien, item?.id)
  })
}

const getSkriningLabel = (index) => {
  if (index === 0) return 'Pasien Telah di Skrining Pertama'
  if (index === 1 || index === props.items.length - 1) {
    return 'Pasien Telah di Skrining Terakhir'
  }

  return 'Pasien Telah di Skrining'
}
</script>
