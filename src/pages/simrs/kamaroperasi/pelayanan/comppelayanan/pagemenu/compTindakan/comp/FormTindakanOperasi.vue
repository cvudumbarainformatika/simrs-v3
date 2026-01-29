<template>
  <div class="bg-white full-height column">
    <div class="col-auto bg-primary text-white">
      <div class="q-pa-sm">
        Form Persiapan Operasi
      </div>
    </div>
    <div class="col full-height relative-position">
      <div class="row items-center q-my-xs">
        <div class="col-4">Tanggal </div>
        <div class="col-8">
          <app-input-date :model="store.formTindakan.tanggal" outlined label="" clearable
            @set-model="setForm('tanggal', $event)" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Tindakan </div>
        <div class="col-8">
          <q-select ref="refTindakan" v-model="tindakan" outlined dense use-input hide-selected fill-input
            input-debounce="800" :rules="[selectValid]" :options="options" @filter="filterFn"
            placeholder="Ketik untuk mencari" option-label="nama" option-value="kode" autocomplete="nama" autofocus
            class="full-width" hide-bottom-space hide-dropdown-icon no-error-icon @update:model-value="tarifSelected">
            <template #prepend>
              <q-icon name="icon-mat-search" />
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps" class="row items-end justify-between">
                <div v-if="scope.opt.nama">
                  {{ scope.opt.nama }}
                </div>
                <div>
                  {{ formatDouble(penentuanTarif(scope.opt)?.tarif) }}
                </div>
              </q-item>
              <q-separator />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4"></div>
        <div class="col-4">
          <q-checkbox v-model="store.formTindakan.tanpaAnas" left-label label="Tanpa Anastesi"
            @update:model-value="setTanpaAnas('tanpaAnas', $event)" />
        </div>
        <div class="col-4">
          <q-checkbox v-model="store.formTindakan.cito" left-label label="Cito"
            @update:model-value="setCito('cito', $event)" />
        </div>

      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Split Sistem bayar</div>
        <div class="col-8">
          <app-autocomplete v-model="store.formTindakan.sisbaysplit" :source="app?.sistemBayars" autocomplete="nama"
            option-label="nama" option-value="kode" outlined valid label=""
            @update:model-value="setForm('sisbaysplit', $event)" />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Biaya Split</div>
        <div class="col-8">
          <app-input v-model="store.formTindakan.total_split" :key="store.formTindakan.total_split" valid label=""
            outlined @update:model-value="setForm('total_split', Number($event))" autofocus />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Tarif </div>
        <div class="col-8">{{ formatDouble(store.formTindakan.tarif) }}</div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Subtotal </div>
        <div class="col-8">{{ formatDouble(store.formTindakan.subtotal) }}</div>
      </div>
      <div class="row q-ma-sm q-mb-xl q-mr-xl justify-end absolute-bottom">
        <app-btn label="Simpan" :loading="store.loading" :disable="store.loading || pasien?.tindakanop?.laporanoperasi"
          @click="simpan()" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { date, Dialog } from 'quasar'
import { formatDouble } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'
import { useAplikasiStore } from 'src/stores/app/aplikasi'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { onMounted, ref } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const store = useLaporanOperasiStore()
const app = useAplikasiStore()
const options = ref([])
const tindakan = ref(null)

function setForm (key, val) {
  console.log('st form', key, val)

  store.setFormTindakan(key, val)
}
function setTanpaAnas (key, val) {
  store.setFormTindakan(key, val)
  tarifSelected(tindakan.value)
  // if (val) store.setFormTindakan('subtotal', store.formTindakan.tarif)
  // else store.setFormTindakan('subtotal', store.formTindakan.tarif - store.formTindakan.anastesi)
}
function penentuanMarkUp () {
  const ruang = props.pasien.rs10
  const ruangRanap = props.pasien.ruangranap
  if (ruang == 'POL014') return 20
  else if (ruang?.includes('POL') && ruang != 'POL014') return 20
  else {
    if (['2', '3', 'HCU'].includes(ruangRanap?.rs3)) return 20
    else return 25
  }

}
function setCito (key, val) {
  store.setFormTindakan(key, val)
  tarifSelected(tindakan.value)
  // if (val) store.setFormTindakan('subtotal', store.formTindakan.tarif)
  // else store.setFormTindakan('subtotal', store.formTindakan.tarif)
}
function selectValid (val) {
  return (val !== null && val !== '') || ''
}
function penentuanTarif (val) {
  const ruang = props.pasien.rs10
  const ruangRanap = props.pasien.ruangranap
  if (ruang == 'POL014') return { tarif: val?.tarif3, js: val?.js3, jp: val?.jp3, an: val?.an3 }
  else if (ruang?.includes('POL') && ruang != 'POL014') return { tarif: val?.tarif_poli, js: val?.js_poli, jp: val?.jp_poli, an: 0 }
  else {
    if (ruangRanap?.rs3 == 'PS') return { tarif: val?.tarif_presiden, js: val?.ssp, jp: val?.psp, an: val?.asp }
    else if (['2', '3'].includes(ruangRanap?.rs3)) return { tarif: val?.tarif3, js: val?.js3, jp: val?.jp3, an: val?.an3 }
    else return { tarif: val?.tarif1, js: val?.js1, jp: val?.jp1, an: val?.an1 }
  }

}
function tarifSelected (val) {
  const tarifB = val ? penentuanTarif(val) : { tarif: 0, js: 0, jp: 0, an: 0 }
  const up = store?.formTindakan?.cito ? penentuanMarkUp() : 0
  // console.log('tarif selected', val, tarif)
  const markUp = up / 100
  const tarif = (markUp * tarifB.tarif) + tarifB.tarif
  const anasDisplay = (markUp * tarifB.an) + tarifB.an
  const anas = store.formTindakan.tanpaAnas ? 0 : (markUp * tarifB.an) + tarifB.an

  const js = (markUp * tarifB.js) + tarifB.js
  const jp = (markUp * tarifB.jp) + tarifB.jp
  store.setFormTindakan('kode', val?.kode)
  store.setFormTindakan('tarif', tarif)
  store.setFormTindakan('an', anas)
  store.setFormTindakan('js', js)
  store.setFormTindakan('jp', jp)
  if (store.formTindakan.tanpaAnas) store.setFormTindakan('subtotal', tarif - anasDisplay)
  else store.setFormTindakan('subtotal', tarif)

}
async function filterFn (val, update, abort) {
  console.log('filter', val)

  if (val?.length < 1) {
    abort()
    return
  }

  const resp = await store.getTarifOp(val)
  console.log('resp', resp)
  const data = resp.data ?? []

  update(() => {
    // const needle = val?.toLowerCase()
    // options.value = data?.length ? data?.filter(v => v?.namaobat.toLowerCase().indexOf(needle) > -1) : []
    options.value = data
  })
}
const refTindakan = ref(null)
function validate () {
  console.log('ref', refTindakan.value?.validate())
  if (refTindakan.value?.validate()) return true
  else {
    notifErrVue('Tindakan belum dipilih')
    return false
  }

}
function simpan () {
  console.log('form', store.formTindakan)
  if (validate()) store.simpanFormTindakan()
}
onMounted(() => {
  store.resetFormTindakan()
  // store.setFormTindakan('tanggal', date.formatDate(Date.now(), 'YYYY-MM-DD'))
  // store.setFormTindakan('noreg', props?.pasien?.noreg)
  // store.setFormTindakan('nota', props?.pasien?.rs2)
})
</script>
