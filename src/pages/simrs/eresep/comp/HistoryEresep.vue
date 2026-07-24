<template>
  <div class="column full-height full-width">
    <div class="col-auto bg-primary text-white">
      <div class="row q-pa-sm">
        {{ title }} ({{ pasien?.nama }})
      </div>
    </div>
    <div v-if="store?.historys?.length && !store?.loadingHistory" class="col full-height bg-grey-3 scroll">
      <!-- <q-infinite-scroll
        :offset="250"
        @load="onLoad"
      > -->
      <!-- <q-list
          bordered
          separator
          class="bg-grey-3"
        > -->
      <div v-for="(items, index) in store?.historys" :key="index">
        <q-card
          v-if="items?.permintaanresep?.length && (items?.flag === '3' || items?.flag === '4') || items?.rincianracik?.length && (items?.flag === '3' || items?.flag === '4')"
          class="q-mb-lg q-pa-md">
          <!-- <q-item
            v-for="(item, index) in store.historys"
            :key="index"
            class="q-mb-md"
          > -->
          <div>
            <div>
              <q-item-label class="text-primary">
                <b>Riwayat Obat Tanggal : <em>{{ humanDate(items?.tgl) }}</em></b>
              </q-item-label>
              <q-item-label class="q-mb-sm text-orange">
                <div v-if="items?.dokter?.nama?.length">
                  <span>Petugas : <em>{{ items?.dokter?.nama }}</em></span>
                </div>
                <div v-else>
                  <span>Petugas : <em>-</em></span>
                </div>
              </q-item-label>
            </div>
            <div class="q-pa-sm">
              <div v-if="items?.permintaanresep?.length && (items?.flag === '3' || items?.flag === '4')"
                class="q-mt-sm q-mb-xl">
                <div class="row items-center q-mb-sm">
                  <div class="col">
                    <div class="text-weight-bold" v-if="items?.poli">
                      Non Racikan | {{ items?.tiperesep }} | {{ items?.noresep }} ({{ items?.poli?.rs2 }}) | {{
                        items?.sistembayar?.rs2 }}
                    </div>
                    <div class="text-weight-bold" v-else>
                      Non Racikan | {{ items?.tiperesep }} | {{ items?.noresep }} ({{ items?.ruanganranap?.rs2 }}) | {{
                        items?.sistembayar?.rs2 }}
                    </div>
                  </div>
                  <div class="col-auto" v-if="depo[0]?.value === items?.depo && depo[0]?.value !== 'Gd-04010103'">
                    <q-btn rounded push label="Duplicate resep" class="f-12 q-mr-sm" color="green" text-color="white"
                      icon="icon-mat-copy_all" :disable="store.loading || store.loadingkirim" :loading="store.loading"
                      @click="copyResep(store?.historys[index], index, 'nonRacik')">
                      <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                        Duplicate resep
                      </q-tooltip>
                    </q-btn>
                    <q-btn rounded push label="Edit & Duplicate" class="f-12 q-mr-sm" color="indigo" text-color="white"
                      icon="icon-mat-edit_note" :disable="store.loading || store.loadingkirim" :loading="store.loading"
                      @click="openEditDuplicate(store?.historys[index], index, 'nonRacik')">
                      <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                        Edit jumlah & aturan pakai sebelum diduplikasi
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <q-list separator bordered>
                  <q-item v-for="(rinc, j) in items?.permintaanresep" :key="j">
                    <q-item-section style="width: 40%;">
                      <div class="row">
                        <div class="col-1">
                          {{ j + 1 }}
                        </div>
                        <div class="col-11">
                          <div class="row text-weight-bold">
                            {{ rinc?.mobat?.nama_obat }}
                          </div>
                          <div class="row text-italic f-10">
                            {{ rinc?.kdobat }}
                          </div>
                          <div class="row text-weight-bold f-10">
                            ( {{ rinc?.mobat?.satuan_k }} )
                          </div>
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section side style="width:40%">
                      <div class="row items-center full-width">
                        <div class="col-12">
                          <div class="row">
                            <div class="col-6">
                              Aturan :
                            </div>
                            <div class="col-4">
                              {{ rinc?.aturan }}
                            </div>
                          </div>
                          <div class="row q-mt-sm">
                            <div class="col-6">
                              Jumlah Obat :
                            </div>
                            <div class="col-4">
                              {{ rinc?.jumlah }}
                            </div>
                          </div>
                          <div class="row q-mt-sm">
                            <div class="col-6">
                              Konsumsi :
                            </div>
                            <div class="col-4">
                              {{ rinc?.konsumsi }} hari
                            </div>
                          </div>
                          <div class="row q-mt-sm">
                            <div class="col-6">
                              Keterangan :
                            </div>
                            <div class="col-4">
                              {{ rinc?.keterangan }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section
                      v-if="items?.permintaanresep?.length > 5 && rinc?.mobat?.jenis_perbekalan === 'Obat'" side
                      style="width:8%">
                      <q-checkbox v-model="rinc.checked" :val="rinc" color="teal"
                        @update:model-value="checked($event, items?.permintaanresep, j)" />
                    </q-item-section>
                    <q-item-section side style="width:20%">
                      <div v-if="store.statusCopied[`${index}-${rinc?.kdobat}`] === true"
                        class="row col-6 items-center text-green">
                        Duplicate resep berhasil!
                      </div>
                      <div
                        v-else-if="store.statusCopied[`${index}-${rinc?.kdobat}`] === false && store.pemberianObatCek[`${index}-${rinc?.kdobat}`] !== null"
                        class="row col-6 items-center text-red">
                        <q-btn label="Konfirmasi pemberian obat" class="f-10 q-mr-sm" color="yellow" text-color="black"
                          @click="store.openDialogDuplicateResep(store.pemberianObatCek[`${index}-${rinc?.kdobat}`], store.permintaanResepDuplicate[`${index}-${rinc?.kdobat}`], 'nonRacik', `${index}-${rinc?.kdobat}`)">
                          <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                            Konfirmasi pemberian obat
                          </q-tooltip>
                        </q-btn>
                      </div>
                      <div v-else-if="store.statusCopied[`${index}-${rinc?.kdobat}`] === false"
                        class="row col-6 items-center text-red">
                        Duplicate resep gagal! ({{ store.messageCopied[`${index}-${rinc?.kdobat}`] }})
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div v-if="items?.rincianracik?.length && (items?.flag === '3' || items?.flag === '4')" class="q-mt-sm">
                <div class="row items-center">
                  <div class="col">
                    <div class="text-weight-bold" v-if="items?.poli">
                      Racikan | {{ items?.tiperesep }} | {{ items?.noresep }} ({{ items?.poli?.rs2 }}) | {{
                        items?.sistembayar?.rs2 }}
                    </div>
                    <div class="text-weight-bold" v-else>
                      Racikan | {{ items?.tiperesep }} | {{ items?.noresep }} ({{ items?.ruanganranap?.rs2 }}) | {{
                        items?.sistembayar?.rs2 }}
                    </div>
                  </div>
                  <div class="col-auto" v-if="depo[0]?.value === items?.depo && depo[0]?.value !== 'Gd-04010103'">
                    <q-btn rounded push label="Duplicate resep" class="f-12 q-mr-sm" color="green" text-color="white"
                      icon="icon-mat-copy_all" :disable="store.loading || store.loadingkirim" :loading="store.loading"
                      @click="copyResep(store?.historys[index], index, 'racik')">
                      <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                        Duplicate resep
                      </q-tooltip>
                    </q-btn>
                    <q-btn rounded push label="Edit & Duplicate" class="f-12 q-mr-sm" color="indigo" text-color="white"
                      icon="icon-mat-edit_note" :disable="store.loading || store.loadingkirim" :loading="store.loading"
                      @click="openEditDuplicate(store?.historys[index], index, 'racik')">
                      <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                        Edit jumlah & aturan pakai sebelum diduplikasi
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div v-for="(item, i) in items?.permintaanracikan" :key="i">
                  <div v-if="i === 0">
                    <div class="row items-center">
                      <div class="col-shrink q-mr-xs">
                        {{ item?.namaracikan }}
                      </div>
                      <div class="col-shrink q-mr-xs">
                        <q-chip square class="f-10" color="primary" text-color="white" outline>
                          {{ item?.tiperacikan }}
                        </q-chip>
                      </div>
                      <div class="col-shrink q-mr-xs text-purple text-weight-bold">
                        Jumlah {{ item?.jumlahdibutuhkan }}
                      </div>
                      <div class="col-shrink q-mr-xs">
                        ({{ item?.satuan_racik }})
                      </div>
                      <div class="col-shrink q-mr-xs text-italic">
                        {{ item?.aturan }}
                      </div>

                      <div class="col-shrink q-mr-xs">
                        | Keterangan : {{ item?.keterangan }}
                      </div>
                    </div>
                  </div>
                </div>
                <q-list separator bordered>
                  <q-item v-for="(rinc, i) in items?.rincianracik" :key="i">
                    <q-item-section style="width: 40%;">
                      <div class="row text-weight-bold">
                        {{ rinc?.mobat?.nama_obat }}
                      </div>
                      <div class="row text-italic f-10">
                        {{ rinc?.kdobat }}
                      </div>
                      <div class="row text-weight-bold f-10">
                        ( {{ rinc?.mobat?.satuan_k }} )
                      </div>
                    </q-item-section>
                    <q-item-section side style="width:40%">
                      <div class="row full-width">
                        <div class="col-12">
                          <div v-if="rinc?.tiperacikan === 'DTD'" class="row">
                            <div class="col-6">
                              Dosis Resep : {{ `${index}-${i}` }}
                            </div>
                            <div class="col-4">
                              {{ items?.permintaanracikan[i]?.dosismaksimum }}
                            </div>
                          </div>
                          <div v-if="rinc?.tiperacikan === 'DTD'" class="row q-mt-sm">
                            <div class="col-6">
                              Dosis Obat :
                            </div>
                            <div class="col-4">
                              {{ items?.permintaanracikan[i]?.mobat?.kekuatan_dosis }}
                            </div>
                          </div>

                          <div class="row q-mt-sm">
                            <div class="col-6">
                              Jumlah Resep :
                            </div>
                            <div class="col-4">
                              {{ items?.permintaanracikan[i]?.jumlah }}
                            </div>
                          </div>
                          <div class="row q-mt-sm">
                            <div class="col-6">
                              Keterangan :
                            </div>
                            <div class="col-4">
                              {{ items?.permintaanracikan[i]?.keteranganx }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section side style="width:20%">
                      <div v-if="store.statusCopiedRacik[`${index}-${rinc?.kdobat}`] === true"
                        class="row col-6 items-center text-green">
                        Duplicate resep berhasil!
                      </div>
                      <div
                        v-else-if="store.statusCopiedRacik[`${index}-${i}`] === false && store.pemberianObatCek[`${index}-${i}`] !== null"
                        class="row col-6 items-center text-red">
                        <q-btn label="Konfirmasi pemberian obat" class="f-10 q-mr-sm" color="yellow" text-color="black"
                          @click="store.openDialogDuplicateResep(store.pemberianObatCek[`${index}-${i}`], store.permintaanResepDuplicate[`${index}-${i}`], 'racik', `${index}-${i}`)">
                          <q-tooltip class="primary" :offset="[10, 10]" anchor="top right" self="top left">
                            Konfirmasi pemberian obat
                          </q-tooltip>
                        </q-btn>
                      </div>
                      <div v-else-if="store.statusCopiedRacik[`${index}-${i}`] === false"
                        class="row col-6 items-center text-red">
                        Duplicate resep gagal! ({{ store.messageCopied[`${index}-${i}`] }})
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            <!-- <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template> -->
            <!-- </q-item> -->
            <!-- </q-list> -->
          </div>
        </q-card>
      </div>
      <!-- </q-infinite-scroll> -->
    </div>
    <div v-else class="col full-height">
      <div v-if="store.loadingHistory" class="column full-height flex-center">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
        Harap Menunggu ..... Sinkron Data
      </div>
      <div v-else class="column full-height flex-center">
        MAAF ... DATA HISTORY RESEP BELUM ADA
      </div>
    </div>
  </div>

  <q-dialog v-model="dialogEditVisible" backdrop-filter="blur(4px) saturate(150%)" persistent>
    <q-card style="width: 700px; max-width: 90vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-indigo text-weight-bold">Edit Sebelum Duplicate</div>
        <q-space />
        <q-btn icon="icon-mat-close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-md" style="max-height: 60vh; overflow-y: auto;">
        <q-list separator bordered>
          <q-item v-for="(item, idx) in editItems" :key="idx" class="q-py-md">
            <q-item-section>
              <div class="row q-col-gutter-sm items-center">
                <!-- Info Obat -->
                <div class="col-12">
                  <div class="text-weight-bold text-indigo">{{ item.nama_obat }}</div>
                  <div class="text-caption text-grey-7">{{ item.kodeobat }} ({{ item.satuan }})</div>
                </div>

                <!-- Input Jumlah -->
                <div class="col-4" v-if="item.jenisresep === 'nonRacikan'">
                  <q-input v-model.number="item.jumlah_diminta" type="number" label="Jumlah" outlined dense />
                </div>
                <div class="col-4" v-else>
                  <q-input v-model.number="item.jumlah" type="number" label="Jumlah Kandungan" outlined dense />
                </div>

                <!-- Input Aturan -->
                <div class="col-8">
                  <q-input v-model="item.aturan" label="Aturan Pakai" outlined dense />
                </div>

                <!-- Input Keterangan & Jml Racikan -->
                <div class="col-4" v-if="item.jenisresep === 'Racikan'">
                  <q-input v-model.number="item.jumlahdibutuhkan" type="number" label="Jml Racikan" outlined dense />
                </div>
                <div :class="item.jenisresep === 'Racikan' ? 'col-8' : 'col-12'">
                  <q-input v-model="item.keterangan" label="Keterangan" outlined dense />
                </div>

                <!-- Tampilkan pesan error jika ada -->
                <div v-if="item.error" class="col-12 text-negative text-caption q-mt-xs">
                  {{ item.error }}
                </div>
              </div>
            </q-item-section>

            <!-- Hapus Item -->
            <q-item-section side>
              <q-btn round flat color="negative" icon="icon-mat-delete" @click="removeEditItem(idx)">
                <q-tooltip>Hapus obat dari resep ini</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-grey-2">
        <q-btn flat label="Batal" color="dark" v-close-popup />
        <q-btn label="Simpan & Kirim" color="indigo" :loading="store.loading" @click="submitEditDuplicate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { onMounted, ref, computed, watchEffect } from 'vue'
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'
// eslint-disable-next-line no-unused-vars
import { humanDate } from 'src/modules/formatter'
// import { pathImg } from 'src/boot/axios'
// import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { notifErrVue } from 'src/modules/utils'

// eslint-disable-next-line no-unused-vars
const cekobats = ref([])
// const apps = useAplikasiStore()
const store = usePermintaanEResepStore()
// const checkobat = ref(false)
const props = defineProps({
  pasien: {
    type: Object,
    default: () => { }
  },
  depo: { type: String, default: '' },
  obat: {
    type: Object,
    default: () => { }
  },
  title: {
    type: String,
    default: 'History'
  }
})

const depo = store?.depos.filter(pa => pa.jenis === props?.depo)
// const signa = ref('')
// eslint-disable-next-line no-unused-vars
const emits = defineEmits(['clickBtn'])
// const tinggiDetailPas = ref(160)

// eslint-disable-next-line no-unused-vars
function pilihData (row) {
  // console.log(row)
  store.pilihHistory(row)
}

// eslint-disable-next-line no-unused-vars
function copyResep (val, indexlist, tipe) {
  store.loading = true
  const permintaan = val?.permintaanresep

  const permintaanracik = val?.permintaanracikan

  if (tipe === 'nonRacik') {
    console.log('VAVAL', val)
    store.cekObatBaru(val, permintaan, indexlist, tipe, '2')
  }
  else {
    store.cekObatBaru(val, permintaanracik, indexlist, tipe, '2')
  }
}

const dialogEditVisible = ref(false)
const editItems = ref([])
const editSourceRecipe = ref(null)
const editIndexList = ref(-1)
const editTipe = ref('')

function openEditDuplicate (val, indexlist, tipe) {
  editSourceRecipe.value = val
  editIndexList.value = indexlist
  editTipe.value = tipe

  if (tipe === 'nonRacik') {
    editItems.value = val.permintaanresep.map(res => ({
      kodeobat: res.kdobat,
      nama_obat: res.mobat?.nama_obat || '',
      satuan: res.mobat?.satuan_k || '',
      jumlah_diminta: res.jumlah,
      aturan: res.aturan,
      keterangan: res.keterangan || '',
      konsumsi: res.konsumsi || 0,
      jenisresep: 'nonRacikan',
      forkit: res.forkit,
      fornas: res.fornas,
      generik: res.generik,
      kandungan: res.kandungan,
      kode50: res.kode50,
      kode108: res.kode108,
      stokalokasi: res.stokalokasi,
      uraian50: res.uraian50,
      uraian108: res.uraian108,
      noreg: store.form.noreg,
      norm: store.form.norm,
      groupsistembayar: store.form.groupsistembayar,
      sistembayar: store.form.sistembayar,
      dokter: store.form.dokter,
      diagnosa: store.form.diagnosa,
      kdruangan: store.form.kdruangan,
      tagihanrs: store.form.tagihanrs,
      tarifina: store.form.tarifina,
      uraianinacbg: store.form.uraianinacbg,
      kodeincbg: store.form.kodeincbg,
    }))
  } else {
    editItems.value = val.rincianracik.map((racikan, i) => {
      const parent = val.permintaanracikan.find(o => o.kdobat === racikan.kdobat) || val.permintaanracikan[i] || {}
      return {
        kodeobat: racikan.kdobat,
        nama_obat: racikan.mobat?.nama_obat || '',
        satuan: racikan.mobat?.satuan_k || '',
        jumlah: racikan.jumlah,
        aturan: parent.aturan,
        keterangan: parent.keterangan || '',
        konsumsi: parent.konsumsi || 0,
        jenisresep: 'Racikan',
        namaracikan: parent.namaracikan,
        tiperacikan: parent.tiperacikan,
        jumlahdibutuhkan: parent.jumlahdibutuhkan,
        dosismaksimum: parent.dosismaksimum,
        dosisobat: parent.dosisobat,
        satuan_racik: parent.satuan_racik,
        keteranganx: parent.keteranganx,
        forkit: parent.forkit,
        fornas: parent.fornas,
        generik: parent.generik,
        kandungan: parent.kandungan,
        kode50: parent.kode50,
        kode108: parent.kode108,
        stokalokasi: parent.stokalokasi,
        uraian50: parent.uraian50,
        uraian108: parent.uraian108,
        noreg: store.form.noreg,
        norm: store.form.norm,
        groupsistembayar: store.form.groupsistembayar,
        sistembayar: store.form.sistembayar,
        dokter: store.form.dokter,
        diagnosa: store.form.diagnosa,
        kdruangan: store.form.kdruangan,
        tagihanrs: store.form.tagihanrs,
        tarifina: store.form.tarifina,
        uraianinacbg: store.form.uraianinacbg,
        kodeincbg: store.form.kodeincbg,
      }
    })
  }

  dialogEditVisible.value = true
}

function removeEditItem (idx) {
  editItems.value.splice(idx, 1)
}

function submitEditDuplicate () {
  if (editItems.value.length === 0) {
    notifErrVue('Tidak ada obat dalam daftar resep.')
    return
  }

  store.loading = true
  const listObatMap = editItems.value.map(item => ({ kdobat: item.kodeobat }))

  store.cekObatBaru(editSourceRecipe.value, listObatMap, editIndexList.value, editTipe.value, '3', editItems.value)
    .then(() => {
      dialogEditVisible.value = false
    })
    .catch(() => {
    })
}

function checked (evt, val, index) {
  store.permintaanDuplicate = true
}

onMounted(() => {
  store.historys = null
  store.getHistory(props?.pasien?.norm)
})

watchEffect(() => {
  store.pasien = props?.pasien
  store.depo = props?.depo
  // setPasien()
  // console.log('pasi', props.pasien)
})

// function splitter(txt) {
//   if (txt !== '' || txt !== null || txt !== undefined) {
//     const arr = txt?.split('cursor=')
//     return arr[1]
//   }

//   return null
// }

// function onLoad(index, done) {
//   // if (!store.loadingHistory) {
//   console.log('index', index)
//   // console.log('split', splitter(store.historyMeta?.next_page_url))
//   setTimeout(() => {
//     store.getHistory(props?.pasien?.norm, index + 1)
//     done()
//   }, 1000)
//   // }
// }

</script>

<style lang="scss" scoped>
table {
  width: 100%;
  background-color: #fff;

  // padding: 2px;
  th {
    width: 35%;
    text-align: left;
  }

  td {
    width: 65%;
    text-align: left;
  }

  th,
  td {
    border: 1px solid gray;
    padding: 5px;
    border-collapse: collapse;
  }
}

th.th-center {
  text-align: center;
  align-content: center;
}

table.table2 {
  width: 100%;
  background-color: #fff;

  // padding: 2px;
  th {
    width: 25%;
    text-align: left;
  }

  td {
    width: 75%;
    text-align: left;
  }

  th,
  td {
    border: 1px solid gray;
    padding: 5px;
    border-collapse: collapse;
  }
}
</style>
