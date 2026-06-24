<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable space-before-function-paren -->
<!-- eslint-disable space-before-function-paren -->
<template>
  <div id="printMe">
    <div class="container q-pl-sm q-pr-sm">
      <div class="q-card print-hide q-mt-xs q-mt-ms">
        <q-card class="q-pa-xs">
          <div class="row bg-primary text-white q-pa-sm q-mb-xs q-mt-xs">
            <div class="f-14 text-weight-bold">
              Laporan Realisasi Anggaran | SIASIK
            </div>
          </div>
        </q-card>
      </div>
      <div class="q-card q-mt-sm">
        <q-card class="q-pa-xs">
          <q-card-section>
            <div class="kop-surat">
              <div class="logo-kiri">
                <img src="~assets/images/logo_kota_original.png" style="height:95px;width:auto" />
              </div>

              <div class="judul-kop">
                <div class="kop-1">
                  PEMERINTAH KOTA PROBOLINGGO
                </div>

                <div class="kop-2">
                  DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
                </div>

                <div class="kop-3">
                  UOBK RSUD DOKTER MOHAMAD SALEH
                </div>

                <div class="kop-4">
                  Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335) 432702
                </div>

                <div class="kop-5">
                  PROBOLINGGO 67219
                </div>
              </div>

              <div class="logo-kanan">
                <img src="~assets/logos/logo-rsud.png" style="height:85px;width:auto" />
              </div>
            </div>

            <hr class="garis-kop">

            <div class="col-12 q-pt-xs">
              <div class="row justify-center text-weight-bold">
                Laporan Realisasi Anggaran Periode {{ store.display.dari + ' - ' + store.display.sampai }}
              </div>
              <div v-if="store.display.bidang" class="row q-pt-sm text-weight-bold">
                BIDANG / BAGIAN : {{ store.display.bidang }}
              </div>
              <div v-if="store.display.kegiatan" class="row text-weight-bold">
                Kegiatan : {{ store.display.kegiatan }}
              </div>
            </div>
          </q-card-section>

          <div class="print-hide row middle q-pa-md q-gutter-md">
            <app-input-date-human :model="store.params.tgl" label="dari tangal" outlined :disable="store.loading"
              :loading="store.loading" @db-model="tglDari" @set-display="setDari" />
            <app-input-date-human :model="store.params.tglx" label="sampai tangal" outlined :disable="store.loading"
              :loading="store.loading" @db-model="tglSampai" @set-display="setSampai" />
            <app-autocomplete v-model="store.params.bidang" label="Pilih Bidang" autocomplete="bidang"
              option-label="bidang" option-value="kodebidang" outlined :source="store.bidangs" :loading="store.loading"
              @selected="(val) => {
                const arr = store.bidangs
                const obj = arr?.length ? arr.find(x => x.kodebidang === val) : null
                store.params.kodebidang = obj?.kodebidang ?? ''
                store.display.bidang = obj?.bidang
                store.params.kegiatan = ''
                store.display.kegiatan = ''
                console.log('kode bidang', store.params.kodebidang)
                store.filterKegiatan()
              }" />
            <app-autocomplete v-model="store.params.kegiatan" label="Pilih Kegiatan" autocomplete="kegiatan"
              option-label="kegiatan" option-value="kodekegiatan" outlined :source="store.kegiatans"
              :loading="store.loading" @selected="(val) => {
                const arr = store.kegiatans
                const obj = arr?.length ? arr.find(x => x.kodekegiatan === val) : null
                store.display.kegiatan = obj?.kegiatan

              }" />
            <div>
              <app-btn label="Ambil Data" :disable="store.loading" :loading="store.loading" @click="ambilData()" />
            </div>
            <div>
              <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                <q-tooltip class="primary" :offset="[10, 10]">
                  Print
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-card q-mt-sm">
        <q-card class="q-pa-xs">
          <template v-if="store.loadingdata">
            <div class="row justify-center">
              <div class="q-gutter-md">
                <q-spinner-pie color="amber-13" size="40px" />
                <q-spinner-pie color="amber-13" size="60px" />
                <q-spinner-pie color="amber-13" size="40px" />
              </div>
            </div>
          </template>
          <template v-else-if="!store.items?.length && !store.pendapatans?.length">
            <div class="row flex flex-center">
              <div class="kosong">
                <div>Data Belum Ada</div>
                <div>Silahkan Pilih Parameter</div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="row flex flex-center" id="printMe">
              <table class="table-print" style="font-size: 13px">
                <thead class="align-middle text-center display-block">
                  <tr style="font-size: 14px">
                    <th>
                      Kode Rekening
                    </th>
                    <th style="width: 25%">
                      Uraian
                    </th>
                    <th>Anggaran (Rp.)</th>
                    <th>Realisasi Sebelumnya (Rp.)</th>
                    <th>Realisasi Sekarang (Rp.)</th>
                    <th>Total Realisasi (Rp.)</th>
                    <th>Selisih (Rp.)</th>
                    <th>(%)</th>
                  </tr>
                </thead>
                <tbody class="align-middle q-pl-sm">
                  <tr v-for="item in store.pendapatans" :key="item" :class="item.kode?.length <= 12 ? 'text-bold' : ''">
                    <td class="text-left q-pl-sm q-pr-sm"> {{ item.kode }}</td>
                    <td class="text-left q-pl-sm q-pr-sm">{{ item.uraian }}</td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(item.pagupend ?? item?.pagu) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(item.nilaisblm) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(item.nilaiskg) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(item.nilaisemua) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(item.selisih) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ item.persen }}
                    </td>
                  </tr>
                  <tr class="total text-bold">
                    <td class="text-right q-pl-sm q-pr-sm" colspan="2">
                      TOTAL PENDAPATAN
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalpend) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalsblm) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalskg) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalsemua) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalselisih) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(totalPendapatan().totalpersen) }}
                    </td>
                  </tr>
                  <tr v-for="item in store.items" :key="item.kode" @click="bukaRincian(item)" class="cursor-pointer">
                    <td class="text-left q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''"> {{ item.kode }} </div>
                    </td>
                    <td class="text-left q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''"> {{ item.uraian }} </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">{{ formattanpaRp(item.pagu) }}
                      </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">{{
                        formattanpaRp(item.realisasi_sblm) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">
                        {{ formattanpaRp(item.realisasi_skg) }}
                      </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">
                        {{ formattanpaRp(item.total_realisasi) }}
                      </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">
                        {{ formattanpaRp(item.selisih) }}
                      </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="item.kode?.length <= 12 ? 'text-bold' : ''">
                        {{ item.persen }}
                      </div>
                    </td>
                  </tr>
                  <tr class="total text-bold">
                    <td class="text-right q-pl-sm q-pr-sm" colspan="2">
                      TOTAL BELANJA
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.pagu) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.realisasi_sblm) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.realisasi_skg) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.total_realisasi) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.selisih) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(store.items[0]?.persen) }}
                    </td>
                  </tr>

                  <tr class="total text-bold">
                    <td class="text-right q-pl-sm q-pr-sm" colspan="2">
                      SURPLUS / (DEFISIT)
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungPagu().surplus_defisit) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSebelumnya().surplus_defisit) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSekarang().surplus_defisit) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungTotalRealisasi().surplus_defisit) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSelisih().surplus_defisit) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(HitungPersen().surplus_defisit) }}
                    </td>
                  </tr>
                  <tr v-for="rek in store.pembiayaans" :key="rek">
                    <td class="text-left q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''"> {{ rek.kodeall3 }} </div>
                    </td>
                    <td class="text-left q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''"> {{ rek.uraian }} </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''">{{
                        formattanpaRp(store.realisasiPembiayaans?.totalPaguPembiayaan) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''">{{
                        formattanpaRp(store.realisasiPembiayaans?.totalSebelumnya) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''">{{
                        formattanpaRp(store.realisasiPembiayaans?.totalSekarang) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''">{{
                        formattanpaRp(store.realisasiPembiayaans?.totalRealisasi) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''"> {{
                        formattanpaRp(store.realisasiPembiayaans?.selisih) }} </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div :class="rek.kodeall3?.length <= 12 ? 'text-bold' : ''"> {{
                        formattanpaRp(store.realisasiPembiayaans?.persen) }} </div>
                    </td>
                  </tr>
                  <tr class="total text-bold">
                    <td class="text-right q-pl-sm q-pr-sm" colspan="2">
                      TOTAL PEMBIAYAAN (NETTO)
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div>{{ formattanpaRp(store.realisasiPembiayaans?.totalPaguPembiayaan) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div>{{ formattanpaRp(store.realisasiPembiayaans?.totalSebelumnya) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div>{{ formattanpaRp(store.realisasiPembiayaans?.totalSekarang) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div>{{ formattanpaRp(store.realisasiPembiayaans?.totalRealisasi) }}</div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div> {{ formattanpaRp(store.realisasiPembiayaans?.selisih) }} </div>
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      <div> {{ store.realisasiPembiayaans?.persen }} </div>
                    </td>
                  </tr>
                  <tr class="total text-bold">
                    <td class="text-right q-pl-sm q-pr-sm" colspan="2">
                      SISA LEBIH PEMBIAYAAN ANGGARAN (SILPA)
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungPagu().silpa) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSebelumnya().silpa) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSekarang().silpa) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungTotalRealisasi().silpa) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ formattanpaRp(hitungSelisih().silpa) }}
                    </td>
                    <td class="text-right q-pl-sm q-pr-sm">
                      {{ HitungPersen().silpa }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="ttd" v-for="data in store.penggunaAnggaran" :key="data">
              <div>
                Probolinggo {{ store.display.sekarang }}
              </div>
              <div class="text-bold">
                Kuasa Pengguna Anggaran
              </div>
              <div style="padding-bottom: 40px" />
              <div class="underline text-bold">
                {{ data?.nama }}
                <div class="garis-bawah" style="text-decoration-line: underline;" />
              </div>
              <div>
                NIP. {{ data?.nip }}
              </div>
            </div>
            <div style="padding-bottom: 80px" />
          </template>
        </q-card>
      </div>
    </div>
  </div>

  <lihat-rincian v-model="showRincian" :listrincian="selectedRincian" />
</template>

<script setup>
// import { date } from 'quasar'
import { formattanpaRp } from 'src/modules/formatter'
import { useLaporanLraLaprealisasianggaranStore } from 'src/stores/siasik/laporan/lra/laprealisasianggaran'
import { defineAsyncComponent, onMounted, ref } from 'vue'
// import { ref } from 'vue'
const LihatRincian = defineAsyncComponent(() => import('./DialogRincian.vue'))
const store = useLaporanLraLaprealisasianggaranStore()
const showRincian = ref(false)
const selectedRincian = ref(null)
// store.realisasiPendapatan()
// store.getDataPendapatan()
onMounted(() => {
  store.items = []
  store.pendapatans = []
  store.params.bidang = ''
  store.params.kegiatan = ''
  store.display.bidang = ''
  store.display.kegiatan = ''
  store.params.kodebidang = null
  store.getDataBidang()
  // store.getDataRealisasi()

})

const bukaRincian = (item) => {
  console.log('rincian', item)
  if (item?.rincian?.length > 0) {
    selectedRincian.value = item
    showRincian.value = true
  } else {
    showRincian.value = false
  }
}
function tglDari(val) {
  // console.log('val Parameter', val)
  // this.getDataBidang()
  store.setParameter('tgl', val)
}
function setDari(val) {
  store.display.dari = val
}
function tglSampai(val) {
  store.setParameter('tglx', val)
  store.getDataBidang()
}
function setSampai(val) {
  store.display.sampai = val
}

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Realisasi Anggaran',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
    document.title = 'Laporan_Realisasi_Anggaran'
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
    document.title = 'Laporan_Realisasi_Anggaran'
  }
}
function totalPendapatan() {
  const totalpend = store.pendapatans.map((x) => x.pagupend ?? x.pagu)[0]
  const totalsblm = store.pendapatans.map((x) => x.nilaisblm)[0]
  const totalskg = store.pendapatans.map((x) => x.nilaiskg)[0]
  const totalsemua = store.pendapatans.map((x) => x.nilaisemua)[0]
  const totalselisih = store.pendapatans.map((x) => x.selisih)[0]
  const totalpersen = store.pendapatans.map((x) => x.persen)[0]
  return {
    totalpend,
    totalsblm,
    totalskg,
    totalsemua,
    totalselisih,
    totalpersen
  }
}
function hitungPagu() {
  const saldo = store.items
  const PaguBelanja = saldo[0]?.pagu
  const PaguPendapatan = totalPendapatan().totalpend
  const pembiayaan = store.realisasiPembiayaans?.totalPaguPembiayaan
  const NilaiPagu = PaguPendapatan - PaguBelanja
  const silpa = NilaiPagu + pembiayaan
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}
function hitungSebelumnya() {
  const saldo = store.items
  const PaguBelanja = saldo[0]?.realisasi_sblm
  const PaguPendapatan = totalPendapatan().totalsblm
  const pembiayaan = store.realisasiPembiayaans?.totalSebelumnya
  const NilaiPagu = PaguPendapatan - PaguBelanja
  const silpa = NilaiPagu + pembiayaan
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}
function hitungSekarang() {
  const saldo = store.items
  const PaguBelanja = saldo[0]?.realisasi_skg
  const PaguPendapatan = totalPendapatan().totalskg
  const pembiayaan = store.realisasiPembiayaans?.totalSekarang
  const NilaiPagu = PaguPendapatan - PaguBelanja
  const silpa = NilaiPagu + pembiayaan
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}
function hitungTotalRealisasi() {
  const saldo = store.items
  const PaguBelanja = saldo[0]?.total_realisasi
  const PaguPendapatan = totalPendapatan().totalsemua
  const pembiayaan = store.realisasiPembiayaans?.totalRealisasi
  const NilaiPagu = PaguPendapatan - PaguBelanja
  const silpa = NilaiPagu + pembiayaan
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}
function hitungSelisih() {
  const saldo = store.items
  const PaguBelanja = saldo[0]?.selisih
  const PaguPendapatan = totalPendapatan().totalselisih
  const pembiayaan = store.realisasiPembiayaans?.selisih
  const NilaiPagu = PaguPendapatan - PaguBelanja
  const silpa = NilaiPagu + pembiayaan
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}
function HitungPersen() {
  const saldo = store.items
  const PaguBelanja = parseFloat(saldo[0]?.persen)
  const PaguPendapatan = parseFloat(totalPendapatan().totalpersen)
  const pembiayaan = parseFloat(store.realisasiPembiayaans?.persen)
  const NilaiPagu = parseFloat(PaguPendapatan - PaguBelanja).toFixed(2)
  const silpa = parseFloat(NilaiPagu + pembiayaan).toFixed(2)
  // console.log('nilaipagu', NilaiPagu)
  return {
    surplus_defisit: NilaiPagu,
    silpa
  }
}

function ambilData() {
  // store.hitungharidalamBulan();
  store.getLRA().then(() => {
    store.emptyForm()
  })
  // store.getDataRealisasi().then(() => {
  //   store.emptyForm()
  // })
}

</script>

<style scoped>
table {
  border-collapse: collapse;
  border-radius: 6px;
  max-width: 1500px;
  width: 100%;
  border: 1px solid rgb(163, 163, 163);
}

thead th {
  height: 50px;
  border-collapse: collapse;
  border-radius: 6px;
  border: 1px solid rgb(163, 163, 163);
  font-size: 12px;
}

tbody tr td {
  height: 30px;
  max-height: 60px;
  border-collapse: collapse;
  border-radius: 6px;
  border: 1px solid rgb(163, 163, 163);
  font-size: 11px;
}

.total {
  background: #e6efff;
}

.ttd {
  position: relative;
  top: 30px;
  left: 60%;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 100px;
}

.underline {
  text-decoration-line: underline;
}

.kosong {
  position: relative;
  padding-top: 100px;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 270px;
  font-size: 1.5em;
}

@page {
  size: A4 landscape;
  margin: 5mm;
}

@media print {

  html,
  body {
    width: 210mm;
    margin: 0;
    padding: 0;
  }

  #printMe {
    width: 100%;
    overflow: hidden;
  }

  table {
    width: 100% !important;
    max-width: 100% !important;
    table-layout: fixed;
    word-wrap: break-word;
    font-size: 10px;
  }

  th,
  td {
    word-break: break-word;
    overflow-wrap: break-word;
    padding: 4px;
    font-size: 10px;
  }

  .container,
  .q-card {
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: none !important;
  }

  .q-card__section {
    padding: 0 !important;
  }

  .print-hide {
    display: none !important;
  }
}

.table-print {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}


.kop-surat {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}

.logo-kiri,
.logo-kanan {
  width: 100px;
  flex-shrink: 0;
  text-align: center;
}

.judul-kop {
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.kop-1 {
  font-size: 18px;
  font-weight: 700;
}

.kop-2 {
  font-size: 13px;
  font-weight: 600;
}

.kop-3 {
  font-size: 20px;
  font-weight: 700;
}

.kop-4 {
  font-size: 13px;
}

.kop-5 {
  font-size: 13px;
  font-weight: 700;
}

.garis-kop {
  border: none;
  border-top: 2px solid #000;
  margin-top: 8px;
  margin-bottom: 10px;
}
</style>
