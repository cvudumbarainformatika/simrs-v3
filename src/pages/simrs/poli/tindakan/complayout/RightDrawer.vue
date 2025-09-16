<template>
  <div class="column full-height">
    <div v-if="!noHeader" class="col-auto">
      <q-bar>
        <q-btn flat rounded padding="xs" size="xs" icon="icon-mat-close" @click="emits('close')" />
        <q-space />
        <div>History Pasien</div>
      </q-bar>
    </div>
    <div class="col full-height">
      <div class="col-auto bg-red">
        <q-tabs v-model="store.tab" no-caps inline-label class="bg-primary text-white shadow-2" align="left" dense
          active-color="yellow" active-bg-color="dark">
          <q-tab v-for="(item, i) in store.tabs" :key="i" :name="item" :label="item" />
        </q-tabs>
      </div>
      <div v-if="store.loading" class="col full-height" style="overflow: hidden;">
        <app-loading />
      </div>
      <div v-if="!store.loading" class="col full-height" style="overflow: hidden;">
        <q-tab-panels v-model="store.tab" animated class="full-height">
          <q-tab-panel name="Rawat Jalan" class="full-height q-pa-none">
            <RawatJalan :pasien="pasien" :no-header="noHeader" />
          </q-tab-panel>
          <q-tab-panel name="Rawat Inap" class="full-height q-pa-none">
            <RawatInap :pasien="pasien" :no-header="noHeader" />
          </q-tab-panel>
          <q-tab-panel name="IGD" class="full-height q-pa-none">
            <IgdPage :pasien="pasien" :no-header="noHeader" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>

import { dateFullFormat, formatJam, humanDate } from 'src/modules/formatter'
import { useHistoryPasien } from 'src/stores/simrs/pelayanan/poli/historypasien'
import { onMounted, computed } from 'vue'
import { pathImg } from 'src/boot/axios'

import { defineAsyncComponent } from 'vue'

const KonsulPoli = defineAsyncComponent(() => import('./compRight/KonsulPoli.vue'))
const RawatJalan = defineAsyncComponent(() => import('./compRight/RawatJalan.vue'))
const RawatInap = defineAsyncComponent(() => import('./compRight/RawatInap.vue'))
const IgdPage = defineAsyncComponent(() => import('./compRight/IgdPage.vue'))

// const PraAnestesi = defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/AsesmenPraAnestesia.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  noHeader: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'hapus', 'edit', 'preview'])

const tanggal = (val) => {
  return dateFullFormat(val) + ' ~ ' + formatJam(val)
}

const store = useHistoryPasien()
onMounted(() => {
  store.metaEresep = null
  store.getData(props.pasien)
})

const filteredItems = computed(() => {
  let tabs = 'Poli'
  if (store.tab === 'Rawat Jalan') {
    tabs = 'Poli'
  }
  else if (store.tab === 'Rawat Inap') {
    tabs = 'Ruang'
  }
  else {
    tabs = 'IRD'
  }
  return store.items.filter(item => item.ruangan?.includes(tabs))
})

function nadi(val) {
  const bradikardi = val < 60
  const normal = val >= 61 && val <= 100
  const takikardi = val > 100

  let obj = {
    color: 'teal',
    res: 'Normal'
  }
  if (bradikardi) {
    obj = { color: 'red', res: 'Brakikardi' }
  }
  else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  }
  else if (takikardi) {
    obj = { color: 'red', res: 'Takikardi' }
  }

  return obj
}

function suhu(val) {
  const hipotermia = val < 35
  const normal = val >= 35 && val < 37
  const pireksia = val >= 37 && val <= 41.1
  const hipertermia = val > 41.1

  let obj = {
    color: 'teal',
    res: 'normal'
  }
  if (hipotermia) {
    obj = { color: 'red', res: 'Hipotermia' }
  }
  else if (normal) {
    obj = { color: 'teal', res: 'Normal' }
  }
  else if (pireksia) {
    obj = { color: 'red', res: 'Pireksia/febris' }
  }
  else if (hipertermia) {
    obj = { color: 'red', res: 'Hipertermia' }
  }

  return obj
}

function getKesadaran(val) {
  const temp = store.optionsTingkatkesadaran.filter(a => a.value === val)
  if (temp?.length) {
    return temp[0].label
  }
  else {
    return '-'
  }
}
// eslint-disable-next-line no-unused-vars
function tekananDarah(val) {
  const normal = val >= 100 && val <= 120
  const prahipertensi = val >= 121 && val <= 139
  const hipertensiderajat1 = val >= 140 && val <= 159
  const hipertensiderajat2 = val >= 160

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  }
  else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  }
  else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  }
  else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  }
  else {
    obj = { color: 'text-red', res: 'Not Valid' }
  }

  return obj
}

function tekananDarahDias(val) {
  const normal = val >= 60 && val <= 79
  const prahipertensi = val >= 80 && val <= 89
  const hipertensiderajat1 = val >= 90 && val <= 99
  const hipertensiderajat2 = val >= 100

  let obj = {
    color: 'text-teal',
    res: 'normal'
  }
  if (normal) {
    obj = { color: 'text-teal', res: 'Normal' }
  }
  else if (prahipertensi) {
    obj = { color: 'text-red', res: 'Prahipertensi' }
  }
  else if (hipertensiderajat1) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 1' }
  }
  else if (hipertensiderajat2) {
    obj = { color: 'text-red', res: 'Hipertensi Derajat 2' }
  }
  else {
    obj = { color: 'text-red', res: 'LOW' }
  }

  return obj
}

function getInteger(str) {
  const parts = str.split('.')

  if (parts?.length > 1 && parseInt(parts[1]) === 0) {
    return parts[0]
  }

  return str
}

function groupingRacikan(val, resep) {
  const namaRacikan = [... new Set(val.map(a => a.namaracikan))]
  const rincianrac = resep?.rincianracik ?? []
  const list = []
  namaRacikan.forEach(a => {
    const rac = val.find(b => b.namaracikan === a)
    list.push({
      namaracikan: a,
      tiperacikan: rac?.tiperacikan,
      jumlahdibutuhkan: rac?.jumlahdibutuhkan,
      aturan: rac?.aturan,
      satuan_racik: rac?.satuan_racik,
      keterangan: rac?.keterangan,
      rincian: val.filter(b => b.namaracikan === a),
      rincianracik: rincianrac.filter(b => b.namaracikan === a)
    })
  })
  // console.log('groping', list, namaRacikan, val, resep)

  return list

}
function jumlahResep(item, list) {
  const obat = list?.rincianracik.find(b => b.kdobat === item?.kdobat)
  // console.log('obat', item, obat, list)
  const jumlah = obat?.jumlah ?? item?.jumlah
  return jumlah

}
// function arrayToString(val) {
//   const value = val.join(', ')
//   return value
// }
</script>

<style scoped>
.image-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image-container {
  flex-basis: calc(30% - 5px);
  /* Adjust this value to add spacing between images */
  margin: 10px;
  /* Adjust margin as needed */
}

.image {
  height: 300px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table,
th,
td {
  border: 1px solid grey;
}
</style>
