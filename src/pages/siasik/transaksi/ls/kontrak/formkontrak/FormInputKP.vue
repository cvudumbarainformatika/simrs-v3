<template>
  <q-form class="fit" ref="formKP" @submit="onSimpan" @reset="onReset">
    <div class="row">
      <div class="q-pa-md q-gutter-y-md" style="width: 50%;">
        <app-input-simrs v-model="store.form.nokontrakx" label="No. Kontrak" outlined :autofocus="false"
          :valid="{ required: false }" />
        <!-- <app-input-simrs v-model="store.form.nokontrak" label="No. Transaksi" readonly /> -->
        <app-input-date :model="store.form.tgltrans" label="Tanggal Transaksi" icon="icon-mat-event" outlined
          @set-model="val => {
            store.form.tgltrans = val
            store.params.tgl = val
            store.getDataBidang()
          }" />
        <app-input-date :model="store.form.tglmulaikontrak" label="Tanggal Mulai Kontrak" icon="icon-mat-event" outlined
          @set-model="val => store.form.tglmulaikontrak = val" />
        <app-input-date :model="store.form.tglakhirkontrak" label="Tanggal Akhir Kontrak" icon="icon-mat-event" outlined
          @set-model="val => store.form.tglakhirkontrak = val" />
        <app-input-simrs v-model="store.form.termin" label="Termin" outlined :autofocus="false"
          :valid="{ number: true }" />

      </div>
      <div class="q-pa-md q-gutter-y-md" style="width: 50%;">

        <app-autocomplete v-model="store.form.kodepptk" label="Pejabat Teknis Kegiatan" autocomplete="nama"
          :option-label="opt => Object(opt) === opt && 'nip' in opt ? opt.nama + ' - ' + opt.nip : 'Silahkan Dipilih'"
          option-value="nip" outlined :source="store.ptks" @selected="(val) => pilihPTK(val)" :disable="store.loading"
          :loading="store.loading" />
        <app-autocomplete v-model="store.form.kegiatanblud" label="Kegiatan BLUD" autocomplete="kegiatan"
          option-label="kegiatan" option-value="kegiatan" outlined :source="store.kegiatans"
          @selected="(val) => pilihKegiatan(val)" :key="store.params.kodebidang" :disable="store.loading"
          :loading="store.loading" />

        <app-autocomplete v-model="store.form.kodeperusahaan" label="Pihak Ketiga" autocomplete="nama"
          option-label="nama" option-value="kode" outlined :source="store.pihaktigas"
          @selected="(val) => pilihPihaktiga(val)" />
        <app-input-simrs label="Nilai Kontrak" v-model="store.form.nilaikontrak" outlined :autofocus="false"
          :valid="{ required: false, number: true }" />
        <div class="float-left">
          <app-btn label="Simpan" :disable="store.loading" :loading="store.loading" type="submit" />
        </div>
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak'
import { ref, onMounted } from 'vue'

const store = formKontrakPekerjaan()
const formKP = ref(null)
const onReset = () => {
  formKP.value.resetValidation()
}
onMounted(() => {
  onReset()
  // Promise.all([
  //   store.getDataBidang(),
  //   store.filterPtk(),
  //   store.getPihaktiga()
  // ])
})
// onBeforeMount(() => {
//   store.resetFORM()
// })
// const pilihTanggal = (val) => {
//   store.setForm('tgltrans', val)
// }
// const tglMulai = (val) => {
//   store.setForm('tglmulaikontrak', val)
// }
// const tglAkhir = (val) => {
//   store.setForm('tglakhirkontrak', val)
// }
// const termin = (val) => {
//   store.setForm('termin', val)
// }
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
function onSimpan() {
  console.log('data simpan', store.form)
  store.simpanKontrak(props.data)
    .then(() => {
      if (formKP.value != null) {
        formKP.value.resetValidation()
      }
      store.emptyForm()
    })
}
// const onSubmit = () => {
//   // store.simpanKontrak()
//   store.simpanKontrak().then(() => {
//     if (formKP.value != null) {
//       formKP.value.resetValidation()
//     }
//   })
// }

// function kodeKeg(val) {
//   store.setParams('kodekegiatan', val)
//   console.log('kkkk', store.setParams)
// }

function pilihPTK(val) {
  const arr = store.ptks
  const obj = arr.find(x => x.nip === val)
  console.log('piliObj', obj)
  store.form.namapptk = obj?.nama ?? ''
  store.form.kodepptk = obj?.nip ?? ''

  store.form.kodeBagian = obj?.kodeBagian ?? ''
  store.params.kodebidang = obj?.kodeBagian ?? ''
  console.log('bidang', store.params.kodebidang)

  store.params.nip = obj?.nip ?? ''
  console.log('nip', store.params.nip)
  store.filterKegiatan()
}
function pilihKegiatan(val) {
  const arr = store.kegiatans
  console.log('keegiatan', arr)
  const obj = arr.length ? arr.find(x => x.kodekegiatan === val) : null
  // console.log('pilihKamar', obj)
  store.form.kegiatanblud = obj?.kegiatan ?? ''
  store.form.kodekegiatanblud = obj?.kodekegiatan ?? ''
  // store.form.kodeBagian = obj?.kodebidang ?? ''
}
function pilihPihaktiga(val) {
  const arr = store.pihaktigas
  const obj = arr.length ? arr.find(x => x.kode === val) : null
  // console.log('pilihPihaktiga', obj)
  store.form.namaperusahaan = obj?.nama ?? ''
  store.form.kodeperusahaan = obj?.kode ?? ''
  store.form.kodemapingrs = obj?.kodemapingrs ?? ''
  store.form.namasuplier = obj?.namasuplier ?? ''
}
</script>
