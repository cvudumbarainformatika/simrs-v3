<template>
  <q-card flat class="col full-height">
    <q-form @submit="onSubmit" ref="formNpdLS" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Nomor NPD-Panjar" v-model="store.form.nonpdpanjar" readonly :disable="store.disabled"
            outlined dense />
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-input-date-human label="Tanggal Transaksi" :model="store.params.tgl" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.disabled" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
        </div>
      </div>
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <q-select label="Pejabat Teknis Kegiatan" v-model="store.form.kodepptk" clearable
            class="ellipsis-2-lines allign-center" use-input outlined dense emit-value map-options autocomplete="nama"
            option-value="nip" standout="bg-yellow-3" hide-bottom-space :disable="store.loading || store.disabled"
            :loading="store.loading"
            :option-label="opt => Object(opt) === opt && 'nip' in opt ? opt.nama + ' - ' + opt.nip : ''"
            input-debounce="0" :options="options" @filter="filterFn" @update:model-value="(val) => pilihPTK(val)">

            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Tidak ditemukan
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-autocomplete label="Kegiatan BLUD" v-model="store.form.kegiatanblud" autocomplete="kegiatan" outlined
            option-label="kegiatan" option-value="kegiatan" :source="store.kegiatans"
            @selected="(val) => pilihKegiatan(val)" :key="store.reqs.kodebidang"
            :disable="store.disabled || store.loading" :loading="store.loading" />
        </div>

      </div>


      <div class="q-px-sm">
        <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
          <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
            <div class="f-14 text-weight-bold">
              Rincian NPD-PANJAR
            </div>
          </div>
        </q-card>
      </div>
    </q-form>
    <FormRincian v-if="store.form?.bast !== 'Siasik' && store.form?.bast !== 'Sigarang'" />

  </q-card>
</template>
<script setup>
import { formKontrakPekerjaan } from 'src/stores/siasik/transaksi/ls/kontrak/formkontrak';
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi';
import { defineAsyncComponent, ref, watch } from 'vue';
import FormRincian from './FormRincian.vue'
import { dataBastPekerjaanStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastpekerjaan';
import { formInputPajakStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formpajak';
import { dataBastSigarangStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastsigarang';
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar';


const store = storeNpdPanjar()
const ambil = formKontrakPekerjaan()
const carisrt = dataBastFarmasiStore()
const stpekerjaan = dataBastPekerjaanStore()
const bastsigarang = dataBastSigarangStore()
const formNpdLS = ref(null)
const options = ref([])

const pjk = formInputPajakStore()
watch(
  [() => store.form.kodepptk, () => store.ptks],
  ([kodepptk, ptks]) => {
    if (!kodepptk || !ptks?.length) return

    const selected = ptks.find(p => p.nip === kodepptk)
    if (selected) {
      options.value = [selected]
    }
  },
  { immediate: true }
)

function onSubmit() {
  store.fixed = true
}
function tglTransaksi(val) {
  // console.log('val Parameter', val)
  store.reqs.tgl = val
  store.form.tglnpdpanjar = val
  carisrt.reqs.tgl = val
  bastsigarang.reqs.tgl = val
  store.setParams('tgl', val)
  store.getRincianBelanja()
  store.getDataBidang()
  carisrt.getDataBast()


}
const serahTerima = (val) => {
  // console.log('serahTerima', store.form.bast)
  if (val === 'Sigarang') {
    bastsigarang.listBastSigarang()
    store.openDialogSigarang = true
  }
  else if (val === 'Farmasi') {
    store.openDialogFarmasi = true
    carisrt.reqs.kodebast = ''
    // carisrt.selectbastFarmasi()
  }
  else if (val === 'Siasik') {
    stpekerjaan.listBastPekerjaan()
    store.openDialogSiasik = true
  }
}
function pilihPTK(val) {
  const arr = store.ptks
  const obj = arr?.length ? arr.find(x => x.nip === val) : null

  // const arrstp = stpekerjaan.bastpekerjaan?.length ? stpekerjaan.bastpekerjaan?.find(x => x.kodepptk === val) : null
  store.form.pptk = obj?.nama ?? ''
  store.form.kodepptk = obj?.nip ?? ''
  store.form.kodebidang = obj?.kodeBagian ?? ''
  store.reqs.kodebidang = obj?.kodeBagian ?? ''

  // mengkosongkan form rinci setelah milih ulang PTK
  store.form.nopp = null
  store.form.koderek50 = null
  store.form.rincianbelanja50 = null
  store.form.koderek108 = null
  store.form.uraian108 = null
  store.form.itembelanja = null
  store.form.volume = 0
  store.form.harga = 0
  store.form.total = 0
  store.form.satuan = null
  store.form.volumepermintaanpanjar = 0
  store.form.hargapermintaanpanjar = 0
  store.form.totalpermintaanpanjar = 0
  store.form.idpp = null
  // mengkosongkan form Kegiatan setelah milih ulang PTK
  store.form.kodekegiatanblud = ''
  store.form.kegiatanblud = ''
  store.form.bidang = obj?.bagian ?? ''

  // filter kegiatan berdasarkan nip
  store.reqs.nip = obj?.nip ?? ''
  store.filterKegiatan()
}
function pilihKegiatan(val) {
  const arr = store.kegiatans
  const obj = arr?.length ? arr.find(x => x.kegiatan === val) : null
  store.form.kegiatanblud = obj?.kegiatan ?? ''
  store.form.kodekegiatanblud = obj?.kodekegiatan ?? ''

  console.log('kegiatan', obj)
  // Mengosongkan Rincian Belanja setelah milih ulang kegiatan
  store.form.nopp = null
  store.form.koderek50 = null
  store.form.rincianbelanja50 = null
  store.form.koderek108 = null
  store.form.uraian108 = null
  store.form.itembelanja = null
  store.form.volume = 0
  store.form.harga = 0
  store.form.total = 0
  store.form.satuan = null
  store.form.volumepermintaanpanjar = 0
  store.form.hargapermintaanpanjar = 0
  store.form.totalpermintaanpanjar = 0
  store.form.idpp = null
  store.form.sisapagu = 0

  carisrt.reqs.kodekegiatanblud = obj?.kodekegiatan
  stpekerjaan.reqs.kodekegiatanblud = obj?.kodekegiatan ?? ''
  bastsigarang.reqs.kodekegiatanblud = obj?.kodekegiatan ?? ''
  store.reqs.kodekegiatan = obj?.kodekegiatan
  store.getRincianBelanja()
  // bastsigarang.listBastSigarang()
}
function pilihPihaktiga(val) {

  const arr = ambil.pihaktigas
  let obj = arr?.length ? arr.find(x => x.kode === val) : null

  store.form.penerima = obj?.nama ?? ''
  store.form.kodepenerima = obj?.kode ?? ''
  carisrt.reqs.kodepenerima = obj?.kode ?? ''
  stpekerjaan.reqs.kodepenerima = obj?.kode ?? ''
  bastsigarang.reqs.kodepenerima = obj?.kode ?? ''
  store.form.serahterimapekerjaan = '2'
  carisrt.reqs.kodebast = '1'
  store.form.bast = '-'
  store.form.bank = obj?.bank ?? ''
  store.form.rekening = obj?.norek ?? ''
  store.form.npwp = obj?.npwp ?? ''
  // console.log('store.form.penerima', store.form.penerima)
  carisrt.bastfarmasis = []
  carisrt.konsinyasis = []
  carisrt.itembelanja = []
}

async function filterFn(val, update) {
  // console.log('val filter', val)
  if (!store.ptks || store.ptks?.length === 0) {
    // Jika data rekening kosong, muat ulang data
    await store.getDataBidang();
  }
  update(() => {
    if (val === '') {
      options.value = store.ptks;
    } else {
      const needle = val.toLowerCase();
      const filter = ['nip', 'nama'];

      // Selalu filter dari data asal (store.ptks), bukan dari options yang sudah difilter
      const multiFilter = (data = [], filterKeys = [], value = '') =>
        data.filter((item) => filterKeys.some(
          (key) =>
            item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
            item[key]
        ));

      options.value = multiFilter(store.ptks, filter, needle);
    }
  });
}

function tambahPajak() {
  // console.log('open Dialog')
  store.openDialogPajak = true
  pjk.form.nonpdls = store.form.nonpdls
  pjk.reqs.nonpdls = store.form.nonpdls
  pjk.getListpajak()
  // console.log('nonpdls pajak', pjk.form.nonpdls)
}
</script>
