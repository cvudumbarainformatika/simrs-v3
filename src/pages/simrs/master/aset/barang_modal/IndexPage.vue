<template>
  <q-page class="column full-height" style="overflow: hidden;">
    <q-card flat square class="col column q-ma-sm full-height">
      <q-card-section class="col-auto">
        <div class="full-width row justify-between items-center content-between">
          <div class="bg-white col-grow">
            <div class="flex flex-column items-center flex-center">
              <div class="col text-left">
                <div class="f-14 text-weight-bold">
                  Barang Modal
                </div>
                <div class="title-desc">
                  Master Barang Modal RSUD
                </div>
              </div>
            </div>
          </div>
          <div class="flex q-gutter-sm">
            <!-- <q-select v-model="store.params.tahun" :disable="store.loading" :loading="store.loading" :options="tahuns"
              outlined dense label="Tahun Anggaran" style="min-width:200px" @update:model-value="val => {
                console.log('Tahun dipilih:', val)
                store.getData()
              }" /> -->
            <!-- <q-input v-model="store.params.q" placeholder="Cari Kelasifikasi ..." dense outlined style="min-width:200px"
              debounce="800" :loading="store.loading" @update:model-value="store.search" standout="bg-yellow-3">
              <template #prepend>
                <q-icon name="icon-mat-search" />
              </template>
</q-input> -->
            <q-input v-model="store.params.q" placeholder="Cari Barang ..." dense outlined style="min-width:200px"
              debounce="800" :loading="store.loading" @update:model-value="store.search" standout="bg-yellow-3">
              <template #prepend>
                <q-icon name="icon-mat-search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <div class="col-grow full-height relative-position">
        <div class="absolute full-width full-height">
          <div class="row full-height">
            <div class="col-4 full-height scroll q-pa-sm">
              <FormPage :barang108s="store.itemsrek108" :koderek50="store.itemsrek50" :kodeaspak="store.itemsaspak" />
            </div>
            <div class="col-8 full-height bg-grey scroll q-pa-sm">
              <ListPage :listmaster="store.items" @edit="(val) => store.editForm(val)"
                :loading="store.loadingDelete || store.loading" @delete="(val) => hapuskelasifikasi(val)" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import FormPage from './comp/FormPage.vue';
import ListPage from './comp/ListPage.vue';
import { useQuasar } from 'quasar';
import { useMasterBarangModalStore } from 'src/stores/simrs/master/aset/barang_modal/barangmodal';
const store = useMasterBarangModalStore()
const $q = useQuasar()
const tahuns = ref([])

function hapuskelasifikasi(id) {
  console.log('sasa', id)
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(id)
  }).onCancel(() => {
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
function init() {
  const d = new Date()
  store.params.tahun = d.getFullYear()
  generateArrayOfYears()
}
function generateArrayOfYears() {
  const current = new Date().getFullYear()
  const years = []

  for (let i = current + 2; i >= current - 1; i--) {
    years.push(i)
  }

  tahuns.value = years
}

onMounted(() => {
  store.getData()
  store.getrek108()
  store.getrek50()
  store.getkodeaspak()
  // init()
})
</script>
