<template>
  <div class="q-px-lg q-pt-md">
    <q-card>
      <q-card-section>
        <div class="full-width row justify-between items-center content-between">
          <div class="bg-white col-grow">
            <div class="flex flex-column items-center flex-center">
              <div class="col text-left">
                <div class="f-14 text-weight-bold">
                  Rekap Absensi Pegawai (V2 Optimized)
                </div>
                <div class="title-desc">
                  Halaman Rekap Absensi per bulan (Versi Optimasi Backend)
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-btn outline round color="primary" dense icon="icon-mat-chevron_left" size="sm" @click="prevMonth()" />
          <div class="q-mx-sm">
            {{ bulanName }} {{ tahun }}
          </div>
          <q-btn outline round color="primary" dense icon="icon-mat-chevron_right" size="sm" @click="nextMonth()" />
          <div class="q-ml-md">
            <q-toggle v-model="store.rincian" label="Laporan Rinci" />
          </div>
        </div>
        <app-table-good id="printMe" title="Rekap Absens Pegawai" :columns="store.columns"
          :column-hide="store.columnHide" :items="store.items" :meta="store.meta" :per-page="store.params.per_page"
          :order-by="store.params.order_by" :sort="store.params.sort" :loading="store.loading"
          :row-image="store.settingsTable.imageTampil ? 'foto' : null" :text-size="store.settingsTable.fontSize"
          :default-btn="false" :ada-tambah="false" :to-search="store.params.q" @set-order="sortingDynamis"
          @set-row="store.setPerPage" @goto="store.setPage" @search="store.enterSearch" @find="store.setSearch"
          @refresh="store.refreshTable">
          <template #header-for-print>
            <div class="column items-center q-my-md">
              <div class="f-12 text-weight-bold">
                DATA REKAP ABSENSI KARYAWAN (OPTIMIZED)
              </div>
              <div class="f-12">
                UOBK RSUD MOHAMAD SALEH KOTA PROBOLINGGO
              </div>
              <div class="f-12">
                Periode Bulan {{ bulanName }} {{ tahun }} {{ store.ruanganPrint?.length > 0 ?
                  store.ruanganPrint[0].namaruang : '-' }}
              </div>
            </div>
          </template>
          <template #header-left-after-search>
            <div class="q-ml-sm">
              <q-select v-model="flag" dense outlined option-value="kode_jenis" option-label="jenispegawai"
                behavior="menu" map-options emit-value :options="store.jenis_pegawai" label="Jenis Pegawai"
                style="min-width:150px" @update:model-value="changeFlag" />
            </div>
            <div class="q-ml-sm">
              <q-select v-model="ruang" dense outlined option-value="koderuangan" option-label="namaruang"
                behavior="menu" map-options emit-value :options="store.ruangan" label="Ruangan" style="min-width:150px"
                @update:model-value="changeRuang" />
            </div>
          </template>
          <template #header-right-before>
            <q-btn class="q-mr-sm" unelevated color="teal" round size="sm" icon="icon-mat-settings">
              <q-menu transition-show="flip-right" transition-hide="flip-left">
                <q-list style="min-width: 100px">
                  <q-item v-close-popup clickable dense>
                    <q-item-section>
                      <q-checkbox v-model="store.settingsTable.imageTampil" size="xs" label="Foto Tampil" />
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item v-close-popup clickable dense>
                    <q-item-section>
                      <q-checkbox v-model="store.settingsTable.tampilNip" size="xs" label="Nik / Nip Tampil" />
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item dense clickable>
                    <q-item-section>Ukuran Text</q-item-section>
                    <q-item-section side>
                      <q-icon name="icon-mat-keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu anchor="top end" self="top start">
                      <q-list style="min-width: 80px">
                        <q-item v-for="n in 7" :key="n" v-close-popup dense clickable>
                          <q-item-section>
                            <q-radio v-model="store.settingsTable.fontSize" :val="n + 7" color="teal" size="xs" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ n + 7 }} px</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-separator />
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn ref="refPrint" v-print="printObj" unelevated color="dark" round size="sm" icon="icon-mat-print">
              <q-tooltip class="primary" :offset="[10, 10]">
                Print model 2
              </q-tooltip>
            </q-btn>
          </template>

          <!-- Column Overrides for Summary -->
          <template #col-IJIN="{ right }">
            <div :class="right">I</div>
          </template>
          <template #col-SAKIT="{ right }">
            <div :class="right">S</div>
          </template>
          <template #col-DL="{ right }">
            <div :class="right">DL</div>
          </template>
          <template #col-DSPEN="{ right }">
            <div :class="right">DISPEN</div>
          </template>
          <template #col-CUTI="{ right }">
            <div :class="right">CUTI</div>
          </template>
          <template #col-A="{ right }">
            <div :class="right">A <q-icon v-if="store.sorting.head === 'A'"
                :name="store.sorting.sortBy === 'desc' ? 'icon-mat-vertical_align_bottom' : 'icon-mat-vertical_align_top'" />
            </div>
          </template>
          <template #col-th="{ right }">
            <div :class="right">TH</div>
          </template>
          <template #col-masuk="{ right }">
            <div :class="right">Msk (Jam)</div>
          </template>
          <template #col-hari="{ right }">
            <div :class="right">MSK</div>
          </template>
          <template #col-kurang="{ right }">
            <div :class="right">TL</div>
          </template>
          <template #col-per-t="{ right }">
            <div :class="right">% POT</div>
          </template>
          <template #col-TAP="{ right }">
            <div :class="right">TAP</div>
          </template>

          <!-- Cell Templates (Optimized to row.summary) -->
          <template #cell-default-img="{ row }">
            <div class="row">
              <q-avatar size="30px" class="cursor-pointer"
                :class="row.kelamin === 'Perempuan' ? 'bg-secondary' : 'bg-orange'">
                <img :src="getImage(row.kelamin, row)">
                <q-menu>
                  <div class="row no-wrap q-pa-md">
                    <div class="column items-center">
                      <div class="text-h6 q-mb-md">Detail Pegawai</div>
                      <q-avatar size="100px">
                        <img :ratio="1" fit="cover" :src="getImage(row.kelamin, row)">
                      </q-avatar>
                      <div class=" q-mt-md">{{ row.nama }}</div>
                      <div class="text-primary">{{ row.nama_jabatan || '-' }}</div>
                      <div class="">{{ row.jenis_pegawai_ket || '-' }}</div>
                      <div class="text-grey">{{ row.nama_ruangan || '-' }}</div>
                    </div>
                    <q-separator vertical inset class="q-mx-lg" />
                    <div class="column">
                      <div class=" q-mt-md">Alamat : {{ row.alamat_detil }}</div>
                      <div class="">{{ row.kelurahan }} {{ row.kecamatan }} {{ row.kota }}</div>
                      <div class="">Email : {{ row.email }}</div>
                    </div>
                  </div>
                </q-menu>
              </q-avatar>
            </div>
          </template>

          <template #cell-nama="{ row }">
            <div>
              {{ row.nama }}
              <div v-if="store.settingsTable.tampilNip" class="text-gray"
                :style="`font-size: ${store.settingsTable.fontSize - 2}px`">
                {{ row.nip || row.nik }}
              </div>
            </div>
          </template>

          <template #cell-status="{ row }">
            <div>{{ row.jenis_pegawai_ket || '-' }}</div>
          </template>

          <template #cell-IJIN="{ row, right }">
            <div :class="right">{{ row.summary?.ijin || '-' }}</div>
          </template>
          <template #cell-SAKIT="{ row, right }">
            <div :class="right">{{ row.summary?.sakit || '-' }}</div>
          </template>
          <template #cell-DL="{ row, right }">
            <div :class="right">{{ row.summary?.dl || '-' }}</div>
          </template>
          <template #cell-DSPEN="{ row, right }">
            <div :class="right">{{ row.summary?.dispen || '-' }}</div>
          </template>
          <template #cell-CUTI="{ row, right }">
            <div :class="right">{{ row.summary?.cuti || '-' }}</div>
          </template>
          <template #cell-A="{ row, right }">
            <div :class="`${right} text-negative`">{{ row.summary?.alpha || '-' }}</div>
          </template>
          <template #cell-th="{ row, right }">
            <div :class="right">{{ row.summary?.terlambat_hari || '-' }}</div>
          </template>
          <template #cell-masuk="{ row, right }">
            <div :class="right">{{ row.summary?.jam_masuk || '-' }}</div>
          </template>
          <template #cell-hari="{ row, right }">
            <div :class="right">{{ row.summary?.hari_masuk || 0 }} hari</div>
          </template>

          <template #cell-percent="{ row }">
            <q-linear-progress size="25px" :value="row.summary?.presentase || 0"
              :color="(row.summary?.presentase || 0) > 0.99 ? 'primary' : 'orange'">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="accent"
                  :label="`${((row.summary?.presentase || 0) * 100).toFixed(0)}%`" />
              </div>
            </q-linear-progress>
          </template>

          <template #cell-kurang="{ row, right }">
            <div :class="`text-negative ${right}`">{{ row.summary?.terlambat_menit || '-' }}</div>
          </template>
          <template #cell-TAP="{ row, right }">
            <div :class="`text-negative ${right}`">{{ row.summary?.tap || '-' }}</div>
          </template>
          <template #cell-per-t="{ row, right }">
            <div :class="(row.summary?.potongan_persen || 0) > 0 ? `text-negative ${right}` : right">{{
              row.summary?.potongan_persen || 0 }}%</div>
          </template>

          <!-- Rincian Slots -->
          <template v-for="(num, i) in daysInMonth(currentMonth, tahun)" :key="i" #[getSlotRinci(num)]="{ row }">
            <div v-if="getTransaksiAbsens(num, row) === 'MSK'" class="cursor-pointer"
              @click="lihatDetailAbsensi(num, row)">
              <div
                :class="getTransaksiAbsen(num, row.transaksi_absen, 'masuk') === 'TAM' ? 'text-negative f-10' : 'f-10'">
                {{ getTransaksiAbsen(num, row.transaksi_absen, 'masuk') }}
              </div>
              <div
                :class="getTransaksiAbsen(num, row.transaksi_absen, 'pulang') === 'TAP' ? 'text-negative f-10' : 'f-10'">
                {{ getTransaksiAbsen(num, row.transaksi_absen, 'pulang') }}
              </div>
              <q-popup-proxy :offset="[10, 10]" cover :breakpoint="600">
                <detai-rinci :item="detailAbsensi" :pegawai="detailOrang" />
              </q-popup-proxy>
            </div>
            <div v-else
              :class="getTransaksiAbsens(num, row) === 'A' ? 'text-negative' : getTransaksiAbsens(num, row) === 'CB' ? 'text-primary' : 'text-green'">
              {{ getTransaksiAbsens(num, row) }}
            </div>
          </template>
        </app-table-good>
      </q-card-section>
    </q-card>
    <div style="padding-bottom:180px;" />
  </div>
  <app-loading v-if="printed" />
</template>

<script setup>
import { dateDbFormat, formatJam, jamTnpDetik } from 'src/modules/formatter'
import { daysInMonth, bulans } from 'src/modules/datesme'
import { useReportAbsensiStoreV2 } from 'src/stores/simrs/pegawai/absensi/report/report_v2'
import { computed, onMounted, ref, watch } from 'vue'

import DetaiRinci from './DetailRinci.vue'

const d = new Date()
const store = useReportAbsensiStoreV2()
const flag = ref('all')
const ruang = ref('all')
const printed = ref(false)
const currentMonth = ref(d.getMonth() + 1)
const tahun = ref(d.getFullYear())
const detailAbsensi = ref(null)
const detailOrang = ref(null)

const bulanName = computed(() => bulans(currentMonth.value))

const changePeriode = () => {
  const mm = currentMonth.value.toString().padStart(2, '0')
  const periode = `${tahun.value}-${mm}`
  store.setPeriode(periode)
  store.prota(periode)
}

const sortingDynamis = (val) => store.setSorting(val)

onMounted(() => {
  store.autocomplete()
  changePeriode()
})

const nextMonth = () => {
  if (currentMonth.value >= 12) {
    currentMonth.value = 1
    tahun.value++
  } else {
    currentMonth.value++
  }
  updateColumns()
}

const prevMonth = () => {
  if (currentMonth.value <= 1) {
    currentMonth.value = 12
    tahun.value--
  } else {
    currentMonth.value--
  }
  updateColumns()
}

const updateColumns = () => {
  changePeriode()
  if (store.rincian) {
    store.setColumns(daysInMonth(currentMonth.value, tahun.value))
  } else {
    store.setColumns('default')
  }
}

function getSlotRinci(num) {
  return num <= 9 ? 'cell-0' + num.toString() : 'cell-' + num.toString()
}

function getTransaksiAbsen(num, data, jns) {
  if (!data) return ''
  const bulanX = currentMonth.value.toString().padStart(2, '0')
  const cellDate = `${tahun.value}-${bulanX}-${num.toString().padStart(2, '0')}`
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

function getTransaksiAbsens(num, row) {
  const bulanX = currentMonth.value.toString().padStart(2, '0')
  const cellDate = `${tahun.value}-${bulanX}-${num.toString().padStart(2, '0')}`
  const trans = row.transaksi_absen?.filter(x => x.tanggal === cellDate) || []
  const libur = store.protas.filter(x => x.tgl_libur === cellDate)
  const ijin = getIjinRinci(num, row)
  const alpha = getAlphaRinci(num, row)
  const shift = row.transaksi_absen?.find(x => x.kategory_id > 2)

  if (trans.length && !ijin) return 'MSK'
  if (ijin) return ijin
  if (libur.length && !shift) return 'CB'
  if (alpha) return 'A'
  return 'L'
}

function getIjinRinci(num, row) {
  const bulanX = currentMonth.value.toString().padStart(2, '0')
  const cellDate = `${tahun.value}-${bulanX}-${num.toString().padStart(2, '0')}`
  if (row.user?.libur) {
    return row.user.libur.filter(x => x.tanggal === cellDate).map(y => y.flag)[0] || 0
  }
  return 0
}

function getAlphaRinci(num, row) {
  const bulanX = currentMonth.value.toString().padStart(2, '0')
  const cellDate = `${tahun.value}-${bulanX}-${num.toString().padStart(2, '0')}`
  if (row.alpha?.length) {
    return row.alpha.find(x => x.tanggal === cellDate) ? 'A' : 0
  }
  return 0
}

function getImage(kelamin, row) {
  if (!row.foto_pegawai) {
    return kelamin === 'Perempuan'
      ? new URL('../../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../../assets/images/user-avatar.svg', import.meta.url).href
  }
  return row.foto_pegawai
}

const changeFlag = (val) => store.filterByFlag(val)
const changeRuang = (val) => store.filterByRuang(val)

function lihatDetailAbsensi(num, row) {
  const trans = row.transaksi_absen || []
  const bulan = currentMonth.value.toString().padStart(2, '0')
  const tanggal = num.toString().padStart(2, '0')
  const tanggalklik = `${tahun.value}-${bulan}-${tanggal}`
  const obj = trans.filter(x => x.tanggal === tanggalklik)
  detailAbsensi.value = obj.length ? obj[0] : null
  detailOrang.value = row
}

const printObj = {
  id: 'printMe',
  popTitle: 'Rekap Absensi',
  beforeOpenCallback() { printed.value = true },
  openCallback() { console.log('opened') },
  closeCallback() {
    printed.value = false
    changePeriode()
  }
}

watch(() => store.rincian, (obj) => {
  obj ? store.setColumns(daysInMonth(currentMonth.value, tahun.value)) : store.setColumns('default')
})
</script>

<style lang="scss" scoped></style>
