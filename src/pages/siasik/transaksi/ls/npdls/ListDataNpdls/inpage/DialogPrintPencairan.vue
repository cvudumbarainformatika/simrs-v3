<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw;">
      <q-bar class="bg-black text-white">
        <div>Cetak Pencairan</div>
        <q-space />

        <q-btn dense flat icon="icon-mat-close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <div id="printMe" class="f-12 row justify-center">
        <template v-if="store.npddatasave.tglcair != null">
          <q-card-section>
            <div class="col-auto">
              <div class="row b1 justify-between full-width full-height ">
                <div class="row q-pa-sm b2 q-pr-xl" style="width:50%">
                  <div class="row full-width flex-center">
                    <q-img src="~assets/logos/logo-rsud.png" style="height: 1.5cm; width: 1.5cm" />
                    <div class="row q-px-md flex-center text-center">
                      <div class="col-auto q-pa-sm text-weight-bold text-center">
                        <div>PEMERINTAH KOTA PROBOLINGGO</div>
                        <div>RSUD DOKTER MOHAMAD SALEH</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row q-pa-sm" style="width:50%">
                  <div class="row q-pa-sm text-weight-bold flex-center">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Nomor NPK
                      </div>
                      <div class="q-py-xs">
                        Tanggal NPK
                      </div>
                    </div>
                    <div class="q-px-md" />
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{ store.npddatasave.nonpk }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.tglcair }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row b justify-between full-width full-height ">
                <div class="row q-pa-sm b2" style="width:50%">
                  <div class="row q-pa-sm text-weight-bold flex-center">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Nomor NPD-LS
                      </div>
                      <div class="q-py-xs">
                        Tanggal
                      </div>
                      <div class="q-py-xs">
                        Bidang
                      </div>
                      <div class="q-py-xs">
                        Kegiatan
                      </div>
                    </div>
                    <div class="q-px-md" />
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{ store.npddatasave.nonpdls }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.tglnpdls }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.bidang }}
                      </div>
                      <div class="q-py-xs full-height">
                        : {{ store.npddatasave.kegiatanblud }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row" style="width:50%">
                  <div class="row flex-center full-width">
                    <div class="col text-weight-bold full-width q-pa-sm b3 text-center">
                      <div class="q-py-xs">
                        NOTA PENCAIRAN KAS
                      </div>
                      <div class="q-py-xs">
                        (NPK)
                      </div>
                    </div>
                    <div class="row full-width q-pa-sm">
                      <div class="col-auto">
                        <div class="q-py-xs">
                          Dari
                        </div>
                        <div class="q-py-xs">
                          Tahun
                        </div>
                      </div>
                      <div class="q-px-md" />
                      <div class="col full-width">
                        <div class="q-py-xs">
                          : PPK (Pejabat Penatausahaan Keuangan)
                        </div>
                        <div class="q-py-xs">
                          : {{ store.params.tahun }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row b justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs" style="width:100%">
                  <div class="row q-pl-sm q-py-xs flex-center">
                    <div class="col-auto">
                      <div>
                        Rekening Bank
                      </div>
                    </div>
                    <div class="q-px-md" />
                    <div class="col full-width">
                      <div>
                        : BANK JATIM
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row b justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs" style="width:100%">
                  <div class="row q-pl-sm q-pt-xs flex-center">
                    <div class="col-auto">
                      <div>
                        Hendaklah mencairkan / memindahkan dari Rekening Nomor
                      </div>
                    </div>
                    <div class="q-px-md" />
                    <div class="col full-width">
                      <div>
                        : 0121161061
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row q-pl-sm q-pb-xs" style="width:100%">
                  <div class="row q-pl-sm q-pb-xs flex-center">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Uang Sebesar
                      </div>
                      <div class="q-py-xs">
                        Terbilang
                      </div>
                    </div>
                    <div class="q-px-md" />
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : Rp. {{ formattanpaRp(store.npddatasave.total) }}
                      </div>
                      <div class="q-py-xs">
                        : {{ terbilangRupiah(store.npddatasave.total) }} Rupiah
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row b4 justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs" style="width:100%">
                  <div class="row q-pl-sm q-pb-xs flex-center">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Pihak Ketiga
                      </div>
                      <div class="q-py-xs">
                        Rekening Bank
                      </div>
                      <div class="q-py-xs">
                        No. Rekening
                      </div>
                      <div class="q-py-xs">
                        NPWP
                      </div>
                      <div class="q-py-xs">
                        Untuk Keperluan
                      </div>
                    </div>
                    <div class="q-px-sm" />
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{ store.npddatasave.penerima }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.bank }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.rekening }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.npwp }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.keterangan }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row justify-between full-width full-height ">
                <div class="row" style="width:100%">
                  <table class="items-center full-width">
                    <thead>
                      <tr>
                        <th>
                          No.
                        </th>
                        <th>
                          Kode Rekening
                        </th>
                        <th>
                          Uraian
                        </th>
                        <th>
                          Jumlah (Rp.)
                        </th>
                      </tr>
                    </thead>
                    <tbody class="align-middle q-pl-sm">
                      <tr v-for="item, n in store.npddatasave.rincian" :key="item">
                        <td class="text-right">
                          <div>
                            {{ n + 1 }}.
                          </div>
                        </td>
                        <td>
                          <div>
                            {{ item.koderek50 }}
                          </div>
                          <div>
                            {{ item.rincianbelanja }}
                          </div>
                        </td>
                        <td>
                          <div>
                            {{ item.itembelanja }}
                          </div>
                        </td>
                        <td class="text-right">
                          <div>
                            {{ formattanpaRp(item.nominalpembayaran) }}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center text-weight-bold" colspan="3">
                          <div>Jumlah</div>
                        </td>
                        <td class="text-right text-weight-bold" colspan="3">
                          <div>{{ formattanpaRp(store.npddatasave.total) }} </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="row b4 justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs" style="width:100%">
                  <div class="row q-pl-sm q-pb-xs flex-center">
                    Potongan-potongan :
                  </div>
                </div>
              </div>

              <div class="row justify-between full-width full-height ">
                <div class="row" style="width:100%">
                  <table class="items-center full-width">
                    <thead>
                      <tr>
                        <th style="width: 40px">
                          No.
                        </th>
                        <th>
                          Uraian
                        </th>
                        <th>
                          Jumlah (Rp.)
                        </th>
                      </tr>
                    </thead>
                    <tbody v-if="store.npddatasave.pajak" class=" align-middle q-pl-sm">
                      <tr>
                        <td class="text-right">
                          <div>
                            1.
                          </div>
                        </td>
                        <td>
                          <div>
                            PPN Pusat
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.ppnpusat) }}
                          </div>
                          <div
                            v-else-if="store.npddatasave.newpajak.length !== 0 || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().ppn?.nilai) ? 0 : mapPajakBaru().ppn?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumppn) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right">
                          <div>
                            2.
                          </div>
                        </td>
                        <td>
                          <div>
                            PPh 21
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.pph21) }}
                          </div>
                          <div v-if="store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().pph21?.nilai) ? 0 : mapPajakBaru().pph21?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumpph21) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right">
                          <div>
                            3.
                          </div>
                        </td>
                        <td>
                          <div>
                            PPh 22
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.pph22) }}
                          </div>
                          <div v-if="store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().pph22?.nilai) ? 0 : mapPajakBaru().pph22?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumpph22) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right">
                          <div>
                            4.
                          </div>
                        </td>
                        <td>
                          <div>
                            PPh 23
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.pph23) }}
                          </div>
                          <div v-if="store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().pph23?.nilai) ? 0 : mapPajakBaru().pph23?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumpph23) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right">
                          <div>
                            5.
                          </div>
                        </td>
                        <td>
                          <div>
                            PPh 25
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.pph25) }}
                          </div>
                          <div v-if="store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().pph25?.nilai) ? 0 : mapPajakBaru().pph25?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumpph25) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right">
                          <div>
                            6.
                          </div>
                        </td>
                        <td>
                          <div>
                            Pajak Daerah (PPh Final)
                          </div>
                        </td>
                        <td class="text-right">
                          <!-- <div v-if="store.npddatasave.pajak != null">
                            {{ formattanpaRp(store.npddatasave.pajak.pajakdaerah) }}
                          </div>
                          <div v-if="store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(isNaN(mapPajakBaru().pajakdaerah?.nilai) ? 0 :
                              mapPajakBaru().pajakdaerah?.nilai) }}
                          </div> -->
                          <div v-if="store.npddatasave.pajak != null || store.npddatasave.newpajak.length > 0">
                            {{ formattanpaRp(mapPajakBaru().sumpajakdaerah) }}
                          </div>
                          <div v-else>{{ formattanpaRp(0) }} </div>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-center text-weight-bold" colspan="2">
                          <div>Jumlah</div>
                        </td>
                        <td class="text-right text-weight-bold">
                          <template v-if="store.npddatasave.pajak != null">
                            <div>
                              {{ formattanpaRp(store.npddatasave.totalpajak) }}
                            </div>
                          </template>
                          <template v-else>
                            <div>{{ formattanpaRp(0) }} </div>
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-weight-bold" colspan="3">
                          <div>NPK yang dibayarkan</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div>Jumlah yang Diminta</div>
                        </td>
                        <td class="text-right justify-between">
                          <div class="row">
                            <div class="col-auto">
                              Rp.
                            </div>
                            <div class="col">
                              {{ formattanpaRp(store.npddatasave.total) }}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <div>Jumlah Potongan</div>
                        </td>
                        <td class="text-right justify-between">
                          <template v-if="store.npddatasave.pajak != null">
                            <div class="row">
                              <div class="col-auto">
                                Rp.
                              </div>
                              <div class="col">
                                {{ formattanpaRp(store.npddatasave.totalpajak) }}
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="row">
                              <div class="col-auto">
                                Rp.
                              </div>
                              <div class="col">
                                {{ formattanpaRp(0) }}
                              </div>
                            </div>
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-weight-bold" colspan="2">
                          <div>Jumlah yang Dibayarkan</div>
                        </td>
                        <td class="text-right justify-between">
                          <div class="row">
                            <template v-if="store.npddatasave.pajak != null">
                              <div class="col-auto">
                                Rp.
                              </div>
                              <div class="col">
                                {{ formattanpaRp(store.npddatasave.totalbayar) }}
                              </div>
                            </template>
                            <template v-else>
                              <div class="col-auto text-weight-bold">
                                Rp.
                              </div>
                              <div class="col text-weight-bold">
                                {{ formattanpaRp(store.npddatasave.total) }}
                              </div>
                            </template>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr v-for="(item, n) in store.npddatasave.newpajak" :key="n">
                        <td>{{ n + 1 }}</td>
                        <td>{{ item.uraian }}</td>
                        <td class="text-right justify-between">
                          <div class="row">
                            <span class="col-auto">Rp.</span>
                            <span class="col">{{ formattanpaRp(item.nilai) }}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="row b4 justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs text-weight-bold" style="width:100%">
                  <template v-if="store.npddatasave.pajak != null">
                    <div>
                      Uang Sejumlah : {{ terbilangRupiah(store.npddatasave.totalbayar) }}
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      Uang Sejumlah : {{ terbilangRupiah(store.npddatasave.total) }}
                    </div>
                  </template>
                </div>
              </div>

              <div class="row b justify-between full-width full-height ">
                <div class="row q-pl-sm q-py-xs text-weight-bold" style="width:100%">
                  <div class="col full-width" />
                  <div class="col text-center">
                    <div class="q-py-xs">
                      Probolinggo {{ store.display.sekarang }}
                    </div>
                    <div class="text-bold">
                      PEJABAT PENATAUSAHAAN KEUANGAN
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
              </div>
            </div>
          </q-card-section>
        </template>
        <template v-else>
          <q-card-section>
            <div class="container q-pa-md full-width">
              <q-card class="items-center bg-yellow-1 q-pa-xl full-width">
                <div class="row flex-center">
                  SABAR YA... NPD-LS BELUM DICAIRKAN
                </div>
              </q-card>
            </div>
          </q-card-section>
        </template>
      </div>
      <q-card-section class="q-pa-none bg-primary text-white">
        <div class="q-pa-md row justify-end items-end">
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
import { listDataNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/listdatanpdls'
import { useLaporanBkuPengeluaranStore } from 'src/stores/siasik/laporan/bku/bkupengeluaran'
import { formattanpaRp } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { ref } from 'vue'

const store = listDataNpdlsStore()
const pegawai = useLaporanBkuPengeluaranStore()

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Nota Permintaan Dana Langsung (NPD-LS) | SIASIK',
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

function mapPajakBaru() {
  const ppnlama = parseFloat(store.npddatasave?.pajak?.ppnpusat)
  const ppn = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.06.01.0001')
  const ppnbaru = parseFloat(isNaN(ppn?.nilai) ? 0 : ppn?.nilai)
  const sumppn = ppnlama + ppnbaru

  const pajakdaerahlama = parseFloat(store.npddatasave?.pajak?.pajakdaerah)
  const pajakdaerah = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.06.02.0001')
  const pajakdaerahbaru = parseFloat(isNaN(pajakdaerah?.nilai) ? 0 : pajakdaerah?.nilai)
  const sumpajakdaerah = pajakdaerahlama + pajakdaerahbaru

  const pph21lama = parseFloat(store.npddatasave?.pajak?.pph21)
  const arr21 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.01.0001')
  const pph21 = parseFloat(isNaN(arr21?.nilai) ? 0 : arr21?.nilai)
  const sumpph21 = pph21lama + pph21

  const pph22lama = parseFloat(store.npddatasave?.pajak?.pph22)
  const arr22 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.02.0001')
  const pph22 = parseFloat(isNaN(arr22?.nilai) ? 0 : arr22?.nilai)
  const sumpph22 = pph22lama + pph22

  const pph23lama = parseFloat(store.npddatasave?.pajak?.pph23)
  const arr23 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.03.0001')
  const pph23 = parseFloat(isNaN(arr23?.nilai) ? 0 : arr23?.nilai)
  const sumpph23 = pph23lama + pph23

  const pph25lama = parseFloat(store.npddatasave?.pajak?.pph25)
  const arr25 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.04.0001')
  const pph25 = parseFloat(isNaN(arr25?.nilai) ? 0 : arr25?.nilai)
  const sumpph25 = pph25lama + pph25

  return { sumppn, sumpajakdaerah, sumpph21, sumpph22, sumpph23, sumpph25 }
}
</script>
<style>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.b1 {
  border-style: solid;
  border-width: 2px;
}

.b2 {
  border-right-style: solid;
  border-width: 2px;
}

.b3 {
  border-bottom-style: solid;
  border-width: 2px;
}

.b4 {
  border-right-style: solid;
  border-left-style: solid;
  border-width: 2px;
}

table,
th,
td {
  border-width: 2px;
  border-style: solid;
  border-collapse: collapse;
}

td {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
