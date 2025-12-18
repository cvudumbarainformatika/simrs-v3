<template>
  <q-dialog v-model="store.dialogCetakTbp" persistent maximized>

    <q-card class="print-area q-pa-md">

      <kop-surat-new-page />
      <q-separator />
      <div class="text-center text-weight-bold text-caption q-my-sm">
        TANDA BUKTI PENYETORAN
      </div>

      <!-- INFO -->
      <div class="row q-mb-md">
        <div class="col">
          No. TBP : <b>{{ props?.data?.no_tbp }}</b>
        </div>
        <div class="col text-right">
          Probolinggo, {{ formatDate(props?.data?.tgl_tbp) }}
        </div>
      </div>

      <div class="q-mb-sm">
        Harap diterima uang sebesar :
        <b>Rp {{ rupiah(props?.data?.total) }}</b>
      </div>

      <div class="q-mb-sm">
        (Dengan huruf) : {{ terbilang(props?.data?.total) }} Rupiah
      </div>

      <div class="q-mb-sm">
        Dengan rincian penerimaan sebagai berikut :
      </div>
      <div v-if="store.loadingcetaktbp" class="row items-center justify-center" style="min-height: 60vh">
        <q-inner-loading :showing="store.loadingcetaktbp" color="primary" size="90px">
          <q-spinner-ball size="90px" />
        </q-inner-loading>
      </div>
      <!-- TABLE -->
      <div v-else>
        <q-table :rows="store.itemscetaktbprincian" :columns="columns" flat bordered hide-pagination row-key="__index">
          <template #body-cell-no="props">
            <q-td>{{ props.rowIndex + 1 }}.</q-td>
          </template>

          <template #body-cell-jml="props">
            <q-td align="right">
              {{ rupiah(props.row.jml) }}
            </q-td>
          </template>
        </q-table>

        <!-- TOTAL -->
        <div class="row q-mt-sm">
          <div class="col text-right text-weight-bold">
            Jumlah : Rp {{ rupiah(grandTotal) }}
          </div>
        </div>

        <div class="q-mt-md">
          Uang tersebut diterima pada tanggal
          {{ formatDate(props?.data?.tgl_terima) }}
        </div>

        <!-- TTD -->
        <div class="row q-mt-xl">
          <div class="col text-center">
            Penyetor <br /><br /><br />
            <u>{{ props?.data?.penyetor }}</u>
          </div>
          <div class="col text-center">
            Bendahara Penerimaan <br /><br /><br />
            <u>{{ props?.data?.penerima }}</u><br />
            <!-- {{ props?.data.pegawai.nik }} -->
          </div>
        </div>
      </div>

      <!-- BUTTON -->
      <div class="no-print q-mt-xl text-center">
        <q-btn label="Print" icon="print" color="primary" @click="doPrint" />
        <q-btn flat label="Tutup" class="q-ml-sm" @click="store.dialogCetakTbp = false" />
      </div>

    </q-card>
  </q-dialog>
</template>
<script setup>
import { useTbpKasirStore } from 'src/stores/simrs/kasir/tbp'
import { computed, ref, watch } from 'vue'
import { date } from 'quasar'
import KopSuratNewPage from 'src/pages/simrs/dokumen/KopSuratNewPage.vue'

const store = useTbpKasirStore()

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const tbp = ref({
  no_tbp: '',
  tgl_tbp: '',
  tgl_terima: '',
  penyetor: '',
  penerima: '',
  nip_penerima: '',
  total: 0
})

const rs = {
  nama: 'RS SALEH',
  alamat: 'Jl. Contoh Alamat',
  telp: '0335-xxxxxx'
}

const rincian = ref([])

const columns = [
  { name: 'no', label: 'No', field: 'no' },
  { name: 'kode', label: 'Kode Rekening', field: () => '4.1.4.15.01' },
  { name: 'nama_ruang', label: 'Uraian Rincian Objek', field: 'nama_ruang' },
  { name: 'jml', label: 'Jumlah (Rp)', field: 'jml', align: 'right' }
]

const grandTotal = computed(() => {
  return store.itemscetaktbprincian.reduce(
    (a, b) => a + Number(b.jml || 0),
    0
  )
})

function rupiah(val) {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

function formatDate(val) {
  return val ? date.formatDate(val, 'DD MMMM YYYY') : ''
}

function terbilang(n) {
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];

  n = Math.floor(n);

  if (n < 12) return angka[n];
  if (n < 20) return terbilang(n - 10) + " Belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " Puluh " + terbilang(n % 10);
  if (n < 200) return "Seratus " + terbilang(n - 100);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " Ratus " + terbilang(n % 100);
  if (n < 2000) return "Seribu " + terbilang(n - 1000);
  if (n < 1000000) return terbilang(Math.floor(n / 1000)) + " Ribu " + terbilang(n % 1000);
  if (n < 1000000000) return terbilang(Math.floor(n / 1000000)) + " Juta " + terbilang(n % 1000000);
  if (n < 1000000000000) return terbilang(Math.floor(n / 1000000000)) + " Milyar " + terbilang(n % 1000000000);

  return "jumlah terlalu besar";
}

function doPrint() {
  setTimeout(() => window.print(), 300)
}

/* 🔥 AUTO LOAD DATA SAAT DIALOG DIBUKA */
watch(
  () => store.dialogCetakTbp,
  (val) => {
    if (val && props.data) {
      Object.assign(tbp.value, props.data.tbp)
      rincian.value = props.data.rincian ?? []
    }
  }
)
</script>
<style scoped>
.print-area {
  font-family: Tahoma;
  font-size: 14px;
  background: white;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
