<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Cetak NPD-Panjar</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>

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
                  Nota Permintaan Dana Panjar (NPD-Panjar)
                </div>
                <div class="row justify-center text-weight-bold q-py-xs">
                  Nomor : {{ store.npddatasave.nonpdpanjar }}
                </div>
              </div>
              <q-separator style="margin-top: -10px;" />
              <q-card-section class="q-pa-sm full-width">
                <div class="col-auto">
                  <div class="row q-col-gutter-md full-width">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Bidang / Bagian
                      </div>
                      <div class="q-py-xs">
                        Kegiatan BLUD
                      </div>
                      <!--<div class="q-py-xs">
                        Nama Bank
                      </div>
                      <div>
                        No. Rekening
                      </div>
                      <div class="q-py-xs">
                        NPWP
                      </div>
                      <div>
                        Keterangan
                      </div> -->
                    </div>
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{ store.npddatasave.bidang }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.kegiatanblud }}
                      </div>
                      <!-- <div>
                        : {{ store.npddatasave.penerima }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.bank }}
                      </div>
                      <div>
                        : {{ store.npddatasave.rekening }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.npddatasave.npwp }}
                      </div>
                      <div>
                        : {{ store.npddatasave.keterangan }}
                      </div> -->
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-py-sm full-width">
                <!-- <template v-if="!store.npddatasave.rincian.nopenerimaan">
              <table
                class="full-width"
              >
                <thead>
                  <tr>
                    <th width="20%">
                      Kode Rekening 50
                    </th>
                    <th width="40%">
                      Rincian Belanja
                    </th>
                    <th width="20%">
                      Item Belanja
                    </th>
                    <th width="20%">
                      Nominal Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody class="align-middle q-pl-sm">
                  <tr v-for="item in store.npddatasave.rincian" :key="item">
                    <td>
                      <div>{{ item.koderek50 }}</div>
                    </td>
                    <td>
                      <div>{{ item.rincianbelanja }}</div>
                    </td>
                    <td>
                      <div>{{ item.itembelanja }}</div>
                    </td>
                    <td class="text-right">
                      <div>{{ formattanpaRp(item.nominalpembayaran) }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-center text-bold">
                      <div>Jumlah Pengajuan</div>
                    </td>
                    <td class="text-right text-bold">
                      <div>{{ formattanpaRp(store.reqs.subtotal) }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template> -->

                <table class="float-center bordered">
                  <thead>
                    <tr>
                      <th width="30%">
                        Kode Rekening 50
                      </th>
                      <th width="30%">
                        Rincian Belanja
                      </th>
                      <th width="20%">
                        Item Belanja
                      </th>
                      <th width="15%">
                        Nominal Pembayaran
                      </th>
                    </tr>
                  </thead>
                  <tbody class="align-middle q-pl-sm">
                    <tr v-for="item in store.npddatasave.npdpjr_rinci" :key="item">
                      <td>
                        <div>{{ item.koderek50 }}</div>
                      </td>
                      <td>
                        <div>{{ item.rincianbelanja50 }}</div>
                      </td>
                      <td>
                        <div>{{ item.itembelanja }}</div>
                      </td>
                      <td class="text-right">
                        <div>{{ formattanpaRp(item.totalpermintaanpanjar) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-center text-bold">
                        <div>Jumlah Pengajuan</div>
                      </td>
                      <td class="text-right text-bold">
                        <div>{{formattanpaRp(store.npddatasave.npdpjr_rinci.reduce((total, curr) => total +
                          parseFloat(curr.totalpermintaanpanjar
                            || 0), 0))}}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="col-auto q-pt-md">
                  <div class="row q-col-gutter-md full-width">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Nilai Pengajuan
                      </div>
                      <div class="q-py-xs">Terbilang</div>
                    </div>
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{'Rp. ' + formattanpaRp(store.npddatasave.npdpjr_rinci.reduce((total, curr) => total +
                          parseFloat(curr.totalpermintaanpanjar || 0), 0))}}
                      </div>
                      <div class="q-py-xs">: {{terbilangRupiah(store.npddatasave.npdpjr_rinci.reduce((total, curr) =>
                        total + parseFloat(curr.totalpermintaanpanjar || 0), 0)) + ' Rupiah'}} </div>
                    </div>
                  </div>
                </div>
              </q-card-section>

              <div class="ttd-kanan">
                <div class="q-py-xs">
                  Probolinggo {{ store.display.sekarang }}
                </div>
                <div class="text-bold">
                  Pejabat Pelaksana Teknis Kegiatan
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold q-py-xs">
                  {{ store.npddatasave?.pptk }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  NIP. {{ store.npddatasave?.kodepptk }}
                </div>
              </div>
              <div class="ttd-kiri">
                <div class="invisible">
                  .
                </div>
                <div class="text-bold q-py-xs q-pt-sm">
                  Kuasa Pengguna Anggaran
                </div>
                <div style="padding-bottom: 40px" />
                <div class="underline text-bold q-py-xs">
                  {{ pegawai.pegawais[1]?.nama }}
                  <div class="garis-bawah" style="text-decoration-line: underline;" />
                </div>
                <div>
                  NIP. {{ pegawai.pegawais[1]?.nip }}
                </div>
              </div>
            </div>
          </div>
        </q-page-container>
        <q-footer elevated>
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
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useLaporanBkuPengeluaranStore } from 'src/stores/siasik/laporan/bku/bkupengeluaran'
import { formattanpaRp } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { onMounted, ref } from 'vue'
import { storeNpdPanjar } from 'src/stores/siasik/transaksi/panjar/npd_panjar/store_npd_panjar'


const store = storeNpdPanjar()
const pegawai = useLaporanBkuPengeluaranStore()


onMounted(() => {
  pegawai.getDataTable()
  store.getDataNpdPanjar()

  console.log('store.npddatasave.rincian', store.npddatasave)
})

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
  const ppnlama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.ppnpusat) : parseFloat(0)
  const ppn = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.06.01.0001')
  const ppnbaru = isNaN(parseFloat(ppn?.nilai)) ? parseFloat(0) : parseFloat(ppn?.nilai)
  const sumppn = parseFloat(ppnlama) + parseFloat(ppnbaru)

  const pajakdaerahlama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pajakdaerah) : parseFloat(0)
  const pajakdaerah = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.05.0001')
  const pajakdaerahbaru = isNaN(parseFloat(pajakdaerah?.nilai)) ? parseFloat(0) : parseFloat(pajakdaerah?.nilai)
  const sumpajakdaerah = parseFloat(pajakdaerahlama) + parseFloat(pajakdaerahbaru)

  const pph21lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph21) : parseFloat(0)
  const arr21 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.01.0001')
  const pph21 = isNaN(parseFloat(arr21?.nilai)) ? parseFloat(0) : parseFloat(arr21?.nilai)
  const sumpph21 = parseFloat(pph21lama) + parseFloat(pph21)

  const pph22lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph22) : parseFloat(0)
  const arr22 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.02.0001')
  const pph22 = isNaN(parseFloat(arr22?.nilai)) ? parseFloat(0) : parseFloat(arr22?.nilai)
  const sumpph22 = parseFloat(pph22lama) + parseFloat(pph22)

  const pph23lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph23) : parseFloat(0)
  const arr23 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.03.0001')
  const pph23 = isNaN(parseFloat(arr23?.nilai)) ? parseFloat(0) : parseFloat(arr23?.nilai)
  const sumpph23 = parseFloat(pph23lama) + parseFloat(pph23)

  const pph25lama = store.npddatasave?.pajak ? parseFloat(store.npddatasave?.pajak.pph25) : parseFloat(0)
  const arr25 = store.npddatasave?.newpajak?.find(x => x.koderekening === '2.1.01.05.04.0001')
  const pph25 = isNaN(parseFloat(arr25?.nilai)) ? parseFloat(0) : parseFloat(arr25?.nilai)
  const sumpph25 = parseFloat(pph25lama) + parseFloat(pph25)

  return { sumppn, sumpajakdaerah, sumpph21, sumpph22, sumpph23, sumpph25 }
}
</script>
<style lang="scss" scoped>
.daftarkegiatan {
  left: 120px;
  top: 200px;
  width: fit-content;
}

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

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}

.ttd-kanan {
  position: relative;
  top: 50px;
  text-align: center;
  justify-content: center;
  width: 60%;
  height: 100px;
  left: 40%;
}

.ttd-kiri {
  position: relative;
  bottom: 50px;
  text-align: center;
  justify-content: center;
  width: 50%;
  height: 100px;
}

.underline {
  text-decoration-line: underline;

}
</style>
