<template>
  <q-dialog v-model="store.dialog" :backdrop-filter="backdropFilter" transition-show="flip-down"
    transition-hide="flip-up" class="full-width">
    <q-card class="full-width">
      <q-form ref="refForm" @submit="onSubmit">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Entry Data Map</div>
        </q-card-section>
        <q-separator />

        <q-card-section align="center" class="full-height full-width ">
          <div>
            <div class="row">
              <div class="col-12">
                <q-input v-model="store.form.namamap" label="Nama Map" outlined dense
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-select v-model="store.form.kodeorganisasi" dense outlined :options="organisasix"
                  label="Kepemilikan Map..." option-label="nama" option-value="kode" emit-value map-options
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input type="textarea" v-model="store.form.keterangan" label="Keterangan" outlined
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="red" label="Simpan" tooltip="Simpan Data" type="submit" tip :loading="store.loadingForm" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

</template>
<script setup>

import { useUnitPengelolaharsipMapStore } from 'src/stores/simrs/unitpengelolaarsip/pengolahanmap';
import { computed, ref } from 'vue';


const store = useUnitPengelolaharsipMapStore()
const backdropFilter = ref('blur(4px)')

const props = defineProps({
  klasifikasi: {
    type: Object,
    default: null
  },
  media: {
    type: Object,
    default: null
  },
  lokasiarsip: {
    type: Object,
    default: null
  },
  organisasi: {
    type: Array,
    default: () => []
  },
  users: {
    type: String,
    default: ""
  },
})

const organisasix = computed(() => {
  if (props.users === '' || props.users === null) {
    return props.organisasi
  } else {
    return props.organisasi.filter(x => x.kode === props.users)
  }
})

// function getUnit(val) {
//   store.params.bidangbagian = val
//   store.search()
// }

function onSubmit() {
  store.saveData()
}

</script>
