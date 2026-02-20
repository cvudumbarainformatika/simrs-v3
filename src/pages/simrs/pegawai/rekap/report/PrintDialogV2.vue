<template>
  <q-dialog persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
    <q-card class="">
      <q-bar class="bg-primary text-white">
        <q-space />
        <q-btn v-print="printObj" dense flat icon="icon-mat-print">
          <q-tooltip class="bg-white text-primary">Print</q-tooltip>
        </q-btn>
        <q-btn v-close-popup dense flat icon="icon-mat-close">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pt-none">
        <div id="printTing">
          <div class="q-ma-md">
            <div class="column items-center">
              <div class="f-12 text-weight-bold">DATA REKAP ABSENSI KARYAWAN (OPTIMIZED)</div>
              <div class="f-12">UOBK RSUD MOHAMAD SALEH KOTA PROBOLINGGO</div>
              <div class="f-12 ">
                Periode Bulan <span class="text-weight-bold">{{ monthName }} {{ tahun }}</span>
                {{ store.ruanganPrint?.length > 0 ? store.ruanganPrint[0].namaruang : '-' }}
              </div>
            </div>
          </div>
          <q-separator />
          <div class="app-table">
            <q-markup-table flat dense :wrap-cells="true">
              <thead>
                <tr>
                  <th v-for="(head, i) in store.columns" :key="i" class="text-left">
                    <div v-if="head === 'nama'">Nama</div>
                    <div v-else-if="head === 'status'" class="text-left">Status</div>
                    <div v-else-if="head === 'IJIN'" class="text-right">I</div>
                    <div v-else-if="head === 'SAKIT'" class="text-right">S</div>
                    <div v-else-if="head === 'DL'" class="text-right">DL</div>
                    <div v-else-if="head === 'masuk'" class="text-right">Masuk (Jam)</div>
                    <div v-else-if="head === 'hari'" class="text-right">Masuk (Hari)</div>
                    <div v-else-if="head === 'kurang'" class="text-right">TL</div>
                    <div v-else-if="head === 'per-t'" class="text-right">% POT</div>
                    <div v-else>{{ head }}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="loading">
                <tr>
                  <td :colspan="store.columns?.length">
                    <div class="flex column flex-center bg-loading-bg__table" style="height:500px">
                      <q-spinner-cube color="primary" size="35px" />
                      <div class="text-primary q-mt-sm">harap bersabar, sedang mengumpulkan data
                        pegawai ...</div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr v-for="(row, idx) in store.items" :key="idx">
                  <td v-for="(col, index) in store.columns" :key="index" class="text-left">
                    <template v-if="!store.rincian">
                      <div v-if="col === 'nama'">
                        <div>{{ row.nama }}</div>
                        <div class="f-10 text-grey">{{ row.nip || row.nik }}</div>
                      </div>
                      <div v-else-if="col === 'status'">{{ row.jenis_pegawai_ket || '-' }}</div>
                      <div v-else-if="col === 'IJIN'" class="text-right">{{ row.summary?.ijin ||
                        '-' }}</div>
                      <div v-else-if="col === 'SAKIT'" class="text-right">{{ row.summary?.sakit ||
                        '-' }}</div>
                      <div v-else-if="col === 'DL'" class="text-right">{{ row.summary?.dl || '-'
                        }}</div>
                      <div v-else-if="col === 'masuk'" class="text-right">{{
                        row.summary?.jam_masuk || '-' }}</div>
                      <div v-else-if="col === 'hari'" class="text-right">{{
                        row.summary?.hari_masuk || 0 }} hari</div>
                      <div v-else-if="col === 'kurang'" class="text-right text-negative">{{
                        row.summary?.terlambat_menit || '-' }}</div>
                      <div v-else-if="col === 'per-t'" class="text-right">{{
                        row.summary?.potongan_persen || 0 }}%</div>
                      <div v-else class="text-right">{{ row[col] || '-' }}</div>
                    </template>
                    <template v-else>
                      <div v-if="col === 'nama'">{{ row.nama }}</div>
                      <div v-else>
                        <div v-if="getTransaksiAbsens(col, row) === 'MSK'" class="columns flex-center items-center">
                          <div class="f-8">{{ getTransaksiAbsen(col, row.transaksi_absen,
                            'masuk') }}</div>
                          <q-separator />
                          <div class="f-8"
                            :class="getTransaksiAbsen(col, row.transaksi_absen, 'pulang') === 'TAP' ? 'text-negative' : ''">
                            {{ getTransaksiAbsen(col, row.transaksi_absen, 'pulang') }}
                          </div>
                        </div>
                        <div v-else class="text-center f-8">{{ getTransaksiAbsens(col, row) }}
                        </div>
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
        <div style="padding-bottom:180px;" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useReportAbsensiStoreV2 } from 'src/stores/simrs/pegawai/absensi/report/report_v2'
import { ref } from 'vue'
import { jamTnpDetik } from 'src/modules/formatter'

const maximizedToggle = ref(true)
const store = useReportAbsensiStoreV2()

defineProps({
  loading: Boolean,
  daysInMonth: Number,
  currentMonth: Number,
  tahun: String,
  monthName: String
})

const printObj = {
  id: 'printTing',
  popTitle: 'Rekap Absensi (Optimized)',
  beforeOpenCallback() { console.log('preparing print...') },
  openCallback() { console.log('printed') },
  closeCallback() { console.log('print closed') }
}

function getTransaksiAbsen(col, data, jns) {
  if (!data || isNaN(col)) return ''
  const num = parseInt(col)
  const cellDate = `${store.params.periode}-${num.toString().padStart(2, '0')}`
  const trans = data.filter(x => x.tanggal === cellDate)
  if (trans.length > 0) {
    if (jns === 'masuk') {
      return trans[0].masuk ? jamTnpDetik(trans[0].created_at) : 'TAM'
    } else {
      return trans[0].pulang ? jamTnpDetik(trans[0].updated_at) : 'TAP'
    }
  }
  return ''
}

function getTransaksiAbsens(col, row) {
  if (isNaN(col)) return ''
  const num = parseInt(col)
  const cellDate = `${store.params.periode}-${num.toString().padStart(2, '0')}`
  const trans = row.transaksi_absen?.filter(x => x.tanggal === cellDate) || []
  const libur = store.protas.filter(x => x.tgl_libur === cellDate)

  // Minimal logic for print rinci
  if (trans.length) return 'MSK'
  if (libur.length) return 'CB'
  return '-'
}
</script>

<style lang="scss" scoped>
$fs : 9px;

.app-table {
  width: 100%;
  font-size: $fs;

  .q-table td,
  .q-table th {
    padding: 4px;
    font-size: $fs;
  }
}

@media print {
  .app-table {
    width: 100%;
    font-size: $fs;

    .q-table td,
    .q-table th {
      padding: 2px;
      font-size: $fs;
      white-space: normal !important;
    }
  }
}
</style>
