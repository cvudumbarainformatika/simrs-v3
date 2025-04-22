<template>
  <q-form ref="refForm" class="full-height bg-grey-3">
    <div class="row q-mt-sm ">
      <div class="col-4 q-gutter-lg">
        <q-radio v-model="store.form.carabayar" val="Tunai" label="Tunai" size="sm" dense
          @update:model-value="(val) => jeniscarabayar(val)" />
      </div>
      <div class="col-4">
        <q-radio v-model="store.form.carabayar" val="Qris" label="Qris" size="sm" dense
          @update:model-value="(val) => jeniscarabayar(val)" />
      </div>
      <div class="col-4">
        <q-radio v-model="store.form.carabayar" val="VA" label="VA" size="sm" dense
          @update:model-value="(val) => jeniscarabayar(val)" />
      </div>
    </div>
    <!-- <div class="row q-mt-sm">
      <div class="col-4">
        <q-btn color="primary" label="SIMPAN" />
      </div>
    </div> -->
  </q-form>
</template>
<script setup>
import { useQuasar } from 'quasar';
import { useKasirRajalListKunjunganStore } from 'src/stores/simrs/kasir/rajal/kunjungan';
import { usePembayaranKasirRajalStore } from 'src/stores/simrs/kasir/rajal/pembayaran';
import { ref } from 'vue';

const refForm = ref(null)
const store = usePembayaranKasirRajalStore()
const storex = useKasirRajalListKunjunganStore()
const $q = useQuasar()

const prop = defineProps({
  pasien: { type: Object, default: () => { } },
  billing: { type: Object, default: () => { } },
  kwitansi: { type: Array, default: () => [] },
  jenislayanan: { type: String, default: '' },
})

function jeniscarabayar(val) {
  if (storex.jenispembayaran === '' || storex.jabatan === null) {
    $q.notify({
      type: 'negative',
      title: 'Peringatan',
      message: 'INFO WARNING <b/> MAAF,<em><b>Anda Belum Memilih Jenis Pelayanan</b></em>',
      html: true,
      timeout: 1000
    })
    store.form.carabayar = ''
  } else {
    if (val === 'Tunai') {
      $q.dialog({
        dark: true,
        title: 'Peringatan',
        message: 'Apakah Data ini akan DISIMPAN?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('OK')
        store.savePembayaran(prop.pasien, prop.billing, prop.jenislayanan, val)
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>
