<template>
  <div style="width: 100%;">
    <app-table-extend
      :columns="store.columns"
      :column-hide="store.columnHide"
      :items="store.items"
      :meta="store.meta"
      :per-page="store.param.per_page"
      :loading="store.loading"
      :to-search="store.param.q"
      :click-able="true"
      :default-btn="false"
      :ada-tambah="false"
      :ada-filter="false"
      use-full
      row-no
      @find="store.setSearch"
      @goto="store.setPage"
      @set-row="store.setPerPage"
      @refresh="store.refreshTable"
    >
      <!-- @on-click="onClick" -->
      <template #col-obat>
        <div>Obat</div>
      </template>
      <template #col-nomor>
        <div>Nomor</div>
      </template>
      <template #col-penyedia>
        <div>Penyedia</div>
      </template>
      <template #col-tanggal>
        <div>Tanggal</div>
      </template>
      <template #col-jumlah>
        <div>Jumlah</div>
      </template>
      <template #col-harga>
        <div>Harga</div>
      </template>
      <template #col-nilai>
        <div>Nilai</div>
      </template>
      <template #cell-obat="{ row }">
        <div style="width: 150px;">
          <div
            class="row no-wrap items-center q-mb-xs"
            style="white-space: normal !important;"
          >
            <div class="box text-weight-bold">
              {{ row?.masterobat?.nama_obat }}
            </div>
          </div>
          <div
            class="row no-wrap q-col-gutter-sm items-center q-mb-xs"
            style="white-space: normal !important;"
          >
            <div class="text-italic f-10">
              {{ row?.masterobat?.kd_obat }}
            </div>
          </div>
        </div>
      </template>
      <template #cell-nomor="{ row }">
        <div style="width: 250px;">
          <div
            v-if="!!row.nopenerimaan"
            class="row no-wrap justify-between items-center q-mb-xs"
            style="white-space: normal;"
          >
            <div class="">
              Nomor Penerimaan
            </div>
            <div class="box text-right text-italic ">
              {{ row.nopenerimaan }}
            </div>
          </div>
          <div
            v-if="!!row.nobatch"
            class="row no-wrap justify-between items-center q-mb-xs"
            style="white-space: normal !important;"
          >
            <div class="">
              Nomor Batch
            </div>
            <div class="text-right text-italic ">
              {{ row.nobatch }}
            </div>
          </div>
        </div>
      </template>
      <template #cell-tanggal="{ row }">
        <div
          v-if="row.tgl_entry"
          class="row no-wrap justify-between items-center q-mb-xs"
          style="white-space: normal !important;"
        >
          <div class="q-mr-xs">
            Entry
          </div>
          <div class="text-weight-bold">
            {{ dateFullFormat(row.tgl_entry) }}
          </div>
        </div>
        <div
          v-if="row.tgl_retur"
          class="row no-wrap justify-between items-center q-mb-xs"
          style="white-space: normal !important;"
        >
          <div class="q-mr-xs">
            Retur
          </div>
          <div class="text-weight-bold">
            {{ dateFullFormat(row.tgl_retur) }}
          </div>
        </div>
        <div
          v-if="row.tgl_pemusnahan"
          class="row no-wrap justify-between items-center q-mb-xs"
          style="white-space: normal !important;"
        >
          <div class="q-mr-xs">
            Musnah
          </div>
          <div class="text-weight-bold">
            {{ dateFullFormat(row.tgl_pemusnahan) }}
          </div>
        </div>
        <div
          v-if="row.tgl_penghapusan"
          class="row no-wrap justify-between items-center q-mb-xs"
          style="white-space: normal !important;"
        >
          <div class="q-mr-xs">
            Hapus
          </div>
          <div class="text-weight-bold">
            {{ dateFullFormat(row.tgl_penghapusan) }}
          </div>
        </div>
      </template>
      <template #cell-penyedia="{ row }">
        <div style="width: 150px; overflow-wrap: normal;">
          {{ row?.pihakketiga?.nama ?? 'Penyedia Tidak Ditemukan' }}
        </div>
      </template>
      <template #cell-jumlah="{ row }">
        <div class="row q-my-sm justify-end items-end q-col-gutter-sm">
          {{ row?.jumlah }}
          <div class="text-italic f-10">
            ({{ row?.masterobat?.satuan_k }})
          </div>
        </div>
        <div class="row q-my-sm text-italic justify-end items-end q-col-gutter-sm">
          dimusnahkan : {{ row?.jumlah_dimusnahkan }}
          <div class=" f-10">
            ({{ row?.masterobat?.satuan_k }})
          </div>
        </div>
      </template>
      <template #cell-harga="{ row }">
        <div class="text-right">
          {{ formatRpDouble(row?.harga_net,2) }}
        </div>
      </template>
      <template #cell-nilai="{ row }">
        <div class="text-right">
          {{ formatRpDouble(parseFloat(row?.harga_net)*parseFloat(row?.jumlah),2) }}
        </div>
      </template>
      <template #left-acttion="{ row }">
        <div class="row no-wrap">
          <div
            v-if="!row.kunci"
            class="row items-center"
          >
            <q-btn
              flat
              icon="icon-mat-delete"
              dense
              size="sm"
              color="negative"
              :loading="row.loading"
              :disable="row.loading"
              @click="store.deleteHeader(row)"
            >
              <q-tooltip
                class="primary"
                :offset="[10, 10]"
              >
                Hapus
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="icon-mat-lock_open"
              dense
              color="green"
              :loading="row.loadingKunci"
              :disable="row.loadingKunci"
              @click="kunci(row)"
            >
              <q-tooltip
                class="primary"
                :offset="[10, 10]"
              >
                Kunci Retur dan Kurangi Stok
              </q-tooltip>
            </q-btn>
          </div>
          <div v-if="row.kunci">
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
                Retur sudah di kunci
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="!row.tgl_retur && !row?.tgl_penghapusan && !row?.tgl_pemusnahan"
              flat
              icon="icon-mat-edit"
              dense
              color="deep-orange"
              :loading="row?.loadingTrm"
              :disable="row?.loadingTrm"
              @click="()=>{
                openPenerimaan = true
                dataPenerimaan = row
                console.log('click', row);

              }"
            >
              <q-tooltip
                class="primary"
                :offset="[10, 10]"
              >
                Buka Form Edit Penerimaan
              </q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn
              v-if="!row.tgl_retur && !row?.tgl_penghapusan && !row?.tgl_pemusnahan"
              flat
              icon="icon-mat-edit"
              dense
              color="primary"
              :loading="row?.loading"
              :disable="row?.loading"
              @click="()=>{
                openPemusnahan = true
                dataPemusnahan = row
                console.log('click', row);

              }"
            >
              <q-tooltip
                class="primary"
                :offset="[10, 10]"
              >
                Buka Form Pemusnahan
              </q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn
              v-if="!row.tgl_retur && !row?.tgl_penghapusan && row?.tgl_pemusnahan"
              flat
              icon="icon-mat-edit"
              dense
              color="primary"
              :loading="row?.loading"
              :disable="row?.loading"
              @click="()=>{
                openPenghapusan = true
                dataPenghapusan = row
                console.log('click', row);

              }"
            >
              <q-tooltip
                class="primary"
                :offset="[10, 10]"
              >
                Buka Form Penghapusan
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
      <!-- <template #expand="{ row }">
        <div v-if="!row.rinci?.length">
          <app-no-data-small />
        </div>
        <div v-if="row.rinci?.length">
          <div class="row bg-dark text-white q-pa-xs q-mb-sm">
            <div
              class="col-auto"
              style="width:5%"
            >
              No
            </div>

            <div
              class="col-auto anak"
            >
              Nama Barang
            </div>
            <div
              class="col-auto anak"
            >
              Kondisi Barang
            </div>
            <div
              class="col-auto anak"
            >
              Nomor Penerimaan
            </div>
            <div
              class="col-auto anak"
            >
              Tanggal Kadalwarsa
            </div>

            <div
              class="col-auto anak text-right"
            >
              Jumlah Retur
            </div>
            <div
              class="col-auto anak text-right"
            >
              Nilai Retur
            </div>
            <div
              class="col-auto text-right"
              style="width:5%"
            >
              #
            </div>
          </div>
          <div
            v-for="(trm,n) in row.rinci"
            :key="n"
            class=" "
          >
            <div class="row items-center q-col-gutter-sm q-mb-sm">
              <div
                class="col-auto"
                style="width:5%"
              >
                {{ n+1 }}
              </div>

              <div
                class="col-auto anak"
              >
                <div class="namaobat">
                  {{ trm?.mobatnew?.nama_obat }}
                </div>
                <div class="text-italic f-10">
                  ({{ trm?.mobatnew?.satuan_k }})
                </div>
              </div>
              <div
                class="col-auto anak"
              >
                {{ trm?.kondisi_barang }}
              </div>
              <div
                class="col-auto anak"
              >
                {{ trm?.nopenerimaan }}
              </div>
              <div
                class="col-auto anak"
              >
                {{ dateFullFormat(trm?.tgl_exp) }}
              </div>

              <div
                class="col-auto anak text-right"
              >
                {{ trm?.jumlah_retur }}
              </div>
              <div
                class="col-auto anak text-right"
              >
                {{ formatRpDouble(trm?.subtotal,2) }}
              </div>
              <div
                class="col-auto text-right"
                style="width:5%"
              >
                <q-btn
                  v-if="!row.kunci"
                  flat
                  icon="icon-mat-delete"
                  dense
                  size="sm"
                  color="negative"
                  :loading=" trm.loading"
                  @click="store.deleteRinci(trm)"
                >
                  <q-tooltip
                    class="primary"
                    :offset="[10, 10]"
                  >
                    Hapus
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </template> -->
    </app-table-extend>
  </div>
  <pegePemusnahan
    v-model="openPemusnahan" :data="dataPemusnahan" @simpan="(val)=>{
      console.log('simpan', val);
      openPemusnahan=false
      store.simpanPemusnahan(dataPemusnahan,val)
    }"
  />
  <pegePenghapusan
    v-model="openPenghapusan" :data="dataPenghapusan" @simpan="(val)=>{
      console.log('simpan', val);
      openPenghapusan=false
      store.simpanPenghapusan(dataPenghapusan,val)
    }"
  />
  <pegePenerimaan
    v-model="openPenerimaan" :data="dataPenerimaan" @simpan="(val)=>{
      console.log('simpan pen', val);
      openPenerimaan=false
      store.simpanPenerimaan(dataPenerimaan,val)
    }"
  />
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import { dateFullFormat, formatRpDouble } from 'src/modules/formatter'
import { notifSuccessVue } from 'src/modules/utils'
import { useListBarangRusakStore } from 'src/stores/simrs/farmasi/barangrusak/list'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

const store = useListBarangRusakStore()
/**
 * section pemusnahan
 */
const pegePemusnahan = shallowRef(defineAsyncComponent(() => import('./MusnahPage.vue')))
const openPemusnahan = ref(false)
const dataPemusnahan = ref({})
/**
 * section pemusnahan End
 */
/**
 * section Penghapusan
 */
const pegePenghapusan = shallowRef(defineAsyncComponent(() => import('./HapusPage.vue')))
const openPenghapusan = ref(false)
const dataPenghapusan = ref({})
/**
 * section Penghapusan End
 */
/**
 * section Penerimaan
 */
const pegePenerimaan = shallowRef(defineAsyncComponent(() => import('./EditNomor.vue')))
const openPenerimaan = ref(false)
const dataPenerimaan = ref({})
/**
 * section Penerimaan End
 */
function kunci (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  store.kunci(val).then(() => {
    if (!val.kunci) val.kunci = '1'
  })
}
function info (val) {
  val.expand = !val.expand
  val.highlight = !val.highlight
  notifSuccessVue('Retur nomor ' + val.nopenerimaan + ' Sudah dikunci dan Stok sudah berkurang')
}
store.getInitialData()
</script>
<style scoped>
.namaobat{
  /* inline-size: 200px; */
  overflow-wrap: break-word;
}
.anak{
  white-space: normal !important;
  width:calc(90% / 6);
  overflow-wrap: break-word;
}
.box {
  white-space: normal !important;
    inline-size: 200px;
    overflow-wrap: break-word;
}
.box2 {
  white-space: normal !important;
    inline-size: 150px;
    overflow-wrap: break-word;
}
.terima{
  background-color: rgba(120, 231, 51, 0.549);
}
.anu:hover{
  background-color: rgba(166, 173, 144, 0.548);
}
.anudua:hover{
  background-color: rgb(54, 196, 231);
}
</style>
