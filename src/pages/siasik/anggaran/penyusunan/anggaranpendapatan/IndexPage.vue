<template>
  <q-page class="column full-height" style="overflow: hidden;">
    <q-card flat square class="col column q-ma-sm full-height">
      <q-card-section class="col-auto">
        <div class="full-width row justify-between items-center content-between">
          <div class="bg-white col-grow">
            <div class="flex flex-column items-center flex-center">
              <div class="col text-left">
                <div class="f-14 text-weight-bold">
                  Pengusulan
                </div>
                <div class="title-desc">
                  Anggaran Pendapatan
                </div>
              </div>
            </div>
          </div>
          <div class="flex q-gutter-sm">
            <q-select v-model="store.params.tahun" :disable="store.loading" :loading="store.loading" :options="tahuns"
              outlined dense label="Tahun Anggaran" style="min-width:200px" @update:model-value="val => {
                console.log('Tahun dipilih:', val)
                store.getData()
              }" />
            <!-- <q-input v-model="store.params.q" placeholder="Cari Kelasifikasi ..." dense outlined style="min-width:200px"
              debounce="800" :loading="store.loading" @update:model-value="store.search" standout="bg-yellow-3">
              <template #prepend>
                <q-icon name="icon-mat-search" />
              </template>
</q-input> -->
            <q-input v-model="store.params.q" placeholder="Cari Akun ..." dense outlined style="min-width:200px"
              debounce="800" :loading="store.loading" @update:model-value="store.search" standout="bg-yellow-3">
              <template #prepend>
                <q-icon name="icon-mat-search" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="f-14 text-weight-bold q-pt-sm full-width row justify-end items-end content-end">
          Total Angaran : {{ formatRpDouble(totalPagu || 0) }}
        </div>
      </q-card-section>
      <q-separator />
      <div class="col-grow full-height relative-position">
        <div class="absolute full-width full-height">
          <div class="row full-height">
            <div class="col-4 full-height scroll q-pa-sm">
              <FormPage />
            </div>
            <div class="col-8 full-height bg-grey scroll q-pa-sm">
              <ListPage :listmaster="store.items" @edit="(val) => store.editForm(val)"
                :loading="store.loadingDelete || store.loading" @delete="(val) => hapuskelasifikasi(val)"
                @kunci="(val) => kunciData(val)" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import FormPage from './comp/FormPage.vue';
import ListPage from './comp/ListPage.vue';
import { useQuasar } from 'quasar';
import { useAnggaranPendapatanStore } from 'src/stores/siasik/anggaran/penyusunan/anggaranpendapatan';
import { formatRpDouble } from 'src/modules/formatter';
import { useAplikasiStore } from 'src/stores/app/aplikasi';
const store = useAnggaranPendapatanStore()
const $q = useQuasar()
const options = ref([])
const tahuns = ref([])
const auth = useAplikasiStore()
const user = computed(() => auth.user?.pegawai?.kdpegsimrs)
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

const totalPagu = computed(() => {
  const items = store.items?.reduce((a, b) => a + Number(b?.nilai), 0)
  return items
})
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
  init()
})

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      options.value = store.items
      // console.log('opti', options.value)
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    const arr = options.value

    const filter = ['kode', 'nama']

    const multiFilter = (data = [], filterKeys = [], value = '') =>
      data.filter((item) => filterKeys.some(
        (key) =>
          item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
          item[key]
      )
      )
    const filteredData = multiFilter(arr, filter, needle)
    console.log('filterdata', filteredData)
    options.value = filteredData
    // options.value = store.optionrekening.filter(
    //   (v) => v.uraian.toLowerCase().indexOf(needle) > -1 || v.kodeall3.toLowerCase().indexOf(needle) > -1
    // )
  })
}

const selected = ref([])
function kunciData(row) {
  console.log('id', row)
  if (row.kunci === "1") {
    // Validasi: hanya user super admin yang bisa buka kunci
    if (user?.value !== 'sa') {
      $q.notify({
        type: 'negative',
        message: 'Anda tidak Memiliki Izin Membuka Kunci Data ini, Silahkan Hubungi Admin'
      })
      return
    }
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Membuka Kunci?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // const payload = {
      // notrans: row.notrans,
      // kunci: row.kunci,
      // id: row?.id
      // }
      // console.log('payload', payload)
      store.kunciData(row?.id).then(() => {
        row.kunci = row.kunci === '1' ? '' : '1'
      })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  } else {
    $q.dialog({
      title: 'Peringatan',
      message: 'Apakah Anda yakin akan Mengunci Data?',
      cancel: true,
      persistent: true
    }).onOk(() => {
      // const payload = {
      // notrans: row.notrans,
      // kunci: row.kunci
      // id: row?.id
      // }
      // console.log('payload', payload)
      store.kunciData(row?.id).then(() => {
        row.kunci = row.kunci === '1' ? '' : '1'
      })
    }).onCancel(() => {
      console.log('Cancel')
      selected.value = []
    }).onDismiss(() => {
    })
  }
}
</script>
