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
              <div class="col-12">
                <q-input v-model="store.form.kodekelasifikasi" label="Kode Klasifikasi" outlined dense
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" disable />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-select v-model="store.form.kelasifikasi" label="Kode Klasifikasi" outlined dense :options="options"
                  use-input option-label="nama" option-value="kode" clearable emit-value map-options
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" @filter="filterFn"
                  @update:model-value="(val) => kodeklasifikasi(val)">
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps"><q-item-section avatar>
                        <q-item-label>
                          <span class="text-bold">{{ scope.opt.kode }} </span><br />
                          <span>{{ scope.opt.nama }}</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Data Tidak Ditemukan....
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row q-pb-md">
              <div class="col-12">
                <q-select label="Tahun Map" outlined dense v-model="store.form.tahunmap" :options="tahunOptions"
                  emit-value map-options option-label="label" option-value="value" />
              </div>
            </div>
            <div class="row q-col-gutter-xs">
              <div class="col-6">
                <q-select v-model="store.form.cabinet" option-label="namacabinet" option-value="id" emit-value
                  map-options label="Lokasi Map Di Feling Cabinet" outlined dense
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" :options="props.kabinet" />
              </div>
              <div class="col-6">
                <q-input type="number" v-model="store.form.laci" label="Lokasi Map Di Laci" outlined dense
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
  kabinet: {
    type: Object,
    default: null
  },
  users: {
    type: String,
    default: ""
  },
})

const options = ref([props.klasifikasi])

function filterFn(val, update) {

  if (val === "") {
    update(() => {
      options.value = props.klasifikasi
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = props.klasifikasi.filter(
      (v) =>
        v.nama.toString().toLowerCase().indexOf(needle) > -1 ||
        v.kode.toString().toLowerCase().indexOf(needle) > -1
    );
  });
}

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

function kodeklasifikasi(val) {
  store.form.kodekelasifikasi = val
}

function onSubmit() {
  store.saveData()
}

const tahun = ref(null)
const currentYear = new Date().getFullYear()

const tahunOptions = [
  { label: currentYear - 2, value: currentYear - 2 },
  { label: currentYear - 1, value: currentYear - 1 },
  { label: currentYear, value: currentYear }
]

</script>
