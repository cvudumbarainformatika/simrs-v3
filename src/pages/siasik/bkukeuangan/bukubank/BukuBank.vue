<template>
  <div id="printMe">
    <div class="container q-pl-sm q-pr-sm">
      <div class="q-card q-mt-xs q-mt-ms">
        <q-card class="q-pa-xs">
          <div class="row bg-primary text-white q-pa-sm q-mb-xs q-mt-xs">
            <div class="f-14 text-weight-bold">
              Laporan Buku Bank Bendahara Pengeluaran | SIASIK
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-card q-mt-sm q-pr-lg">
        <q-card class="q-pa-xs">
          <div class="row justify-center q-pt-md">
            <div class="row">
              <div class="col-1">
                <q-img
                  src="~assets/images/logo_kota_original.png"
                  spinner-color="white"
                  style="height: 3.3cm; width: 2.6cm"
                />
              </div>
              <div class="col-10">
                <div class="row justify-center text-h6">
                  PEMERINTAH KOTA PROBOLINGGO
                </div>
                <div class="row justify-center text-h7 text-weight-bold">
                  DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
                </div>
                <div class="row justify-center text-h5 text-weight-bold">
                  UOBK RSUD DOKTER MOHAMAD SALEH
                </div>
                <div class="row justify-center text-h8">
                  Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119, 42118 Fax (0335)
                  432702
                </div>
                <div class="row justify-center text-h8 text-weight-bold">
                  PROBOLINGGO 67219
                </div>
              </div>
              <div class="col-1">
                <q-img
                  src="~assets/logos/logo-rsud.png"
                  spinner-color="white"
                  style="height: 3cm; width: 3cm"
                />
              </div>

              <div class="col-12 q-pt-md">
                <div class="row justify-center text-weight-bold">
                  Buku Bank Bendahara Pengeluaran
                </div>
                <div class="row justify-center text-weight-bold">
                  Periode Bulan {{ bulan(store.params.bulan) }} {{ store.params.tahun }}
                </div>
              </div>
              <div class="q-pl-lg" />
            </div>
          </div>
          <div class="print-hide row q-col-gutter-sm q-my-sm q-pl-lg">
            <div class="col-2">
              <app-autocomplete
                v-model="store.params.bulan"
                label="Pilih Bulan"
                autocomplete="nama"
                option-label="nama"
                option-value="value"
                outlined
                :source="store.bulans"
              />
            </div>
            <div class="col-2">
              <app-input
                v-model="store.params.tahun"
                label="Tahun"
                outlined
              />
            </div>
            <div>
              <app-btn
                label="Ambil Data"
                :disable="store.loading"
                :loading="store.loading"
                @click="ambilData()"
              />
            </div>
            <div>
              <q-btn
                ref="refPrint"
                v-print="printObj"
                unelevated
                color="dark"
                round
                size="sm"
                icon="icon-mat-print"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Print
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-card q-mt-sm">
        <q-card class="q-pa-xs">
          <template v-if="store.loading">
            <div class="row justify-center">
              <div class="q-gutter-md">
                <q-spinner-pie
                  color="amber-13"
                  size="40px"
                />
                <q-spinner-pie
                  color="amber-13"
                  size="60px"
                />
                <q-spinner-pie
                  color="amber-13"
                  size="40px"
                />
              </div>
            </div>
          </template>
          <template v-else-if="store.items.length === 0">
            <div class="row flex flex-center">
              <div class="kosong">
                <div>Data Belum Ada</div>
                <div>Silahkan Pilih Parameter</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row flex flex-center">
              <table
                class="table table-responsive"
                style="font-size: 13px"
              >
                <thead class="align-middle text-center display-block">
                  <tr style="font-size: 14px">
                    <th width="30px">
                      No
                    </th>
                    <th width="100px">
                      Tanggal
                    </th>
                    <th width="200px">
                      Register/Rekening
                    </th>
                    <th width="700px">
                      Uraian
                    </th>
                    <th>Penerimaan (Rp.)</th>
                    <th>Pengeluaran (Rp.)</th>
                    <th>Saldo (Rp.)</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(item, n) in store.hasilArray"
                    :key="item"
                  >
                    <td
                      data-th="No"
                      class="text-bold"
                      style="vertical-align: top"
                    >
                      {{ n + 1 }}
                    </td>
                    <td
                      data-th="Tanggal"
                      class="text-bold"
                      style="vertical-align: top"
                    >
                      {{ item?.tgl }}
                    </td>
                    <td
                      data-th="Register/Rekening"
                      class="text-left q-pl-sm"
                      style="vertical-align: top"
                    >
                      <div class="text-bold">
                        {{ item?.notrans }}
                      </div>
                      <template v-if="item?.nonpd?.length">
                        <div
                          v-for="npd in item?.nonpd"
                          :key="npd"
                        >
                          <div style="font-size: 11px">
                            {{ npd?.nonpd }}
                          </div>
                          <div
                            v-for="rincian in npd?.rincian"
                            :key="rincian"
                          >
                            <div style="font-size: 11px">
                              * {{ rincian?.koderek50 }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.bank_kas?.length">
                        <div
                          v-for="geser in item?.bank_kas"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ geser?.nonpd }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.kas_bank?.length">
                        <div
                          v-for="geser in item?.kas_bank"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ geser?.nonpd }}
                          </div>
                        </div>
                      </template>
                    </td>
                    <td
                      data-th="Uraian"
                      class="text-left q-pl-sm"
                      style="vertical-align: top"
                    >
                      <div class="text-bold">
                        {{ item?.uraian }}
                      </div>
                      <template v-if="item?.nonpd?.length">
                        <div
                          v-for="npd in item?.nonpd"
                          :key="npd"
                        >
                          <div style="font-size: 11px">
                            {{ npd?.uraianNPD }}
                          </div>
                          <div
                            v-for="rincian in npd?.rincian"
                            :key="rincian"
                          >
                            <div style="font-size: 11px">
                              * {{ rincian?.rincianbelanja }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.bank_kas?.length">
                        <div
                          v-for="geser in item?.bank_kas"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ geser?.uraianNPD }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.kas_bank?.length">
                        <div
                          v-for="geser in item?.kas_bank"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ geser?.uraianNPD }}
                          </div>
                        </div>
                      </template>
                    </td>
                    <td
                      data-th="Penerimaan"
                      class="text-right q-pr-sm"
                      style="vertical-align: top"
                    >
                      <div class="text-bold">
                        {{ formattanpaRp(item?.penerimaan) }}
                      </div>
                      <template v-if="item?.nonpd?.length">
                        <div
                          v-for="npd in item?.nonpd"
                          :key="npd"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(0) }}
                          </div>
                          <div
                            v-for="rincian in npd?.rincian"
                            :key="rincian"
                          >
                            <div
                              class="text invisible"
                              style="font-size: 11px"
                            >
                              {{ formattanpaRp(0) }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.bank_kas?.length">
                        <div
                          v-for="geser in item?.bank_kas"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(0) }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.kas_bank?.length">
                        <div
                          v-for="geser in item?.kas_bank"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(geser?.nilai) }}
                          </div>
                        </div>
                      </template>
                    </td>
                    <td
                      data-th="Pengeluaran"
                      class="text-right q-pr-sm"
                      style="vertical-align: top"
                    >
                      <div class="text-bold">
                        {{ formattanpaRp(item?.pengeluaran) }}
                      </div>
                      <template v-if="item?.nonpd?.length">
                        <div
                          v-for="npd in item?.nonpd"
                          :key="npd"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(npd?.totalRincian) }}
                          </div>
                          <div
                            v-for="rincian in npd?.rincian"
                            :key="rincian"
                          >
                            <div
                              class="text invisible"
                              style="font-size: 11px"
                            >
                              {{ formattanpaRp(0) }}
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.bank_kas?.length">
                        <div
                          v-for="geser in item?.bank_kas"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(geser?.nilai) }}
                          </div>
                        </div>
                      </template>
                      <template v-if="item?.kas_bank?.length">
                        <div
                          v-for="geser in item?.kas_bank"
                          :key="geser"
                        >
                          <div style="font-size: 11px">
                            {{ formattanpaRp(0) }}
                          </div>
                        </div>
                      </template>
                    </td>
                    <!-- SALDO -->
                    <td
                      data-th="Saldo"
                      class="text-right text-bold q-pr-sm"
                      style="vertical-align: top"
                    >
                      {{ formattanpaRp(item.total) }}
                    </td>
                  </tr>
                  <tr>
                    <th colspan="4">
                      TOTAL
                    </th>
                    <th class="text-right text-weight-bolder q-pr-sm">
                      {{ formattanpaRp(totaldebit()) }}
                    </th>
                    <th class="text-right text-weight-bolder q-pr-sm">
                      {{ formattanpaRp(totalkredit()) }}
                    </th>
                    <th class="text-right text-weight-bolder q-pr-sm">
                      {{ formattanpaRp(totalsaldo()) }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="padding-bottom: 30px" />
            <div class="row flex flex-right">
              <div class="contaier q-pt-lg q-pl-xl">
                <q-card
                  class="saldo bg-grey-3 q-pa-xs"
                  style="width: 500px; height: 220px"
                >
                  <div
                    class="row justify-center q-pt-sm q-py-xs q-px-xs"
                    style="font-size: 14px"
                  >
                    <table
                      class="text-weight-bolder no-border"
                    >
                      <tbody style="width: 400px">
                        <tr class="no-border">
                          <td
                            class="text-left no-border"
                            width="120px"
                          >
                            Saldo Awal
                          </td>
                          <td
                            width="50px"
                            class="no-border"
                          >
                            :
                          </td>
                          <td
                            class="text-right no-border"
                            width="170px"
                          >
                            {{ formattanpaRp(0) }}
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="text-left no-border"
                            width="120px"
                          >
                            Masuk
                          </td>
                          <td
                            width="50px"
                            class="no-border"
                          >
                            :
                          </td>
                          <td
                            class="text-right no-border"
                            width="170px"
                          >
                            {{ formattanpaRp(totaldebit()) }}
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="text-left no-border"
                            width="120px"
                          >
                            Keluar
                          </td>
                          <td
                            width="50px"
                            class="no-border"
                          >
                            :
                          </td>
                          <td
                            class="text-right no-border"
                            width="170px"
                          >
                            {{ formattanpaRp(totalkredit()) }}
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="text-left no-border"
                            width="120px"
                          >
                            Saldo Akhir
                          </td>
                          <td
                            width="50px"
                            class="no-border"
                          >
                            :
                          </td>
                          <td
                            class="text-right no-border"
                            width="170px"
                          >
                            {{ formattanpaRp(totalsaldo()) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </q-card>
              </div>
            </div>
            <div class="row">
              <div class="ttd-kanan">
                <div>
                  Probolinggo {{ store.display.sekarang }}
                </div>
                <div class="text-bold">
                  Bendahara Pengeluaran
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold">
                  {{ store.pegawais[0]?.nama }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  NIP. {{ store.pegawais[0]?.nip }}
                </div>
              </div>
              <div class="ttd-kiri">
                <div class="invisible">
                  .
                </div>
                <div class="text-bold">
                  Pengguna Anggaran
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold">
                  {{ store.pegawais[1]?.nama }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  NIP. {{ store.pegawais[1]?.nip }}
                </div>
              </div>
            </div>
            <div style="padding-bottom: 100px" />
          </template>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formattanpaRp } from 'src/modules/formatter'
import { useLaporanBukuBankStore } from 'src/stores/siasik/laporan/buku_pembantu/bukubank'
import { ref } from 'vue'

const store = useLaporanBukuBankStore()

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Laporan Realisasi Anggaran',
  beforeOpenCallback (vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback (vue) {
    console.log('opened')
  },
  closeCallback (vue) {
    printed.value = false
    console.log('closePrint')
  }
}

function bulan (val) {
  const bulan = store.bulans.find((x) => x.value === val)
  return bulan?.nama ?? '-'
}

function ambilData () {
  // store.hitungharidalamBulan();
  store.getDataTable()
}
function totaldebit () {
  const debit = store.hasilArray
  // console.log("njaaias", debit);
  const totaldebit = debit?.length
    ? debit?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totaldebit
}
function totalkredit () {
  const kredit = store.hasilArray
  // console.log("njaaias", debit);
  const totalkredit = kredit?.length
    ? kredit?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalkredit
}

function totalsaldo () {
  const saldo = store.hasilArray
  // console.log("njaaias", debit);
  const totalsaldo = saldo?.length
    ? saldo?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0) -
      saldo?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalsaldo
}
// function saldoindex(ss) {
//   const saldoss = store.hasilArray[ss];
//   let saldoawal = 0;
//   let saldototal = 0;
//   const sm = null;

//   if (ss === 0) {
//     saldoawal = saldoss.penerimaan - saldoss.pengeluaran;
//     // console.log(saldoawal);
//     saldototal = saldoawal;
//   } else if (ss > 0) {
//     const saldoseblumnya =
//       store.hasilArray[ss - 1].penerimaan -
//       store.hasilArray[ss - 1].pengeluaran;
//     // console.log("hasil", saldoawal);
//     const saldoskg =
//       store.hasilArray[ss].penerimaan - store.hasilArray[ss].pengeluaran;
//     saldototal = saldoseblumnya + saldoskg;
//   }
//   // console.log(saldoss);
//   return saldototal;
// }
</script>

<style>
table {
  border-collapse: collapse;
  border-radius: 6px;
  max-width: 1500px;
  width: 100%;
}

td,
th {
  border-collapse: collapse;
  border: 1px solid rgb(163, 163, 163);
  text-align: center;
}

thead tr {
  height: 60px;
  background: #ffed86;
  font-size: 16px;
}

tbody tr {
  height: 48px;
  border-bottom: 1px solid #e3f1d5;
}

td,
th {
  text-align: center;
}
.grs_bawah {
  border-bottom: 1px solid grey;
}
.ttd-kanan{
  position: relative;
  top: 50px;
  left: 60%;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 100px;
}
.ttd-kiri{
  position: relative;
  left: -10%;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 100px;
}
.kosong{
  position: relative;
  padding-top: 100px;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 270px;
  font-size: 1.5em;
}
</style>
