<template>
  <q-card flat class="col full-height">
    <!-- <q-form @submit="onSubmit" ref="formNpdLS" class="full-height"> -->
    <div class="row q-pa-sm q-col-gutter-md">
      <div class="col-6 q-gutter-y-md">
        <app-input-simrs label="Nomor Transaksi" v-model="store.form.notrans" readonly :disable="store.disableSaved"
          outlined dense />

      </div>
      <div class="col-3 q-gutter-y-md">
        <app-input-date-human label="Tanggal Transaksi" :model="store.params.tgl" icon="icon-mat-event" outlined
          :autofocus="false" :disable="store.loadingSave || store.disableSaved" @db-model="tglTransaksi"
          :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
      </div>
      <div class="col-3 q-gutter-y-md">
        <q-select v-model="store.form.tahun" :disable="store.loadingSave || store.disableSaved"
          :loading="store.loadingSave" :options="tahuns" outlined dense label="Tahun Anggaran"
          @update:model-value="ubahTahun" />
      </div>

      <div class="col-6 q-gutter-y-md">
        <q-select v-model="store.form.kodekegiatan" use-input outlined standout="bg-yellow-3" dense emit-value
          map-options option-value="kodeKegiatan" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
          :options="options_kegiatan" clearable option-label="kegiatan" :display-value="store.form.kegiatan"
          :disable="store.loadingSave || store.disableSaved" :loading="store.loadingSave" @filter="filterFnKegiatan"
          @clear="store.setForm('kodekegiatan', null)" @update:model-value="updateKegiatans">
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">Data Tidak Ditemukan / Sudah Ada di List</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-3 q-gutter-y-md">
        <app-input-simrs label="Bidang/Bagian" v-model="store.form.namabidang" readonly
          :disable="store.loadingSave || store.disableSaved" outlined dense />
      </div>
      <div class="col-3 q-gutter-y-md">
        <app-input-simrs label="Pejabat Teknis Kegiatan" v-model="store.form.pptk" readonly
          :disable="store.loadingSave || store.disableSaved" outlined dense />
      </div>
    </div>

    <div class="row q-pa-sm q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="q-pa-md">
          <!-- HEADER -->
          <div class="row q-col-gutter-sm text-grey-7 q-mb-xs">
            <div class="col-2 text-weight-bold">Indikator</div>
            <div class="col-7 text-weight-bold">Tolak Ukur Kerja</div>
            <div class="col-3 text-weight-bold">Target Kinerja</div>
          </div>

          <!-- CAPAIAN KEGIATAN -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-2 text-weight-bold self-center">
              Capaian Kegiatan
            </div>
            <div class="col-7">
              <q-input v-model="store.form.capaianprogram" :disable="store.loadingSave || store.disableSaved" outlined
                dense />
            </div>
            <div class="col-3">
              <q-input v-model="store.form.targetcapaian" :disable="store.loadingSave || store.disableSaved" outlined
                dense />
            </div>
          </div>

          <!-- MASUKAN -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-2 text-weight-bold self-center">
              Masukan
            </div>
            <div class="col-7">
              <q-input v-model="store.form.masukan" :disable="store.loadingSave || store.disableSaved" readonly outlined
                dense />
            </div>
            <div class="col-3">
              <q-input v-model="paguDisplay" :disable="store.loadingSave || store.disableSaved" outlined dense />
            </div>
          </div>

          <!-- KELUARAN -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-2 text-weight-bold self-center">
              Keluaran
            </div>
            <div class="col-7">
              <q-input v-model="store.form.keluaran" :disable="store.loadingSave || store.disableSaved" outlined
                dense />
            </div>
            <div class="col-3">
              <q-input v-model="store.form.targetkeluaran" :disable="store.loadingSave || store.disableSaved" outlined
                dense />
            </div>
          </div>

          <!-- HASIL -->
          <div class="row q-col-gutter-sm">
            <div class="col-2 text-weight-bold self-center">
              Hasil
            </div>
            <div class="col-7">
              <q-input v-model="store.form.hasil" :disable="store.loadingSave || store.disableSaved" outlined dense />
            </div>
            <div class="col-3">
              <q-input v-model="store.form.targethasil" :disable="store.loadingSave || store.disableSaved" outlined
                dense />
            </div>
          </div>

        </q-card>
      </div>
    </div>


    <div class="q-px-sm">
      <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
        <div class="row items-center justify-between text-primary q-pa-sm q-my-sm q-px-sm">
          <div class="f-14 text-weight-bold">
            <span class="q-pr-sm">Tambah Rincian Anggaran</span>
            <q-btn :loading="store.loading" round size="sm" dense color="primary" icon="add"
              @click="openDialogRincian" />
          </div>
        </div>
      </q-card>
    </div>
    <!-- </q-form> -->
    <FormRincian v-model="dialogRincian" @pilih="onPilihRincian" />
  </q-card>
</template>
<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import FormRincian from './FormRincian.vue'
import { api } from 'src/boot/axios';
import { usePrioritasAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas';
import { formattanpaRp } from 'src/modules/formatter';

const form = ref([])
const store = usePrioritasAnggaranStore()
const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
const master_kegiatan = ref([])
const dialogRincian = ref(false)

const openDialogRincian = () => {


  const cari = store.optionkegiatan.find(
    x => Number(x.kodeKegiatan) === Number(store.form.kodekegiatan)
  )
  const allRincian = Array.isArray(cari?.rincian)
    ? cari.rincian
    : []
  // kode yang sudah dipakai
  const usedKode = new Set(
    (store.form.rincian || [])
      .map(r => r.koders)
      .filter(Boolean)
  )
  // hanya ambil yang BELUM dipakai
  store.getRincian = allRincian
    .filter(r => !usedKode.has(r.kode))
    .map(r => ({ ...r }))
  dialogRincian.value = true
}

const onPilihRincian = (item) => {
  console.log('Rincian dipilih:', item)
  // contoh:
  // store.tambahRincian(item)
}

onMounted(async () => {
  init()
  await ubahTahun(store.form.tahun)
})
const paguDisplay = computed({
  get() {
    return formattanpaRp(store.form.pagu || 0)
  },
  set(val) {
    // buang semua selain angka
    const raw = String(val).replace(/[^\d]/g, '')
    store.form.pagu = raw ? parseInt(raw) : 0
  }
})
function tglTransaksi(val) {
  // console.log('val Parameter', val)
  store.form.tgltrans = val
  store.params.tgl = val
}
function onSubmit() {
  store.fixed = true
}
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
  if (!store.form.id) { // kalau FORM BARU
    store.form.notrans = null
    store.rincians = []
  }
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
async function updateKegiatans(val) {

  val = Number(val)
  const arr = store.optionkegiatan || []
  console.log('store.getRincian', arr)
  const cari = arr.find(x => Number(x.kodeKegiatan) === val)
  store.form.kodekegiatan = val
  store.form.kegiatan = cari ? cari.kegiatan : ''
  store.form.kodepptk = cari ? cari.kodepptk : ''
  store.form.pptk = cari ? cari.namapptk : ''
  store.form.kodebidang = cari ? cari.kodebagian : ''
  store.form.namabidang = cari ? cari.ruangan : ''
  store.form.pagu = cari ? cari.paguanggaran : ''
  store.form.nousulan = cari ? cari.nousulan : ''
  store.getRincian = cari?.rincian
    ? cari.rincian.map(r => ({ ...r }))
    : []
}
async function ubahTahun(val) {
  const currentKode = store.form.kodekegiatan

  store.params.tahun = val
  await store.getData()
  await store.getKegiatan()

  const used = store.items.map(x => Number(x.kodekegiatan))

  let hasil = store.kegiatans.filter(k => !used.includes(Number(k.kodeKegiatan)))


  // pastikan kegiatan yg sudah dipilih tetap ada
  if (currentKode) {
    const exist = store.kegiatans.find(k => Number(k.kodeKegiatan) === Number(currentKode))
    if (exist && !hasil.some(x => Number(x.kodeKegiatan) === Number(exist.kodeKegiatan))) {
      hasil.push(exist)
    }
  }

  store.optionkegiatan = hasil


  master_kegiatan.value = hasil.map(a => ({
    ...a,
  }))

  options_kegiatan.value = master_kegiatan.value
  console.log('optionkegiatan', options_kegiatan.value)
}

async function filterFnKegiatan(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options_kegiatan.value = master_kegiatan.value
    })
    return
  }

  try {
    const resp = await api.get('v1/anggaran/penyusunan/prioritas/select', {
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
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options_kegiatan.value = []
    })
  }

}


</script>
