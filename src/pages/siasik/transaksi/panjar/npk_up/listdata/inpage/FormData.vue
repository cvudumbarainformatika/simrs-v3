<template>
  <q-dialog persistent backdrop-filter="blur(4px)">
    <q-card style="min-width:80vw; max-width: 180vw; height: 400px">
      <q-layout view="lHh Lpr lFf" container class="shadow-2 rounded-borders">
        <q-header elevated>
          <q-bar class="bg-black text-white">
            <div>Create NPK-UP</div>
            <q-space />

            <q-btn dense flat icon="icon-mat-close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
        </q-header>
        <q-page-container>
          <div class="q-pa-md">
            <div class="q-pl-sm q-pb-sm text-bold">DATA NPD-UP</div>
            <div class="row q-pa-sm q-col-gutter-md">
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.nosppup" label="Nomer NPD-UP" readonly outlined dense />
              </div>
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.tgltransSpp" label="Tanggal NPD-UP" readonly outlined dense />
              </div>
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs label="Bendahara Pengeluaran" readonly outlined dense
                  v-model="store.formnpk.bendaharapengeluaran" />

              </div>
            </div>
            <div class="row q-pa-sm q-col-gutter-md">
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.namabank" label="Bank" readonly outlined dense />
              </div>
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.norekening" label="Nomor Rekening" readonly outlined dense />
              </div>
              <div class="col-4 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.jumlahspp" label="Jumlah" readonly outlined dense />
              </div>
            </div>

            <div class="q-pl-sm q-pb-sm text-bold">DATA NPK-UP</div>
            <div class="row q-pa-sm q-col-gutter-md">
              <div class="col-6 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.nospm" label="Nomer NPK-UP" readonly outlined dense />
              </div>
              <div class="col-6 q-gutter-y-md">
                <app-input-date-human label="Tanggal NPK-UP" :model="store.formnpk.tglSpm" icon="icon-mat-event"
                  outlined :autofocus="false" :disable="store.disabled || store.loading" @db-model="tglTransaksi"
                  :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
              </div>
            </div>
            <div class="row q-pa-sm q-col-gutter-md">
              <div class="col-12 q-gutter-y-md">
                <app-input-simrs v-model="store.formnpk.uraianPekerjaan" label="Uraian" outlined dense />
              </div>
            </div>
          </div>
        </q-page-container>

        <q-footer elevated>
          <q-card-section class="q-pa-none bg-primary text-white">
            <div class="q-pa-md row justify-end items-end">
              <div class="items-end">
                <!-- <q-btn v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
                  <q-tooltip class="primary" :offset="[10, 10]">
                    Print
                  </q-tooltip>
                </q-btn> -->
                <app-btn label="Simpan" rounded color="dark" :disable="store.loadingSave" :loading="store.loadingSave"
                  @click="store.createNpk()" />
              </div>
            </div>
          </q-card-section>
        </q-footer>
      </q-layout>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { dateFullFormat, dateOnlyYears, formattanpaRp, tanggalEjaIndonesia } from 'src/modules/formatter'
import { terbilangRupiah } from 'src/modules/utils'
import { onMounted, ref } from 'vue'
import { useTransaksiNPDUP } from 'src/stores/siasik/transaksi/panjar/npd_up/store_npd_up'


const store = useTransaksiNPDUP()
// const pegawai = useLaporanBkuPengeluaranStore()


onMounted(() => {
  // pegawai.getDataTable()
  // store.listData()
})
function tglTransaksi(val) {
  // console.log('tglSpm', val)
  store.formnpk.tglSpm = val


}
const printed = ref(false)
const printObj = {
  id: 'printMe',
  popTitle: 'Nota Permintaan Dana Uang Panjar | SIASIK',
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
