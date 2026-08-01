<template>
  <q-card flat class="col full-height">
    <q-form @submit="onSubmit" ref="formNpdLS" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Nomor Pengusulan" v-model="store.form.notrans" readonly :disable="store.disableSaved"
            outlined dense />
          <q-select v-model="store.form.tahun" :disable="store.loadingSave || store.disableSaved"
            :loading="store.loadingSave" :options="tahuns" outlined dense label="Tahun Anggaran"
            @update:model-value="ubahTahun" />
          <app-input-date-human label="Tanggal Transaksi" :model="store.params.tgl" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.loadingSave || store.disableSaved" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Bidang/Bagian" v-model="store.form.ruangan" readonly
            :disable="store.loadingSave || store.disableSaved" outlined dense />

          <q-select v-model="store.form.kodeKegiatan" use-input outlined standout="bg-yellow-3" dense emit-value
            map-options option-value="value" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
            :options="options_kegiatan" clearable option-label="label" :display-value="store.form.kegiatan"
            :disable="store.loadingSave || store.disableSaved" :loading="store.loadingSave" @filter="filterFnKegiatan"
            @clear="store.setForm('kodeKegiatan', null)" @update:model-value="PilihKegiatan">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Data Tidak Ditemukan / Sudah Ada di List</q-item-section>
              </q-item>
            </template>
          </q-select>
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
            <div class="row q-col-gutter-sm q-mb-sm" autogrow>
              <div class="col-2 text-weight-bold self-center">
                Masukan
              </div>
              <div class="col-7">
                <q-input v-model="store.form.masukan" :disable="store.loadingSave || store.disableSaved" readonly
                  outlined dense />
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
                <q-input v-model="store.form.keluaran" type="textarea" autogrow
                  :disable="store.loadingSave || store.disableSaved" outlined />
              </div>
              <div class="col-3">
                <q-input v-model="store.form.targetkeluaran" type="textarea" autogrow
                  :disable="store.loadingSave || store.disableSaved" outlined />
              </div>
            </div>

            <!-- HASIL -->
            <div class="row q-col-gutter-sm">
              <div class="col-2 text-weight-bold self-center">
                Hasil
              </div>
              <div class="col-7">
                <q-input v-model="store.form.hasil" :disable="store.loadingSave || store.disableSaved" outlined
                  type="textarea" autogrow />
              </div>
              <div class="col-3">
                <q-input v-model="store.form.targethasil" :disable="store.loadingSave || store.disableSaved" outlined
                  type="textarea" autogrow />
              </div>
            </div>

          </q-card>
        </div>
      </div>
      <div class="q-px-sm">
        <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
          <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
            <div class="f-14 text-weight-bold">
              <span class="q-pr-sm">Rincian Perubahan Anggaran</span>

            </div>
          </div>
        </q-card>
      </div>
      <div class="row q-px-sm q-py-sm q-gutter-sm">
        <q-btn :loading="store.loading" dense color="primary" label="Tambah Rincian Sebelumnya" class="q-px-sm"
          @click="openDialogRincian" />
        <q-btn :loading="store.loading" dense color="primary" label="Rincian Baru" class="q-px-sm"
          @click="RincianBaru" />
      </div>

    </q-form>
    <FormRincian v-if="openDialogRincianBaru === true" />
    <DialogDataItemlama v-model="dialogBaranglama" />
  </q-card>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import FormRincian from './FormRincian.vue'
import { formInputPajakStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formpajak';
import { usePenetapanPaguStore } from 'src/stores/siasik/anggaran/penyusunan/penetapanpagu';
import { api } from 'src/boot/axios';
import { usePerubahanAnggaranBelanja_PAK } from 'src/stores/siasik/anggaran/perubahan/anggaranbelanja.js';
import DialogDataItemlama from './DialogDataItemlama.vue';
import { computed } from 'vue';
import { formattanpaRp } from 'src/modules/formatter.js';
import { useQuasar } from 'quasar';

const form = ref([])
const store = usePerubahanAnggaranBelanja_PAK()
const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
const master_kegiatan = ref([])
const dialogBaranglama = ref(false)
const openDialogRincianBaru = ref(false)
onMounted(async () => {
  if (!store.form.id) {
    init()
    store.disableSaved = false
  }
  await ubahTahun(store.form.tahun)
})


const PilihKegiatan = async (val) => {
  // console.log('val', val)
  val = Number(val)
  const arr = store.optionkegiatan || []
  const cari = arr.find(x => Number(x.no) === val)
  // console.log('cari', cari)
  store.form.kodeKegiatan = val
  store.form.kegiatan = cari ? cari.nomenklatur : ''
  store.form.ruangan = cari ? cari.namaorganisasi : ''
  store.form.kodeRuangan = cari ? cari.kode : ''
  store.form.kodebagian = cari ? cari.kode : ''
  store.form.organisasi_nama = cari ? cari.namaorganisasi : ''
  store.form.kodepptk = cari ? cari.kodepptk : ''
  store.form.pptk = cari ? cari.namapptk : ''
  store.form.paguanggaran = cari ? Number(cari.total) : 0
  store.form.masukan = 'Dana yang Dibutuhkan'
  store.form.capaianprogram = cari ? cari.capaianprogram : ''
  store.form.targetcapaian = cari ? cari.targetcapaian : ''
  store.form.targetmasukan = cari ? cari.targetmasukan : ''
  store.form.keluaran = cari ? cari.keluaran : ''
  store.form.targetkeluaran = cari ? cari.targetkeluaran : ''
  store.form.hasil = cari ? cari.hasil : ''
  store.form.targethasil = cari ? cari.targethasil : ''

  await store.getBarangslama()

}

const paguDisplay = computed({
  get() {
    return formattanpaRp(store.form.paguanggaran || 0)
  },
  set(val) {
    // buang semua selain angka
    const raw = String(val).replace(/[^\d]/g, '')
    store.form.paguanggaran = raw ? parseInt(raw) : 0
  }
})
const $q = useQuasar()
const Indikator = computed(() => {
  return [
    store.form.capaianprogram,
    store.form.targetcapaian,
    store.form.keluaran,
    store.form.targetkeluaran,
    store.form.hasil,
    store.form.targethasil
  ].every(val => val !== null && val !== undefined && String(val).trim() !== '')
})
const RincianBaru = () => {
  if (!Indikator.value) {
    $q.notify({
      type: 'negative',
      message: 'Indikator Harap di isi Semua'
    })
    // store.loadingSave = false
    openDialogRincianBaru.value = false
    return
  }
  openDialogRincianBaru.value = !openDialogRincianBaru.value
}
const openDialogRincian = async () => {
  // const itemdialog = store.dataBarangslama
  // const itemsimpan = store.rincians

  await store.getBarangslama()
  const itemsimpan = new Set(
    (store.rincians || [])
      .map(r => r.kode)
      .filter(Boolean)
  )
  // console.log('tersimpan ', itemsimpan)
  store.dataBarangslama.filter(r => !itemsimpan.has(r.kode))
    .map(r => ({ ...r }))
  // console.log('barang lama ', store.dataBarangslama)

  if (!Indikator.value) {
    $q.notify({
      type: 'negative',
      message: 'Indikator Harap di isi Semua'
    })
    // store.loadingSave = false
    dialogBaranglama.value = false
    return
  }

  dialogBaranglama.value = true
}
function tglTransaksi(val) {
  // console.log('val Parameter', val)
  store.form.tglTransaksi = val
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

async function ubahTahun(val) {
  const currentKode = store.form.kodeKegiatan

  store.params.tahun = val
  await store.getData()
  await store.getKegiatan()

  const used = store.items.map(x => Number(x.kodeKegiatan))
  // console.log('used kegiatan', used)
  let hasil = store.kegiatans.filter(k => !used.includes(Number(k.kodekegiatan)))

  // pastikan kegiatan yg sudah dipilih tetap ada
  if (currentKode) {
    const exist = store.kegiatans.find(k => Number(k.kodekegiatan) === Number(currentKode))
    if (exist && !hasil.some(x => Number(x.kodekegiatan) === Number(exist.kodekegiatan))) {
      hasil.push(exist)
    }
  }

  store.optionkegiatan = hasil

  master_kegiatan.value = hasil.map(a => ({
    ...a,
    label: `${a.kodekegiatan} - ${a.nomenklatur}`,
    value: a.kodekegiatan
  }))
  // console.log('master_kegiatan', master_kegiatan.value)
  options_kegiatan.value = master_kegiatan.value
}

async function filterFnKegiatan(val, update) {
  // console.log('val filter awaaal', val)
  if (!val || val.length < 2) {
    update(() => {
      options_kegiatan.value = master_kegiatan.value
    })
    return
  }

  // console.log('val filter', val)
  try {
    const resp = await api.get('v1/anggaran/perubahan/belanja/select', {
      params: {
        q: val,
        per_page: 30,
        page: 1,
        tahun: store.params.tahun || store.form.tahun
      }
    })
    // console.log('resp filter', resp)
    const data = resp.data.data || []

    update(() => {
      options_kegiatan.value = data.map(a => ({
        ...a,
        label: `${a.kodekegiatan} - ${a.nomenklatur}`,
        value: a.kodekegiatan
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
