<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 180vw; height: 600px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Cetak Surat Pernyataan Verifikasi</div>
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
              <div class="col-12">
                <div style="border: 1px solid black; margin: 8px 0;"></div>
              </div>
              <div class="col-12 q-py-md">
                <div class="row justify-center text-weight-bold q-py-xs">
                  SURAT PERNYATAAN VERIFIKASI
                </div>
                <div class="row justify-center text-weight-bold">
                  Nomor : {{ store.cetaknotadinas.noverifikasi }}
                </div>
              </div>
              <q-card-section class="q-pa-sm full-width">
                <div class="col">
                  <div class="row q-col-gutter-md full-width">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Sehubungan dengan Nota Dinas Permohonan Belanja :
                      </div>
                    </div>
                  </div>

                  <div class="row q-col-gutter-md q-pl-lg full-width">
                    <div class="col-auto">
                      <div class="q-py-xs">
                        Nomor Nota Dinas
                      </div>
                      <div class="q-py-xs">
                        Tanggal
                      </div>
                      <div class="q-py-xs">
                        Kegiatan BLUD
                      </div>
                      <div class="q-py-xs">
                        Jumlah
                      </div>
                      <div class="q-py-xs">
                        Terbilang
                      </div>
                    </div>
                    <div class="col full-width">
                      <div class="q-py-xs">
                        : {{ store.cetaknotadinas.nonotadinas }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.cetaknotadinas.tglnotadinas }}
                      </div>
                      <div class="q-py-xs">
                        : {{ store.cetaknotadinas.kegiatan }}
                      </div>
                      <div class="q-py-xs">
                        : {{ 'Rp. ' + formattanpaRp(store.cetaknotadinas.total) }}
                      </div>
                      <div class="q-py-xs">
                        : {{ terbilangRupiah(store.cetaknotadinas.total) + ' Rupiah' }}
                      </div>
                    </div>
                  </div>
                  <div class="row q-col-gutter-md q-pr-md q-pt-sm full-width">
                    <div class="col text-justify text-wrap" style="line-height: 1.6;">
                      menyatakan dengan sebenarnya bahwa Nota Dinas Permohonan Belanja ini dipergunakan sesuai
                      dengan peraturan perundangan – undangan yang berlaku dan telah lolos uji verifikasi oleh PPK UOBK
                      RSUD
                      Dokter Mohamad Saleh.
                    </div>
                  </div>
                  <div class="row q-col-gutter-md q-pr-md q-pt-sm full-width">
                    <div class="col text-justify text-wrap">
                      <span class="invisible">..........</span>Demikian Surat Pernyataan ini dibuat untuk melengkapi
                      persyaratan pengajuan Belanja {{
                        store.cetaknotadinas.bidang }}.
                    </div>
                  </div>
                </div>
              </q-card-section>


              <div class="row justify-between full-width q-pt-lg">
                <div class="col flex-start content-center items-center">
                  <!-- <div class="q-py-xs items-center">
                Probolinggo {{ store.display.sekarang }}
              </div>
              <div class="text-bold q-py-xs q-pt-sm">
                Pejabat Teknis Kegiatan
              </div>
              <div style="padding-bottom: 40px" />
              <div class="underline text-bold q-py-xs">
                {{ store.cetaknotadinas.namapptk }}
                <div class="garis-bawah" style="text-decoration-line: underline;" />
              </div>
              <div>
                NIP. {{ store.cetaknotadinas.kodepptk }}
              </div> -->
                </div>
                <div class="col flex-end content-center text-center">
                  <div class="items-center">
                    Probolinggo, <span class="q-pl-lg"> - </span> <span class="q-pl-lg">-</span> {{ store.display.skg }}
                  </div>
                  <div class="text-bold q-py-xs q-pt-sm">
                    Pejabat Penatausahaan Keuangan
                  </div>
                  <div style="padding-bottom: 40px" />
                  <div class="underline text-bold q-py-xs">
                    {{ store.datattd[1]?.nama }}
                    <div class="garis-bawah" style="text-decoration-line: underline;" />
                  </div>
                  <div>
                    NIP. {{ store.datattd[1]?.nip }}
                  </div>
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
import { dateOnlyYears, formattanpaRp } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { onMounted, ref } from 'vue'
import { listdataNotadinasStore } from 'src/stores/siasik/transaksi/ls/notadinas/list'


const store = listdataNotadinasStore()
// const pegawai = useLaporanBkuPengeluaranStore()


onMounted(() => {
  // pegawai.getDataTable()
  // store.listData()
})

const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Surat Pernyataan Verifikasi | SIASIK',
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
//   const obj = arr?.length ? arr.map((x) => x.nominalpembayaran) : []
//   const subtotal = obj.reduce((x, y) => x + y, 0)
//   // console.log('jumlah', obj)
//   // const total = nominal.reduce((x, y) => x + y, 0)
//   return subtotal
// }
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
