<template>
  <div v-if="!pasien?.nota_permintaan" class="full-height q-pa-sm">
    <div class="row q-col-gutter-x-xs full-height">
      <div class="col-8 full-height">
        <PlanningPage :key="props.pasien" :pasien="props.pasien" />
      </div>
      <div class="col-4 full-height">
        <div v-if="pasien?.planning?.length">
          <q-card v-for="(item, i) in pasien?.planning" :key="i" flat bordered>
            <div class="q-pa-md">
              <app-avatar-pasien :key="pasien" :pasien="pasien" />
            </div>

            <q-card-section>

              <div>
                <q-btn v-if="item?.rs4 === 'Rawat Inap' || item?.rs4 === 'Rumah Sakit Lain'" fab color="primary"
                  icon="icon-mat-edit" class="absolute" flat dense size="sm"
                  style="top: 0; right: 12px; transform: translateY(-100%);" :loading="store.loadingHapus"
                  @click="editItem(item)" />
                <q-btn v-else fab color="negative" icon="icon-mat-delete" class="absolute" flat dense size="sm"
                  style="top: 0; right: 12px; transform: translateY(-100%);" :loading="store.loadingHapus"
                  @click="hapusItem(item)" />
              </div>
              <div v-if="item?.rs4 !== 'Rumah Sakit Lain'" class="row no-wrap items-center" style="margin-top: -20px;">
                <div class="col text-h6 ellipsis">
                  {{ item?.rs4 }}
                </div>
                <q-badge outline color="accent">
                  {{ item?.rs4 === 'Rawat Inap' ? 'ke ' + (item?.ranap?.groups_nama ?? item?.rs5) : 'ke ' +
                    item?.masterpoli?.rs2 }}
                </q-badge>
              </div>
              <div v-if="item?.rs4 === 'Rumah Sakit Lain'" class="no-wrap items-center" style="margin-top: -20px;">
                <div class="row text-h6 ellipsis">
                  {{ item?.rs4 }}
                </div>
                <div class="row justify-end">
                  <q-badge outline color="accent">
                    ke {{ item?.transrujukan?.rs7 }}
                  </q-badge>
                </div>
              </div>
            </q-card-section>

            <q-separator />
            <q-card-section class=" full-width print-only" />
          </q-card>
        </div>
        <div v-else class="full-height flex-center column">
          Tidak Ada Planning Pasien
        </div>
      </div>
    </div>
    <div style="margin-top:90px;">
      <div id="printMe" class="full-width" style="min-width:17cm;">
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <img v-if="pasien?.groups === '1'" src="~assets/logos/logobpjs.svg" spinner-color="white" class="q-mb-sm">
            <img v-else src="~assets/logos/logo-rsud.png" spinner-color="white" style="height: 2cm; max-width: 2cm">
            <!-- style="height: 3.56cm; max-width: 2.86cm" -->
          </div>
          <div>
            <div :key="toItem" class="row">
              Surat Rencana {{ toItem?.rs4 }}
            </div>
            <div class="row">
              UOBK RSUD dr. MOH SALEH
            </div>
          </div>
          <div>No. {{ setNomor(toItem) }}</div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            Kepada Yth
          </div>
          <div class="col-9">
            : {{ setKepada(toItem) }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div>
            Mohon Pemeriksaan dan Penanganan lebih lanjut :
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            No Kartu
          </div>
          <div class="col-9">
            : {{ pasien?.noka }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            No RM
          </div>
          <div class="col-9">
            : {{ pasien?.norm }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            Nama Peserta
          </div>
          <div class="col-9">
            : {{ pasien?.nama }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            Tgl Lahir
          </div>
          <div class="col-9">
            : {{ pasien?.tgllahir }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="col-3">
            Diagnosa
          </div>
          <div class="col-9">
            : {{ pasien?.diagnosa?.length ? pasien?.diagnosa[0].masterdiagnosa?.rs1 + ' - ' +
              pasien?.diagnosa[0].masterdiagnosa?.rs4 : '-' }}
          </div>
        </div>
        <div class="row items-center justify-between q-mb-xl">
          <div class="col-7" />
          <div class="col-4 text-center">
            Mengetahui DPJP
          </div>
        </div>
        <div class="row items-center justify-between ">
          <div class="col-7 f-10">
            Tgl Entri {{ date.formatDate(pasien.tgl_kunjungan, 'DD/MM/YYYY') }} | Tgl Cetak {{
              date.formatDate(Date.now(), 'DD/MM/YYYY') }} <span class="text-italic">dari RS</span>
          </div>
          <div class="col-4 text-center">
            {{ pasien?.dokter }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <app-maintenance text="Hanya untuk Pasien Rawat Jalan" color="negative" />
  </div>
</template>

<script setup>

import { onMounted, ref, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useQuasar, date } from 'quasar'
import { notifInfVue } from 'src/modules/utils'
import { usePerencanaanHDStore } from 'src/stores/simrs/hemodialisa/perencanaan'

const PlanningPage = defineAsyncComponent(() => import('./formperencanaan/PlanningPage.vue'))

const $q = useQuasar()
const store = usePerencanaanHDStore()
const toItem = ref(null)
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
function editItem (val) {
  console.log('edit', val)
  const renc = val.rs4
  if (store.plann !== renc) {
    store.plann = renc
  }
  if (renc === 'Rumah Sakit Lain') {
    if (!val?.transrujukan) {
      notifInfVue('tidak ada data rujukan di Rumah sakit, silahkan isi kembali dari awal')
    }
    store.editRsLain = true
    store.setFormRsLain('id', val.id)
    store.setFormRsLain('norujukan', val?.transrujukan?.rs3)
    store.setFormRsLain('tglrencanakunjungan', val?.transrujukan?.tglRencanaKunjungan)
    store.setFormRsLain('namappkdirujuk', val?.transrujukan?.rs7)
    store.setFormRsLain('ppkdirujukx', val?.transrujukan?.rs7)
    store.setFormRsLain('ppkdirujuk', val?.transrujukan?.rs6)
    store.setFormRsLain('namapolirujukan', val?.transrujukan?.poli)
    store.setFormRsLain('polirujukan', val?.transrujukan?.polix)
    store.setFormRsLain('tiperujukan', val?.transrujukan?.rs11)
    store.setFormRsLain('catatan', val?.transrujukan?.rs9)
    store.setFormRsLain('tglrujukan', val?.transrujukan?.rs5)
  }
  if (renc === 'Rawat Inap') {
    store.editRanap = true
    store.setFormRanap('id', val.id)
    store.setFormRanap('kdruangtujuan', val.rs5)
    if (val.spri) {
      store.setFormRanap('nospri', val.spri?.noSuratKontrol)
      store.setFormRanap('tglrencanakunjungan', val.spri?.tglRencanaKontrol)
      store.setFormRanap('tglrencanakontrol', val.spri?.tglRencanaKontrol)
    }
    if (val.operasi) {
      store.setFormRanap('status', 'Operasi')
      store.setFormRanap('jenistindakan', val.operasi?.jenistindakan)
      store.setFormRanap('icd9', val.operasi?.icd9)
      const opTi = store.optionsJenisTindakan.filter(a => a.kdtindakan === val.operasi?.jenistindakan)
      if (!opTi?.length) {
        store.cariTindakan(val.operasi?.jenistindakan)
      }
      const opIc = store.optionsIcd9.filter(a => a.kd_prosedur === val.operasi?.icd9)
      if (!opIc?.length) {
        store.cariIcd9(val.operasi?.icd9)
      }
      store.setFormRanap('tanggaloperasi', val.operasi?.tanggaloperasi)
    }
  }
}
function setKepada (val) {
  if (val?.rs4 === 'Kontrol') {
    if (val?.kontrol) {
      return val?.kontrol?.namaDokter
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Konsultasi') {
    if (val?.masterpoli) {
      return val?.masterpoli?.rs2
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rawat Inap') {
    if (props.pasien) {
      return props.pasien.dokter
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rumah Sakit Lain') {
    if (val?.transrujukan) {
      return 'Poli ' + val?.transrujukan?.poli + ', ' + val?.transrujukan?.rs7
    }
    else { return '-' }
  }
}
function setNomor (val) {
  if (val?.rs4 === 'Kontrol') {
    if (val?.kontrol) {
      return val?.kontrol?.noSuratKontrol
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Konsultasi') {
    if (val?.masterpoli) {
      return val?.masterpoli?.rs2
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rawat Inap') {
    if (val?.spri) {
      return val?.spri?.noSuratKontrol
    }
    else { return '-' }
  }
  else if (val?.rs4 === 'Rumah Sakit Lain') {
    if (val?.transrujukan) {
      return val?.transrujukan?.rs3
    }
    else { return '-' }
  }
}
onMounted(() => {
  // store.getMasterPlanning()
  store.getMasterPoli()
})

function hapusItem (item) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('HAPUS', id)
    store.hapusItem(props.pasien, item)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}
// const printObj = {
//   id: 'printMe',
//   popTitle: 'Rencana Pasien'
//   // extraCss: 'https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css',
//   // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',

// }
onBeforeUnmount(() => {
  store.resetForm()
})
</script>
