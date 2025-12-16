<template>
  <div class="q-pa-sm bg-grey-2">
    <!-- ---------------- FORM TBP ---------------- -->
    <q-card flat bordered class="form-container q-mb-xl">

      <div class="header-area row items-center justify-between">
        <div class="text-h6 text-weight-bold">Form input TBP untuk kasir</div>
        <div class="text-caption text-grey-7"></div>
        <q-btn dense icon="arrow_back" color="red" @click="kembali()" />
      </div>
      <q-separator spaced />

      <q-form class="q-gutter-lg" @submit="onSubmit">

        <!-- NOMOR TBP -->
        <q-input filled dense v-model="store.form.no_tbp" label="Nomor TBP" readonly />

        <div class="section-title q-mt-md">Detail TBP</div>
        <AppInputDateHuman :model="store.formx.tgl_tbp" label="Tanggal TBP" outlined @db-model="setTotgltbp"
          @set-display="setToDisptgltbp" />
        <AppInputDateHuman :model="store.formx.tgl_terima" label="Tanggal Terima" outlined @db-model="setTotglterima"
          @set-display="setToDisptglterima" />

        <!-- PENERIMA -->
        <q-select filled dense v-model="store.form.penerima" :options="penerimaOptions" option-label="label" emit-value
          map-options option-value="value" label="Penerima" @update:model-value="isipenerima" />

        <!-- BUTTON -->
        <div class="row q-col-gutter-md q-mt-lg">
          <div class="col-4">
            <q-btn color="primary" label="Simpan" type="submit" class="col-12 col-md-4 full-btn"
              :loading="store.loadingsimpan" :disable="store.form.no_tbp != undefined" />
          </div>
          <div class="col-4">
            <q-btn color="red" label="Cetak" class="col-12 col-md-3 full-btn" @click="cetakTbp(store.form.no_tbp)" />
          </div>
          <div class="col-4">
            <q-btn color="grey-7" flat label="Baru" class="col-12 col-md-3 full-btn" @click="formBaru" />
          </div>

        </div>

      </q-form>
    </q-card>


    <!-- ---------------- PERIODE KWITANSI ---------------- -->
    <q-card flat bordered class="form-container q-mb-lg" v-if="!store.form.no_tbp">

      <div class="text-h6 text-weight-bold">Periode Kwitansi</div>
      <div class="text-caption text-grey-7 q-mb-md">
        Tentukan periode untuk menampilkan kwitansi
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-4 ">
          <app-input-date-human :model="store.formtanggal.dari" filled label="Dari Tanggal" dense outlined
            @db-model="setTo" @set-display="setToDisp" />
        </div>

        <div class="col-4">
          <app-input-date-human :model="store.formtanggal.sampai" filled label="Sampai Tanggal" dense outlined
            @db-model="setTox" @set-display="setToDispx" />
        </div>

        <div class="col-3">
          <q-select filled dense v-model="store.form.kasir" :options="kasir" option-label="nama"
            option-value="kdpegsimrs" label="Jenis Layanan" emit-value map-options @update:model-value="isikasir" />
        </div>
      </div>

      <q-btn color="primary" outline icon="search" label="Tampilkan Kwitansi" class="full-btn q-mt-md"
        :loading="store.loadingcarikuitansi" @click="cariKwitansi()" />
    </q-card>
    <FormRincianPage />
  </div>
  <DialogCetakTBP :data="props.data" />
</template>


<script setup>
import { onMounted, ref } from 'vue'
import FormRincianPage from './FormRincianPage.vue'
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import AppInputDateHuman from 'src/components/~global/AppInputDateHuman.vue'
import { notifNegativeCenterVue } from 'src/modules/utils'
import { date } from "quasar"
import DialogCetakTBP from './DialogCetakTBP.vue'

const apps = useAplikasiStore()
const store = useTbpKasirStore()
const emits = defineEmits(['back'])

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  flaging: {
    type: String,
    default: ''
  }
})

const verifikasi = props.data?.verifikasi

function onSubmit() {
  if (store.form.no_kwitansi.length === 0) return notifNegativeCenterVue('Minimal pilih 1 kwitansi')
  if (store.form.penerima == '') return notifNegativeCenterVue('Penerima harus diisi')
  store.simpanTbp()
}

function kembali() {
  emits('back')
  store.resetForm()
  store.item = []
}

function isikasir(val) {
  store.paramscarikuitansi.kasir = val
  store.form.kdkasir = store.itemskasir.find(x => x.kdpegsimrs === val).kdkasir
  console.log('kasir', store.form.kdkasir)

}

function isipenerima(val) {
  console.log('penerima', val)
  store.form.namapenerima = penerimaOptions.find(x => x.value === val).label
}
function setToDisp(vaal) {
  store.formtanggal.dari = vaal
}

function setToDispx(vaal) {
  store.formtanggal.sampai = vaal
}

function setTo(val) {
  console.log('set to', val)
  store.paramscarikuitansi.tgldari = val
}

function setTox(val) {
  store.paramscarikuitansi.tglsampai = val
}

function setTotgltbp(val) {
  store.form.tgl_tbp = val
}

function setTotglterima(val) {
  store.form.tgl_terima = val
}

function setToDisptglterima(val) {
  store.formx.tgl_terima = val
}

function setToDisptgltbp(val) {
  store.formx.tgl_tbp = val
}


const penerimaOptions = [
  { label: 'Bambang Irawan', value: '19780204 200801 1 0079' }
]

function cariKwitansi() {
  if (!store.form.kasir) return notifNegativeCenterVue('Pilih kasir terlebih dahulu')
  store.cariKwitansi()
}

const formBaru = () => {
  Object.keys(form.value).forEach(k => form.value[k] = '')
  selected.value = []
}
const kasir = ref([])
if (!apps.user?.pegawai?.kdkasir) {
  kasir.value = store.itemskasir
} else {
  // ambil hanya 1 orang
  kasir.value = store.itemskasir.filter(
    x => x.kdpegsimrs === apps.user?.pegawai?.kdpegsimrs
  )
}
function setTanggal(value) {
  console.log('set tanggal', value)
  store.form.tgl_tbp = value
  store.formx.tgl_tbp = date.formatDate(value, 'DD MMMM YYYY')
}
function setTanggalx(value) {
  store.form.tgl_terima = value
  store.formx.tgl_terima = date.formatDate(value, 'DD MMMM YYYY')
}

onMounted(() => {
  // if (props.data?.no_tbp === undefined || props.data?.no_tbp === null || props.data?.no_tbp === '') {
  //   store.resetForm()
  //   store.item = []
  //   setTanggal(props.data.tgl_tbp)
  //   store.itemskuitansi = []

  // } else {
  store.form.no_tbp = props.data?.no_tbp
  // store.form.tgl_terima = props.data?.tgl_terima
  store.form.kdkasir = props.data?.kdkasir
  store.itemskuitansi = props.data?.kwitansi ?? []
  if (props.data?.tgl_tbp) setTanggal(props.data.tgl_tbp)
  if (props.data?.tgl_terima) setTanggalx(props.data.tgl_terima)
  // }
  // store.form.no_tbp = props.data?.no_tbp
  // store.form.tgl_terima = props.data?.tgl_terima
  store.form.penerima = props.data?.penerima
  store.form.namapenerima = props.data?.namapenerima
  // store.form.kasir = props.data?.kasir
  // store.form.kdkasir = props.data?.kdkasir
  // store.itemskuitansi = props.data?.kwitansi ?? []
  // if (props.data?.tgl_tbp) setTanggal(props.data.tgl_tbp)
  // store.resetForm()
  // store.item = []
})

function cetakTbp(val) {
  store.getrincianTbp(val)
  store.dialogCetakTbp = true
}

</script>

<style scoped>
.form-container {
  max-width: 900px;
  margin: auto;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.table-container {
  max-width: 900px;
  margin: auto;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.header-area {
  margin-bottom: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #3a4750;
}

.full-btn {
  width: 100%;
}
</style>
