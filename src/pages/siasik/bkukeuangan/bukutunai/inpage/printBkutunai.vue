<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 80vw;">
      <q-bar class="bg-black text-white">
        <div>Cetak NPD-LS</div>
        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <div id="printMe" class="f-12 row justify-center q-pt-md">
        <div class="row">
          <div class="col-1 q-pl-md">
            <q-img src="~assets/images/Pemkot.svg" style="height: 2.6cm; width: 2cm" />
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
          <div class="col-1 logo_kanan">
            <q-img src="~assets/logos/logo-rsud.png" style="height: 2.6cm; width: 2.6cm" />
          </div>
          <div class="col-12 q-pt-md">
            <div class="row justify-center text-weight-bold q-py-xs">
              Buku Kas Umum Pejabat Pengelola Keuangan
            </div>
            <div class="row justify-center text-weight-bold">
              Periode Bulan {{ bulan(store.params.bulan) }} {{ store.params.tahun }}
            </div>
          </div>

          <q-card-section class="q-pa-md full-width">
            <div class="col-auto">
              <div class="row q-col-gutter-md full-width">
                <div class="items-center full-width">
                  <listData />
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="full-width">
            <div class="row justify-between full-width">
              <div class="flex-start">
                <table class="text-bold no-border" style="width:400px">
                  <tbody>
                    <tr class="no-border" style="height: 30px;">
                      <td class="text-left no-border">
                        Saldo Awal
                      </td>
                      <td class="no-border">
                        :
                      </td>
                      <td class="text-right no-border">
                        {{ formattanpaRp(store.nilaisaldoawal) }}
                      </td>
                    </tr>
                    <tr class="no-border" style="height: 30px;">
                      <td class="text-left no-border">
                        Masuk
                      </td>
                      <td class="no-border">
                        :
                      </td>
                      <td class="text-right no-border">
                        {{ formattanpaRp(totaldebit()) }}
                      </td>
                    </tr>
                    <tr class="no-border" style="height: 30px;">
                      <td class="text-left no-border">
                        Keluar
                      </td>
                      <td class="no-border">
                        :
                      </td>
                      <td class="text-right no-border">
                        {{ formattanpaRp(totalkredit()) }}
                      </td>
                    </tr>
                    <tr class="no-border" style="height: 30px;">
                      <td class="text-left no-border">
                        Saldo Akhir
                      </td>
                      <td class="no-border">
                        :
                      </td>
                      <td class="text-right no-border">
                        {{ formattanpaRp(totalsaldo()) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex-end text-center q-pr-xl q-pt-sm">
                <div class="q-py-xs">
                  Probolinggo {{ store.display.sekarang }}
                </div>
                <div class="text-bold">
                  Pejabat Penatausahaan Keuangan
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold q-py-xs">
                  {{ pegawai.pegawais[2]?.nama }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  NIP. {{ pegawai.pegawais[2]?.nip }}
                </div>
              </div>
            </div>

          </q-card-section>

        </div>
      </div>
      <q-card-section class="bg-primary text-white">
        <div class="row justify-end items-end">
          <div class="items-end">
            <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formattanpaRp } from 'src/modules/formatter'
// eslint-disable-next-line no-unused-vars
import { terbilangRupiah } from 'src/modules/utils'

import { onMounted, ref } from 'vue'
import { useLaporanBkuPengeluaranStore } from 'src/stores/siasik/laporan/bku/bkupengeluaran'
import { useLaporanBukuTunaiStore } from 'src/stores/siasik/laporan/buku_pembantu/bukutunai'

const store = useLaporanBukuTunaiStore()
const pegawai = useLaporanBkuPengeluaranStore()
onMounted(() => {
  pegawai.getDataTable()
})

function bulan(val) {
  const bulan = store.bulans.find((x) => x.value === val)
  return bulan?.nama ?? '-'
}
function totaldebit() {
  const debit = store.hasilArray
  // console.log("njaaias", debit);
  const totaldebit = debit?.length
    ? debit?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totaldebit
}
function totalkredit() {
  const kredit = store.hasilArray
  // console.log("njaaias", debit);
  const totalkredit = kredit?.length
    ? kredit?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  return totalkredit
}

function totalsaldo() {
  const saldo = store.hasilArray
  // console.log("njaaias", debit);
  const totalsaldo = saldo?.length
    ? saldo?.map((x) => x.penerimaan).reduce((x, y) => x + y, 0) -
    saldo?.map((x) => x.pengeluaran).reduce((x, y) => x + y, 0)
    : 0
  // console.log("debit", totaldebit);
  store.saldoakhir = totalsaldo
  return totalsaldo
}
const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'BKU Pejabat Penatausahaan Keuangan | SIASIK',
  beforeOpenCallback(vue) {
    printed.value = true
    console.log('wait...')
  },
  openCallback(vue) {
    console.log('opened')
  },
  closeCallback(vue) {
    printed.value = false
    console.log('closePrint')
  }
}
// const init = () => {
//   store.dataTersimpan()
// }
// const cetakNPD = ref(false)
// function hitungSubtotal () {
//   const arr = store.form.rincians
//   const obj = arr.length ? arr.map((x) => x.nominalpembayaran) : []
//   const subtotal = obj.reduce((x, y) => x + y, 0)
//   // console.log('jumlah', obj)
//   // const total = nominal.reduce((x, y) => x + y, 0)
//   return subtotal
// }
</script>
<style lang="scss" scoped>
.kop {
  border-bottom: 1px solid grey;
  width: fit-content;
}

.logo_kanan {
  right: 5%;
  position: relative;
}

.subtotal {
  position: relative;
  width: 100%;
  height: 100px;
  border-radius: 5px;
}


.underline {
  text-decoration-line: underline;

}
</style>
