<template>
  <q-card flat class="col full-height">
    <q-form class="full-height" @submit="onSubmit">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="q-gutter-y-md" style="width: 25%">
          <app-input-simrs label="Nomor NPD-LS" v-model="store.form.nonpdls" readonly outlined dense />

          <app-autocomplete label="Pejabat Teknis Kegiatan" v-model="store.form.kodepptk" autocomplete="nama" outlined
            :option-label="opt => Object(opt) === opt && 'nip' in opt ? opt.nama + ' - ' + opt.nip : 'Silahkan Dipilih'"
            option-value="nip" :source="store.ptks" @selected="(val) => pilihPTK(val)" :disable="store.disabled"
            :loading="store.loading" />
        </div>
        <div class="q-gutter-y-md" style="width: 25%">
          <app-input-date-human label="Tanggal Transaksi" :model="store.params.tgl" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.disabled && store.loading" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
          <app-autocomplete label="Kegiatan BLUD" v-model="store.form.kodekegiatanblud" autocomplete="kegiatan" outlined
            option-label="kegiatan" option-value="kodekegiatan" :source="store.kegiatans"
            @selected="(val) => pilihKegiatan(val)" :key="store.reqs.kodebidang" :disable="store.disabled"
            :loading="store.loading" />
        </div>
        <div class="q-gutter-y-md" style="width: 50%">
          <app-autocomplete label="Pihak Ketiga" v-model="store.form.kodepenerima" autocomplete="nama"
            option-label="nama" option-value="kode" outlined :source="ambil.pihaktigas"
            @selected="(val) => pilihPihaktiga(val)" :disable="store.disabled" :loading="store.loading" />

          <div class="row items-center">
            <div>
              Ada Serahterima ? :
              <q-radio :label="item.ket" class="q-pl-sm q-pr-lg" v-for="item in store.serahterimas" :key="item"
                v-model="store.form.serahterimapekerjaan" :val="item.value" dense size="sm" :disable="store.disabled" />
            </div>

            <template v-if="store.form.serahterimapekerjaan === '3'">
              <div>
                <app-autocomplete label="Serah Terima Dari" v-model="store.form.bast" autocomplete="nama"
                  option-value="value" option-label="nama" outlined :key="carisrt.reqs.kodepenerima"
                  :source="store.dariserahterima" @update:model-value="(val) => serahTerima(val)" />
              </div>
            </template>
          </div>
        </div>
        <!-- <div class="flex-end q-gutter-y-md"> -->
        <app-input-simrs label="Keterangan Belanja" style="width: 50%" v-model="store.form.keterangan" outlined
          :autofocus="false" :valid="{ required: true }" :disable="store.disabled" />
        <!-- </div> -->

        <template v-if="store.form.serahterimapekerjaan === '3'">
          <div class="row items-center" style="width: 50%;">
            <app-input-simrs label="Nomor Serahterima" class="q-gutter-y-md" style="width: 80%;"
              v-model="store.form.noserahterima" disable outlined :autofocus="false" :valid="{ required: true }" />

            <div class="q-px-md">
              <q-btn color="dark" round size="sm" :loading="store.loading" icon="icon-mat-add"
                :source="store.dariserahterima" :key="carisrt.reqs.kodepenerima" @click="() => {
                  carisrt.reqs.kodebast = ''
                  store.openDialogFarmasi = true
                }" />
            </div>
          </div>
        </template>
        <app-input-simrs style="width: 50%;" v-model="store.form.biayatransfer" label="Biaya Administrasi" outlined
          :autofocus="false" :valid="{ required: true, number: true }" :disable="store.disabled" />
        <!-- <div class="row q-gutter-y-md" style="width: 100%">
          <app-input-simrs style="width: 50%;" v-model="store.form.biayatransfer" label="Biaya Administrasi" outlined
            :autofocus="false" :valid="{ required: true, number: true }" />

        </div> -->
      </div>
      <select-serahterima v-model="store.openDialogFarmasi" :key="carisrt.reqs.kodepenerima" />
      <select-serahterima v-model="store.openDialogSiasik" />

      <div class="q-px-sm">
        <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
          <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
            <div class="f-14 text-weight-bold">
              Rincian NPD-LS
            </div>
          </div>
        </q-card>
      </div>
    </q-form>
    <FormRincianNpdls />
  </q-card>
</template>
<script setup>
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
import { dataBastFarmasi } from 'src/stores/siasik/transaksi/ls/npdls/databast';
import { formNotaPermintaanDanaLS } from 'src/stores/siasik/transaksi/ls/npdls/formnpdls';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import FormRincianNpdls from './FormRincianNpdls.vue'

const SelectSerahterima = defineAsyncComponent(() => import('../../inpage/SelectSerahterima.vue'))

const store = formNotaPermintaanDanaLS()
const carisrt = dataBastFarmasi()
const ambil = formKontrakPekerjaan()
const refForm = ref(null)

onMounted(() => {
  // store.initReset(props.data)
  store.getDataBidang()
  ambil.getPihaktiga()
})
function onSubmit() {
  store.fixed = true

}
function tglTransaksi(val) {
  console.log('val Parameter', val)
  store.reqs.tgl = val
  store.form.tglnpdls = val
  carisrt.reqs.tgl = val
  store.setParams('tgl', val)
  store.getRincianBelanja()
  store.getDataBidang()
  carisrt.getDataBast()
}
const serahTerima = (val) => {
  console.log('serahTerima', val)
  if (val === '2') {
    store.openDialogSigarang = false
  }
  else if (val === '3') {
    store.openDialogFarmasi = true
    carisrt.reqs.kodebast = ''
  }
  else if (val === '4') {
    store.openDialogSiasik = false
  }
}
function pilihPTK(val) {
  const arr = store.ptks
  const obj = arr.length ? arr.find(x => x.nip === val) : null
  store.form.pptk = obj?.nama ?? ''
  store.form.kodepptk = obj?.nip ?? ''
  store.form.kodebidang = obj?.kodeBagian ?? ''
  store.reqs.kodebidang = obj?.kodeBagian ?? ''

  // mengkosongkan form rinci setelah milih ulang PTK
  store.rinci.koderek50 = ''
  store.rinci.koderek108 = ''
  store.rinci.itembelanja = ''
  store.rinci.volume = ''
  store.rinci.satuan = ''
  store.rinci.harga = ''
  store.rinci.total = ''
  store.rinci.volumels = ''
  store.rinci.hargals = ''
  store.rinci.totalls = ''
  store.rinci.nominalpembayaran = ''
  // mengkosongkan form Kegiatan setelah milih ulang PTK
  store.form.kodekegiatanblud = ''
  store.form.bidang = obj?.bagian ?? ''

  // filter kegiatan berdasarkan nip
  store.reqs.nip = obj?.nip ?? ''
  store.filterKegiatan()
}
function pilihKegiatan(val) {
  const arr = store.kegiatans
  const obj = arr.length ? arr.find(x => x.kodekegiatan === val) : null
  store.form.kegiatanblud = obj?.kegiatan ?? ''
  store.form.kodekegiatanblud = obj?.kodekegiatan ?? ''

  // Mengosongkan Rincian Belanja setelah milih ulang kegiatan
  store.rinci.koderek50 = ''
  store.rinci.koderek108 = ''
  store.rinci.itembelanja = ''
  store.rinci.volume = ''
  store.rinci.satuan = ''
  store.rinci.harga = ''
  store.rinci.total = ''
  store.rinci.volumels = ''
  store.rinci.hargals = ''
  store.rinci.totalls = ''
  store.rinci.nominalpembayaran = ''

  carisrt.reqs.kodekegiatan = val ?? ''
  carisrt.selectbastFarmasi()
  store.reqs.kodekegiatan = val ?? ''
  store.getRincianBelanja()
}

function pilihPihaktiga(val) {
  const arr = ambil.pihaktigas
  const obj = arr.length ? arr.find(x => x.kode === val) : null

  store.form.penerima = obj?.nama ?? ''
  store.form.kodepenerima = obj?.kode ?? ''
  carisrt.reqs.kodepenerima = val ?? ''
  store.form.serahterimapekerjaan = '2'
  carisrt.reqs.kodebast = '1'
  store.form.bast = '1'
  store.form.bank = obj?.bank ?? ''
  store.form.rekening = obj?.norek ?? ''
  store.form.npwp = obj?.npwp ?? ''
}
</script>
