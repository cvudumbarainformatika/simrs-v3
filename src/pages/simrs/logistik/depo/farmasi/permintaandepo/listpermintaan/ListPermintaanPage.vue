<template>
  <!-- <div
    class="fixed-top row items-center justify-end q-mr-sm"
    style="z-index: 10;"
  >
    <div>
      <q-btn
        flat
        :icon="!style.componentfull ? 'icon-mat-open_in_full' : 'icon-mat-close_fullscreen'"
        round
        :color="style.componentfull ? 'green' : 'primary'"
        size="12px"
        class="q-ml-md"
        @click="style.setComponentFull"
      />
    </div>
  </div> -->
  <div class="q-mx-sm">
    <app-table-extend
      :columns="store.columns"
      :column-hide="store.columnHide"
      :items="store.items"
      :meta="store.meta"
      :per-page="store.param.per_page"
      :loading="store.loading"
      :to-search="store.param.no_permintaan"
      :click-able="true"
      :default-btn="false"
      :ada-tambah="false"
      :ada-filter="false"
      row-no
      use-full
      @find="store.setSearch"
      @goto="store.setPage"
      @set-row="store.setPerPage"
      @refresh="store.refreshTable"
      @on-click="onClick"
    >
      <template #col-no_permintaan>
        <div>Nomor Permintaan</div>
      </template>
      <template #col-tgl_permintaan>
        <div>Tanggal</div>
      </template>
      <template #col-dari>
        <div>Dari</div>
      </template>
      <template #col-tujuan>
        <div>Tujuan</div>
      </template>
      <template #col-flag>
        <div class="text-center">
          Status
        </div>
      </template>
      <template #cell-tgl_permintaan="{ row }">
        <div class="row items-center justify-between no-wrap q-mb-xs">
          <div class="">
            {{ row.tgl_permintaan ? dateFullFormat(row.tgl_permintaan) : '-' }}
          </div>
        </div>
      </template>
      <template #cell-flag="{ row }">
        <q-chip
          class="f-12"
          :color="color(row.flag)"
          text-color="white"
          :label="label(row.flag)"
        />
      </template>
      <template #cell-dari="{ row }">
        {{ row?.asal?.nama }}
      </template>
      <template #cell-tujuan="{ row }">
        {{ row?.menuju?.nama }}
      </template>
      <template #expand="{ row }">
        <div v-if="row.permintaanrinci?.length">
          <div class="row items-center text-weight-bold">
            <div class="col-4">
              Obat
            </div>
            <div class="col-2">
              Jumlah
            </div>
          </div>
          <div
            v-for="(rin, i) in row.permintaanrinci"
            :key="i"
          >
            <div class="row items-center q-col-gutter-sm anu">
              <div class="col-4">
                <div class="row justify-between no-wrap">
                  <div class="q-mr-sm">
                    Kode
                  </div>
                  <div class="text-weight-bold text-primary">
                    {{ rin.kdobat }}
                  </div>
                </div>
                <div class="row justify-between no-wrap items-center">
                  <div class="q-mr-sm">
                    Nama
                  </div>
                  <div
                    class="text-weight-bold text-primary text-right"
                    style="white-space: normal;"
                  >
                    {{ rin.masterobat ? rin.masterobat.nama_obat : '-' }}
                  </div>
                </div>
                <div class="row justify-between no-wrap">
                  <div class="q-mr-sm">
                    satuan
                  </div>
                  <div class="text-weight-bold text-deep-purple">
                    {{ rin.masterobat ? rin.masterobat.satuan_k : '-' }}
                  </div>
                </div>
              </div>
              <div class="col-2">
                <div class="row justify-between no-wrap">
                  <div class="q-mr-sm">
                    Minta
                  </div>
                  <div class="text-weight-bold">
                    {{ rin.jumlah_minta }}
                  </div>
                </div>
                <!-- <div class="row justify-between no-wrap">
                  <div class="q-mr-sm">
                    Disetujui
                  </div>
                  <div class="text-weight-bold">
                    {{ rin.jumlah_disetujui? rin.jumlah_disetujui:'-' }}
                  </div>
                </div> -->
                <div class="row justify-between no-wrap">
                  <div class="q-mr-sm">
                    Maks Stok
                  </div>
                  <div class="text-weight-bold">
                    {{ rin.mak_stok? rin.mak_stok:'-' }}
                  </div>
                </div>
              </div>
              <div class="col-6 text-right">
                <q-btn
                  v-if="!row.flag"
                  flat
                  icon="icon-mat-delete"
                  size="sm"
                  color="red"
                  round
                  :loading="permintaan.loadingBatal && rin.loading"
                  @click="batalRinci(rin,row)"
                >
                  <q-tooltip
                    class="primary"
                    :offset="[10, 10]"
                  >
                    Hapus Obat
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          Tidak ada Rincian
        </div>
      </template>
      <template #left-acttion="{ row }">
        <div v-if="!row.flag">
          <div class="row items-center">
            <div class="col">
              <q-btn
                flat
                icon="icon-mat-add_circle"
                size="13px"
                color="primary"
                round
                @click="tambah(row)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Tambah Obat
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                flat
                icon="icon-mat-delete"
                size="sm"
                color="red"
                round
                :loading="permintaan.loadingBatal && row.loading"
                @click="batal(row)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Batal Pemintaan
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col">
              <q-btn
                flat
                icon="icon-mat-lock_open"
                dense
                color="green"
                :loading="permintaan.loadingKunci && row.loading"
                :disable="permintaan.loadingKunci && row.loading"
                @click="kunci(row)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Permintaan Depo sudah selesai dan siap di kunci
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <div v-if="row.flag">
          <div class="row items-center">
            <div v-if="row.flag==='1' || row.flag==='4'">
              <q-btn
                round
                icon="icon-mat-print"
                dense
                color="dark"
                size="sm"
                @click="toPrint(row)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Print
                </q-tooltip>
              </q-btn>
            </div>
            <div class="q-mr-sm" />
            <div>
              <q-btn
                flat
                icon="icon-mat-lock"
                dense
                color="negative"
                @click="info(row)"
              >
                <q-tooltip
                  class="primary"
                  :offset="[10, 10]"
                >
                  Permintaan Depo sudah di kunci
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>
    </app-table-extend>
  </div>
  <app-print-surat
    ref="dialogPrint"
    v-model="store.isOpen"
    :tanggal="store.dataToPrint?.flag==='1'?store.dataToPrint?.tgl_kirim:store.dataToPrint?.tgl_terima_depo"
    @close="store.isOpen=false"
  >
    <template #isi>
      <!-- Top words -->
      <div
        v-if="store.dataToPrint?.flag==='1'"
        class="row justify-center q-mt-md f-16 text-weight-bold"
      >
        DATA PERMINTAAN
      </div>
      <div
        v-if="store.dataToPrint?.flag==='4'"
        class="row justify-center q-mt-md f-16 text-weight-bold"
      >
        DATA PENERIMAAN
      </div>

      <div
        v-if="store.dataToPrint?.flag==='1'"
        class="row justify-center q-mb-sm"
      >
        <div class="col-2">
          Tanggal Permintaan
        </div>
        <div class="col-1">
          :
        </div>
        <div class="col-9">
          {{ dateFullFormat(store.dataToPrint?.tgl_kirim) }}
        </div>
      </div>
      <div
        v-if="store.dataToPrint?.flag==='4'"
        class="row justify-center q-mb-sm"
      >
        <div class="col-2">
          Tanggal Penerimaan
        </div>
        <div class="col-1">
          :
        </div>
        <div class="col-9">
          {{ dateFullFormat(store.dataToPrint?.tgl_terima_depo) }}
        </div>
      </div>
      <div class="row justify-center q-mb-sm">
        <div class="col-2">
          No. Permintaan
        </div>
        <div class="col-1">
          :
        </div>
        <div class="col-9">
          {{ store.dataToPrint?.no_permintaan }}
        </div>
      </div>
      <div
        v-if="store.dataToPrint?.flag==='1'"
        class="row justify-start q-mb-md"
      >
        <p>
          Telah dikirimkan ke
          <span class="text-weight-bold">
            {{ store.dataToPrint?.menuju?store.dataToPrint?.menuju.nama:'-' }}
          </span> permintaan barang dalam list dibawah ini :
        </p>
      </div>
      <div
        v-if="store.dataToPrint?.flag==='4'"
        class="row justify-start q-mb-md"
      >
        <p>
          Telah diterima dari
          <span class="text-weight-bold">
            {{ store.dataToPrint?.menuju?store.dataToPrint?.menuju.nama:'-' }}
          </span> barang dalam list dibawah ini :
        </p>
      </div>

      <!-- no details -->
      <div v-if="!store.dataToPrint?.permintaanrinci">
        <app-no-data />
      </div>
      <!-- details -->
      <div v-if="store.dataToPrint?.permintaanrinci">
        <!-- header detail -->
        <div class="row justify-between q-col-gutter-sm">
          <div class="col-5 text-weight-bold border-tb border-left">
            Nama Barang
          </div>
          <div class="col-1 text-weight-bold border-tb border-left">
            Jumlah
          </div>
          <div class="col-2 text-weight-bold border-tb border-left">
            Satuan
          </div>
          <div class="col-4 text-weight-bold border-box">
            Keterangan
          </div>
        </div>
        <!-- body details -->
        <div
          v-for="(det, i) in store.dataToPrint?.permintaanrinci"
          :key="i"
        >
          <div
            class="row justify-between q-col-gutter-sm"
          >
            <div class="col-5 border-bottom border-left">
              {{ i+1 }}. {{ det.masterobat?det.masterobat.nama_obat:'Nama barang tidak ditemukan' }}
            </div>
            <div
              v-if="store.dataToPrint?.flag==='1'"
              class="col-1 border-bottom border-left"
            >
              {{ det.jumlah_minta===null?0:det.jumlah_minta }}
            </div>
            <div
              v-if="store.dataToPrint?.flag==='4'"
              class="col-1 border-bottom border-left"
            >
              {{ det.distribusi===null?0:det.distribusi }}
            </div>
            <div
              class="col-2 border-bottom border-left"
            >
              {{ det.masterobat?det.masterobat.satuan_k:'-' }}
            </div>
            <div class="col-4 border-bottom border-left border-right">
              <div class="print-only">
                {{ det?.keterangan??'-' }}
              </div>
              <div class="print-hide">
                <app-input
                  v-model="det.keterangan"
                  label="keterangan"
                  outlined
                  valid
                />
              </div>
            </div>
          </div>
          <q-separator />
        </div>
      </div>
    </template>
  </app-print-surat>
</template>
<script setup>
import { dateFullFormat } from 'src/modules/formatter'
import { notifSuccessVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useListPermintaanStore } from 'src/stores/simrs/farmasi/permintaandepo/listpermintaan'
import { useFarmasiPermintaanDepoStore } from 'src/stores/simrs/farmasi/permintaandepo/permintaandepo'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const store = useListPermintaanStore()
const permintaan = useFarmasiPermintaanDepoStore()
const apps = useAplikasiStore()

function toPrint (val) {
  store.dataToPrint = val
  val.expand = !val.expand
  val.highlight = !val.highlight
  store.isOpen = true
}
onMounted(() => {
  store.setParam('kddepo', apps?.user?.kdruangansim)
  store.getInitialData()
})
watch(() => apps?.user?.kdruangansim, (obj) => {
  store.setParam('kddepo', obj)
  store.getInitialData()
})
// click
function onClick (val) {
  // console.log('click', val)
  val.item.expand = !val.item.expand
  val.item.highlight = !val.item.highlight
}

function info (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  notifSuccessVue('Penerimaan nomor ' + val.no_permintaan + ' Sudah dikunci dan dapat dilakukan Penerimaan')
}
const toloadBeli = ref('')
function kunci (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  permintaan.kunci(val).then(() => {
    toloadBeli.value = ''
    if (!val.flag) val.flag = 1
  })
}
const router = useRouter()
function tambah (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  console.log(val)
  permintaan.setForm('no_permintaan', val.no_permintaan)
  permintaan.details = val?.permintaanrinci
  permintaan.details.forEach(det => {
    det.nama_obat = det?.masterobat?.nama_obat
  })
  router.push({ path: '/depo/farmasi/permintaandepo/permintaan', replace: true })
}
function batal (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  permintaan.batalHead(val)
}
function batalRinci (val, row) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  permintaan.batalRinci(val, row)
}

function color (val) {
  switch (val) {
    case '':
      return 'grey'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'cyan'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      // return 'grey'
      return 'blue'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      // return 'grey'
      return 'orange'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      // return 'grey'
      return 'purple'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'red'
      // eslint-disable-next-line no-unreachable
      break
  }
}
function label (val) {
  switch (val) {
    case '':
      return 'Draft'
      // eslint-disable-next-line no-unreachable
      break
    case '1':
      return 'Dikirim Ke Gudang'
      // eslint-disable-next-line no-unreachable
      break
    case '2':
      // return 'grey'
      return 'Diterima gudang'
      // eslint-disable-next-line no-unreachable
      break
    case '3':
      // return 'grey'
      return 'Sudah Di distribusikan'
      // eslint-disable-next-line no-unreachable
      break
    case '4':
      // return 'grey'
      return 'Diterima Depo'
      // eslint-disable-next-line no-unreachable
      break

    default:
      return 'status belum ditentukan'
      // eslint-disable-next-line no-unreachable
      break
  }
}
</script>
<style lang="scss" scoped>
.anu {
  margin-top: 2px;
  margin-bottom: 2px;
}

.anu:hover {
  background-color: #87e9df;
}
</style>
