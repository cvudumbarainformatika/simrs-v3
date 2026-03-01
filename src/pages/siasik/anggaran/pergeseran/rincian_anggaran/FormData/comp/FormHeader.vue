<template>
  <q-card flat class="col full-height">
    <q-form @submit="onSubmit" ref="formNpdLS" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Nomor Penetapan" v-model="store.form.notrans" readonly :disable="store.disableSaved"
            outlined dense />
          <app-input-simrs label="Tahun Anggaran" v-model="store.form.tahun" readonly
            :disable="store.loadingSave || store.disableSaved" outlined dense />
          <app-input-date-human label="Tanggal Pergeseran" :model="store.form.tglperubahan" icon="icon-mat-event"
            outlined :autofocus="false" :disable="store.loadingSave" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Bidang/Bagian" v-model="store.form.bidang" readonly
            :disable="store.loadingSave || store.disableSaved" outlined dense />
          <app-input-simrs label="Kegiatan BLUD" v-model="store.form.uraianblud" readonly
            :disable="store.loadingSave || store.disableSaved" outlined dense />
        </div>

      </div>
      <div class="q-px-sm">
        <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
          <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
            <div class="f-14 text-weight-bold">
              Rincian Pengusulan Anggaran
            </div>
          </div>
        </q-card>
      </div>
    </q-form>
    <FormRincian />
  </q-card>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import FormRincian from './FormRincian.vue'
import { formInputPajakStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formpajak';
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';
import { usePenetapanPaguStore } from 'src/stores/siasik/anggaran/penyusunan/penetapanpagu';
import { api } from 'src/boot/axios';
import { usePergeseranAnggaranStore } from 'src/stores/siasik/anggaran/pergeseran/pergeseranrincian';

const form = ref([])
const store = usePergeseranAnggaranStore()
const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
const master_kegiatan = ref([])
onMounted(async () => {
  init()
  // await ubahTahun(store.form.tahun)

})

function tglTransaksi(val) {
  // console.log('val Parameter', val)
  store.form.tglperubahan = val
  store.params.tgl = val
}
function onSubmit() {
  store.fixed = true
}
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
  // if (!store.form.id) { // kalau FORM BARU
  //   store.form.notrans = null
  //   store.rincians = []
  // }
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

// async function ubahTahun(val) {
//   const currentKode = store.form.kodekegiatanblud

//   store.params.tahun = val
//   await store.getData()
//   await store.getKegiatan()

//   const used = store.items.map(x => Number(x.kodeKegiatan))

//   let hasil = store.kegiatans.filter(k => !used.includes(Number(k.no)))

//   // pastikan kegiatan yg sudah dipilih tetap ada
//   if (currentKode) {
//     const exist = store.kegiatans.find(k => Number(k.no) === Number(currentKode))
//     if (exist && !hasil.some(x => Number(x.no) === Number(exist.no))) {
//       hasil.push(exist)
//     }
//   }

//   store.optionkegiatan = hasil

//   master_kegiatan.value = hasil.map(a => ({
//     ...a,
//     label: `${a.kode} - ${a.nomenklatur}`,
//     value: a.no
//   }))

//   options_kegiatan.value = master_kegiatan.value
// }

async function filterFnKegiatan(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options_kegiatan.value = master_kegiatan.value
    })
    return
  }

  try {
    const resp = await api.get('v1/anggaran/penyusunan/pengusulan/select', {
      params: {
        q: val,
        per_page: 20,
        page: 1
      }
    })
    const data = resp.data.data || []

    update(() => {
      options_kegiatan.value = data.map(a => ({
        ...a,
        label: `${a.kode} - ${a.nomenklatur}`,
        value: a.no
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options_kegiatan.value = []
    })
  }

}
watch(
  () => store.form.tglperubahan,
  (val) => {
    if (!val) return
    store.params.tgl = val
  }
)
watch(
  () => store.form.tahun,
  async (val, oldVal) => {

    if (!val) return
    if (val === oldVal) return

    // console.log('Tahun berubah:', val)

    // await ubahTahun(val)
  }
)

</script>
