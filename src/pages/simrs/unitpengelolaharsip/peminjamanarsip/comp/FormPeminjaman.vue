<template>
  <div>
    <!-- Form Pencarian -->
    <q-card class="q-ma-md q-pa-md shadow-2 rounded-borders">
      <div class="text-subtitle1 text-primary text-weight-medium q-mb-md">
        🔍 Cari Arsip
        <q-separator />
      </div>
      <q-form @submit="onSearch">
        <div class="row q-col-gutter-xs items-center">
          <div class="col-12 col-md-2">
            <q-input v-model="store.params.noarsip" outlined dense label="No. Arsip" clearable debounce="300"
              :loading="store.loading" />
          </div>
          <div class="col-12 col-md-2">
            <q-select v-model="store.params.kodekelasifikasi" outlined dense label="Masukkan Kelasifikasi" clearable
              debounce="300" :loading="store.loading" option-label="nama" option-value="kode" use-input map-options
              emit-value :options="options" @filter="filterFn" />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="store.params.deskripsi" outlined dense label="Masukkan Deskripsi" clearable debounce="300"
              :loading="store.loading" />
          </div>
          <div class="col-12 col-md-2"
            v-if="appstore?.user?.pegawai?.kdarteri === '' || appstore?.user?.pegawai?.kdarteri === null">
            <q-select v-model="store.params.bidangbagian" outlined dense label="Masukkan Unit Pengelolah" clearable
              debounce="300" :loading="store.loading" option-label="nama" option-value="kode" map-options
              :options="organisasi" @update:model-value="(val) => {
                store.params.bidangbagian = val.kode
              }" />
          </div>
          <div class="col-12 col-md-1 flex ">
            <q-btn color="primary" icon="icon-mat-search" label="Cari Arsip" unelevated type="submit"
              :loading="store.loading" />
          </div>
          <div class="col-12 col-md-2 flex">
            <q-btn v-if="store.form.rincian.length > 0" color="primary" icon="icon-mat-add" label="Ajukan Peminjaman"
              unelevated @click="onAjukan()" :loading="store.loading" />
          </div>
        </div>
      </q-form>
    </q-card>
    <q-card class="q-ma-md q-pa-md shadow-2 rounded-borders">
      <ListArsip :items="store.items" :loading="store.loading" :peminjamarsip="true" />
    </q-card>
  </div>
  <DialogFormPeminjaman :pegawai="props.pegawai" :organisasi="props.organisasi" />
</template>

<script setup>
import { useAplikasiStore } from "src/stores/app/aplikasi";
import { useUnitPengelolaharsippeminjamanStore } from "src/stores/simrs/unitpengelolaarsip/peminjamanarsip";
import { onMounted, ref } from "vue";

import ListArsip from "../../arsip/comp/ListArsip.vue";
import DialogFormPeminjaman from "./DialogFormPeminjaman.vue";
import pegawai from "src/router/pegawai";
const store = useUnitPengelolaharsippeminjamanStore()
// const storeorganisasi = useUnitPengelolaharsippeminjamanStore()
// const storeklaisifikasi = useArsipMasterKelasifikasiStore()
const appstore = useAplikasiStore()

const props = defineProps({
  kelasifikasi: {
    type: Array,
    default: () => []
  },
  organisasi: {
    type: Array,
    default: () => []
  },
  pegawai: {
    type: Array,
    default: () => []
  },
})

function onSearch() {
  store.getCariData()
}

const options = ref(props.kelasifikasi)

function filterFn(val, update) {

  if (val === "") {
    update(() => {
      options.value = props.kelasifikasi
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();

    options.value = props.kelasifikasi.items.filter(
      (v) =>
        v.nama.toString().toLowerCase().indexOf(needle) > -1 ||
        v.kode.toString().toLowerCase().indexOf(needle) > -1
    );
  });
}

function onAjukan() {
  store.dialog = true
}

onMounted(() => {
  store.params.noarsip = ''
  store.params.kodekelasifikasi = ''
  store.params.deskripsi = ''
  // store.form.noarsip = []
  store.items = []
  store.params.bidangbagian = appstore?.user?.pegawai?.kdarteri
  store.form.rincian = []
  // storeorganisasi.getDataorganisasi()
  // storeklaisifikasi.getMkelasifikasi()
});
</script>
