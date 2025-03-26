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
          <div class="q-px-sm q-py-sm full-width">
            <div class="row">
              <kopPage />
            </div>
          </div>
          <div class="container items-center q-pa-sm full-width">
            <div class="row">
              <formgetData />
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-card q-mt-sm">
        <q-card class="q-pa-xs">
          <template v-if="store.loading">
            <div class="row justify-center">
              <div class="q-gutter-md">
                <q-spinner-pie color="amber-13" size="40px" />
                <q-spinner-pie color="amber-13" size="60px" />
                <q-spinner-pie color="amber-13" size="40px" />
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
              <listdataBku />
            </div>
            <div style="padding-bottom: 30px" />
            <div class="row flex flex-right">
              <div class="contaier q-pt-lg q-pl-xl">
                <q-card class="saldo bg-grey-3 q-pa-xs" style="width: 500px; height: 220px">
                  <div class="row justify-center q-pt-sm q-py-xs q-px-xs" style="font-size: 14px">
                    <table class="text-weight-bolder no-border">
                      <tbody style="width: 400px">
                        <tr class="no-border">
                          <td class="text-left no-border" width="120px">
                            Saldo Awal
                          </td>
                          <td width="50px" class="no-border">
                            :
                          </td>
                          <td class="text-right no-border" width="170px">
                            {{ formattanpaRp(0) }}
                          </td>
                        </tr>
                        <tr>
                          <td class="text-left no-border" width="120px">
                            Masuk
                          </td>
                          <td width="50px" class="no-border">
                            :
                          </td>
                          <td class="text-right no-border" width="170px">
                            {{ formattanpaRp(totaldebit()) }}
                          </td>
                        </tr>
                        <tr>
                          <td class="text-left no-border" width="120px">
                            Keluar
                          </td>
                          <td width="50px" class="no-border">
                            :
                          </td>
                          <td class="text-right no-border" width="170px">
                            {{ formattanpaRp(totalkredit()) }}
                          </td>
                        </tr>
                        <tr>
                          <td class="text-left no-border" width="120px">
                            Saldo Akhir
                          </td>
                          <td width="50px" class="no-border">
                            :
                          </td>
                          <td class="text-right no-border" width="170px">
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
import formgetData from './inpage/FormBkuBank.vue'
import listdataBku from './inpage/LisaDatabkubank.vue'
import kopPage from './inpage/KopPage.vue'

const store = useLaporanBukuBankStore()

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
  return totalsaldo
}

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

.ttd-kanan {
  position: relative;
  top: 50px;
  left: 60%;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 100px;
}

.ttd-kiri {
  position: relative;
  left: -10%;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 25%;
  height: 100px;
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
</style>
