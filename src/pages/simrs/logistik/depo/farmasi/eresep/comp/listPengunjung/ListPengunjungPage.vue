<template>
  <q-dialog persistent maximized transition-show="slide-left" transition-hide="fade" @before-show="show()"
    @before-hide="emits('hide')">
    <q-card flat class="fit" style="overflow: hidden;">
      <div class="fit column">
        <!-- header -->
        <q-bar class="col-auto bg-primary text-white q-py-sm">
          <div class="q-mr-sm">
            <!-- q -->
            <q-input v-model="param.q" outlined dark color="white" dense placeholder="Cari Pasien ..." debounce="500"
              @keyup.enter.stop="cariData" />
          </div>
          <!-- periode -->
          <q-btn outline class="bg-primary q-px-sm" padding="sm" size="sm" no-caps>
            <div class="flex items-center q-mx-xs">
              <div class="f-12 q-mr-sm">
                {{ periode }}
              </div>
              <transition>
                <q-icon :name="`${showMenuPeriode ? 'icon-mat-keyboard_arrow_up' : 'icon-mat-keyboard_arrow_down'}`"
                  size="16px" />
              </transition>
            </div>

            <q-menu @show="showMenuPeriode = true" @hide="showMenuPeriode = false">
              <div class="row no-wrap q-pa-sms">
                <q-list style="min-width: 100px">
                  <q-item v-for="item in periods" :key="item" clickable :active="item === periode"
                    active-class="bg-primary text-white" :disable="item === 'Custom'" @click="setPeriode(item)">
                    <q-item-section>{{ item }}</q-item-section>
                  </q-item>
                </q-list>
                <q-separator vertical inset />

                <div class="column">
                  <div class="row q-pa-sm q-col-gutter-sm">
                    <div class="col">
                      <q-date v-model="param.from" minimal bordered flat mask="YYYY-MM-DD"
                        @update:model-value="setPeriode('Custom')" />
                      <div class="f-10 text-grey-8 q-mt-xs">
                        DARI TANGGAL : <b>{{ param.from }}</b>
                      </div>
                    </div>
                    <div class="col">
                      <q-date v-model="param.to" minimal bordered flat mask="YYYY-MM-DD"
                        @update:model-value="setPeriode('Custom')" />
                      <div class="f-10 text-grey-8 q-mt-xs">
                        SAMPAI TANGGAL : <b>{{ param.to }}</b>
                      </div>
                    </div>
                  </div>
                  <q-separator />
                  <div class="row q-pa-sm justify-end">
                    <q-btn v-close-popup color="primary" label="Terapkan" push size="sm" @click="getData()" />
                  </div>
                </div>
              </div>
            </q-menu>
          </q-btn>
          <!-- flag -->
          <q-select v-model="txt" dense outlined dark color="white" :options="txts" label="status pasien"
            class="q-ml-sm" emit-value map-options style="min-width: 150px;" @update:model-value="gantiFlag" />
          <!-- poli -->
          <q-btn-dropdown class="glossy q-ml-sm" color="orange" :label="poli?.polirs">
            <q-list>
              <q-item v-for="row in polis" :key="row" v-close-popup clickable @click="gantiPoli(row)">
                <q-item-section avatar>
                  <q-avatar icon="icon-mat-medical_information" color="primary" text-color="white" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ row?.polirs }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- sistem bayar -->
          <q-select v-model="group" dense outlined dark color="white" :options="groups" option-label="nama"
            option-value="value" label="Group Sistembayar" class="q-ml-sm" emit-value map-options
            style="min-width: 150px;" @update:model-value="setGroupSistembayar" />
          <q-space />
          <q-btn unelevated round class="q-mr-sm" size="sm" icon="icon-mat-refresh" @click="getData()">
            <q-tooltip class="primary" :offset="[10, 10]">
              Refresh Data
            </q-tooltip>
          </q-btn>
          <q-btn v-close-popup dense flat icon="icon-mat-close" @click="emits('close')">
            <q-tooltip class="bg-white text-primary">
              Close
            </q-tooltip>
          </q-btn>
        </q-bar>
        <!-- body -->
        <div class="col fit column" style="padding-bottom: 60px; padding-top:0px">
          <div class="col full-height scroll">
            <app-loading v-if="loading" />
            <div v-else>
              <div v-if="items?.length <= 0">
                <div class="column flex-center" style="min-height:50vh">
                  <div class="text-h3 q-mb-md">
                    🏷️
                  </div>
                  <div class="f-14">
                    Belum Ada Data
                  </div>
                </div>
              </div>
              <q-list v-else separator>
                <q-separator spaced inset />
                <q-item v-for="(item, i) in items" :key="i">
                  <q-item-section avatar>
                    <app-avatar-pasien :pasien="item" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">
                      {{ item.nama }} | <span class="text-primary">{{ item.norm }}</span>
                    </q-item-label>
                    <q-item-label>
                      NOREG : <span class="text-weight-bold">{{ item.noreg }} </span> | Penjamin : <span
                        class="text-weight-bold"> {{ item.sistembayar }}</span>
                    </q-item-label>
                    <q-item-label>
                      DPJP : <span class="text-negative text-weight-bold">{{ item.dokter }}</span> | RUANGAN : <span
                        class="text-teal text-weight-bold"> {{ item.poli }}</span>
                    </q-item-label>
                    <q-item-label caption>
                      USIA : <span class="text-weight-bold">{{ item.usia }}</span> | Kelamin : <span
                        class="text-weight-bold">{{
                          item.kelamin }}</span>
                    </q-item-label>
                    <q-item-label>
                      Tgl Kunjungan : <span class="text-weight-bold text-accent"> {{ dateFullFormat(item.tgl_kunjungan)
                      }}
                      </span> | jam : {{ formatJam(item.tgl_kunjungan) }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption>
                      <q-chip :color="getColor(item.status)" text-color="white">
                        {{ getStatus(item.status) }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />
              </q-list>
            </div>
          </div>
        </div>
        <!-- bottom -->
        <div class="fixed-bottom">
          <div class="row items-center justify-between q-pa-sm bg-primary text-white">
            <div>
              <div class="row items-center">
                <q-btn flat color="white" icon="icon-mat-skip_previous" size="sm" round
                  :disable="meta?.current_page === 1" @click="goToPage(1)" />
                <q-btn flat color="white" icon="icon-mat-chevron_left" size="sm" round
                  :disable="meta?.prev_page === null" @click="goToPage(meta?.current_page - 1)" />
                <div class="q-px-sm">
                  <div v-if="meta?.total !== 0">
                    | <span class="q-px-sm">Hal <span class="text-negative text-weight-bold">{{ meta?.current_page
                    }}</span> dari {{ meta?.last_page }} Hal</span> |
                  </div>
                  <div v-else>
                    Tidak Ada Data
                  </div>
                </div>
                <q-btn flat color="white" icon="icon-mat-chevron_right" size="sm" round
                  :disable="meta?.current_page === meta?.last_page" @click="goToPage(meta?.current_page + 1)" />
                <q-btn flat color="white" icon="icon-mat-skip_next" size="sm" round
                  :disable="meta?.current_page === meta?.last_page" @click="goToPage(meta?.last_page)" />
              </div>
            </div>
            <div>{{ meta?.total }} DATA DITEMUKAN</div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { dateDbFormat, dateFullFormat, formatJam } from 'src/modules/formatter'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { onMounted, ref } from 'vue'

const emits = defineEmits(['close', 'show', 'hide'])
const app = useAplikasiStore()

const param = ref({
  q: '',
  from: dateDbFormat(new Date()),
  to: dateDbFormat(new Date()),
  flag: 'all',
  poli: [],
  sistemBayar: null,
  per_page: 20,
  page: 1
})
const periods = ref([
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Custom'
])
const poli = ref({
  kodepoli: 'SEMUA POLI',
  polirs: 'SEMUA POLI'
})
const polis = ref([])
const txt = ref('SEMUA')
const txts = ref(['SEMUA', 'TERLAYANI', 'BELUM TERLAYANI', 'TIDAK DATANG'])
const periode = ref('Hari ini')
const showMenuPeriode = ref(false)
const group = ref(null)
const groups = ref([
  { nama: 'Semua', value: null },
  { nama: 'JKN', value: '1' },
  { nama: 'Mandiri', value: '2' },
  { nama: 'Tagihan', value: '3' }
])
const loading = ref(false)
const items = ref([])
const meta = ref(null)
function hariIni () {
  const cDate = new Date()
  param.value.to = dateDbFormat(cDate)
  param.value.from = dateDbFormat(cDate)
}
function mingguIni () {
  const now = new Date()

  // getDay() => 0 (Minggu) - 6 (Sabtu)
  const firstday = new Date(now)
  firstday.setDate(now.getDate() - now.getDay()) // Minggu

  const lastday = new Date(now)
  lastday.setDate(now.getDate() - now.getDay() + 6) // Sabtu

  param.value.from = dateDbFormat(firstday)
  param.value.to = dateDbFormat(lastday)
}
function bulanIni () {
  const now = new Date()

  // ambil tanggal pertama & terakhir bulan ini
  const firstday = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastday = new Date(now.getFullYear(), now.getMonth() + 1, 0) // tanggal terakhir bulan ini

  param.value.from = dateDbFormat(firstday)
  param.value.to = dateDbFormat(lastday)
}

function setPeriode (val) {
  periode.value = val
  if (val == 'Hari ini') {
    // console.log(val, 'hari')
    hariIni()
  } else if (val == 'Minggu ini') {
    // console.log(val, 'minggu')
    mingguIni()
  } else if (val == 'Bulan ini') {
    // console.log(val, 'bulan')
    bulanIni()
  }

}
function gantiPoli (val) {
  poli.value = val
  param.value.poli = null
  const polinya = [...polis.value]
  polinya.splice(0, 1)
  const sendt = poli.value?.kodepoli === 'SEMUA POLI' ? polinya?.map(x => x?.kodepoli) : [poli.value?.kodepoli ?? '']
  // console.log(sendt)
  param.value.poli = sendt

  getData()
}
function getStatus (val) {
  // '' : 'Belum Terlayanani'
  // '1': 'Terlayani'
  // '2': 'Sudah diterima'
  // '3': Batal
  if (val === '') {
    return 'BELUM TERLAYANI'
  } else if (val === '1') {
    return 'TERLAYANI'
  } else if (val === '2') {
    return 'SUDAH DITERIMA'
  } else {
    return 'Tidak Hadir'
  }
}
function getColor (val) {
  // '' : 'Belum Terlayanani'
  // '1': 'Terlayani'
  // '2': 'Sudah diterima'
  // '3': Batal
  if (val === '') {
    return 'dark'
  } else if (val === '1') {
    return 'primary'
  } else if (val === '2') {
    return 'orange'
  } else {
    return 'negative'
  }
}
function gantiFlag (val) {
  let flag = 'all'
  if (val === 'BELUM TERLAYANI') flag = ''
  else if (val === 'TERLAYANI') flag = '1'
  else if (val === 'TIDAK DATANG') flag = '3'
  param.value.flag = flag
  getData()
}
function setGroupSistembayar (val) {
  param.value.sistemBayar = val
  getData()
}
function cariData (val) {
  getData()
}
function goToPage (val) {
  param.value.page = val
  getData()
}
async function getData () {
  // console.log('get data')

  loading.value = true
  try {
    await api.get('v1/simrs/farmasinew/depo/list-pengunjung-rajal', { params: param.value })
      .then(resp => {
        items.value = resp?.data?.data ?? resp?.data
        meta.value = resp?.data?.meta ?? resp?.data
        // console.log('resp', resp, items.value, meta.value)
      })
  } catch {

  } finally {
    loading.value = false
  }

}
function insertPoli () {
  polis.value = [...app?.polis]
  polis.value.unshift({
    kodepoli: 'SEMUA POLI',
    polirs: 'SEMUA POLI'
  })
  const indexAnastesi = polis.value?.findIndex(x => x?.kodepoli == 'POL001')
  if (indexAnastesi >= 0) polis.value?.splice(indexAnastesi, 1)
  const indexKonsGizi = polis.value?.findIndex(x => x?.kodepoli == 'POL011')
  if (indexKonsGizi >= 0) polis.value?.splice(indexKonsGizi, 1)
  gantiPoli(polis.value[0])
}
async function getPoli () {
  await api.get('v1/simrs/master/listmasterpoli')
    .then(resp => {
      app.polis = resp.data
      insertPoli()
    })
    .catch(() => {
      this.loading = false
    })
}
function show () {
  if (app?.polis?.length > 0) {
    insertPoli()
  }
  getData()
}
onMounted(() => {
  hariIni()
  if (app?.polis?.length > 0) {
    insertPoli()
  } else {
    getPoli()
  }
})
</script>
