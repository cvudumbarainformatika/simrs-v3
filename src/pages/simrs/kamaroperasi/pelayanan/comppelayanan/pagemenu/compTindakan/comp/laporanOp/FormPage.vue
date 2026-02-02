<template>
  <div class="bg-white full-height column scroll q-mb-xl">
    <div class="col-auto bg-primary text-white">
      <div class="q-pa-sm">
        Form Laporan Operasi
      </div>
    </div>
    <div v-if="!pasien?.tindakanop" class="col full-height relative-position"><app-maintenance
        text="Belum ada Input Tondakan Operasi Belum bisa dibuatkan laporan" /> </div>
    <div v-else class="col full-height relative-position">
      <div class="row items-center q-my-xs">
        <div class="col-4">Tanggal </div>
        <div class="col-8">
          <app-input-date :model="store.form.tanggal" outlined label="" clearable
            @set-model="setForm('tanggal', $event)" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Tindakan Operasi</div>
        <div class="col-8">
          {{ pasien?.tindakanop?.mastertindakanoperasi?.rs2 }}
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Jenis Anastesi</div>
        <div class="col-8">
          <app-autocomplete v-model="store.form.rs4" :source="store.optionJenisAnastesis" outlined label="" />
        </div>
      </div>

      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Diagnosa Pre-Operatif</div>
        <div class="col-8">
          <q-input v-model="store.form.rs5" outlined label="" autogrow type="textarea" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Diagnosa Post-Operatif</div>
        <div class="col-8">
          <q-input v-model="store.form.rs6" outlined label="" autogrow type="textarea" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Jenis Operasi</div>
        <div class="col-8">
          <q-input v-model="store.form.rs7" outlined
            :label="'Jumlah karakter : ' + (store.form?.rs7?.length ?? 0) + ' (Maksimal 255 Karakter)'" dense :rules="[
              val => val.length <= 255 || 'masimal 255 karakter'
            ]" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Klasifikasi Operasi</div>
        <div class="col-8">
          <app-autocomplete v-model="store.form.rs8" :source="store.optionKlasifikasiOperasis" outlined label="" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Dikirim Untuk Pemeriksaan PA</div>
        <div class="col-8">
          <app-autocomplete v-model="store.form.rs9" :source="store.optionYT" outlined label="" />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Tanggal Operasi</div>
        <div class="col-8">
          <app-input-date :model="store.form.rs10" outlined label="" clearable @set-model="setForm('rs10', $event)" />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Jam Mulai</div>
        <div class="col-8">
          <app-input-date :model="store.form.rs11" :typeDate="false" outlined label="" clearable
            @set-model="setForm('rs11', $event + date.formatDate(new Date(), ':ss'))" />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">Jam Selesai</div>
        <div class="col-8">
          <app-input-date :model="store.form.rs12" :typeDate="false" outlined label="" clearable
            @set-model="setForm('rs12', $event + date.formatDate(new Date(), ':ss'))" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Catatan Komplikasi</div>
        <div class="col-8">
          <q-input v-model="store.form.rs13" outlined label="" autogrow type="textarea" />
        </div>
      </div>
      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">Laporan Operasi</div>
        <div class="col-8">
          <q-input v-model="store.form.rs14" outlined label="" autogrow type="textarea" />
        </div>
      </div>

      <div class="row items-center q-my-xs no-wrap">
        <div class="col-4">ASA</div>
        <div class="col-8">
          <app-autocomplete v-model="store.form.asa" :source="store.optionAsa" outlined label="" />
        </div>
      </div>
      <div class="row items-center q-my-xs">
        <div class="col-4">T-Time</div>
        <div class="col-4">
          <q-checkbox v-model="store.form.tTime" left-label label=""
            @update:model-value="store.setForm('tTime', $event)" />
        </div>

      </div>
      <div class="row q-ma-sm q-pb-xl q-mr-xl justify-end">
        <app-btn label="Simpan" :loading="store.loading" :disable="store.loading || !pasien?.tindakanop"
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

  store.setForm(key, val)
}
function setTanpaAnas (key, val) {
  store.setFormTindakan(key, val)
  tarifSelected(tindakan.value)
  // if (val) store.setFormTindakan('subtotal', store.form.tarif)
  // else store.setFormTindakan('subtotal', store.form.tarif - store.form.anastesi)
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
  // if (val) store.setFormTindakan('subtotal', store.form.tarif)
  // else store.setFormTindakan('subtotal', store.form.tarif)
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
  const up = store?.form?.cito ? penentuanMarkUp() : 0
  // console.log('tarif selected', val, tarif)
  const markUp = up / 100
  const tarif = (markUp * tarifB.tarif) + tarifB.tarif
  const anasDisplay = (markUp * tarifB.an) + tarifB.an
  const anas = store.form.tanpaAnas ? 0 : (markUp * tarifB.an) + tarifB.an

  const js = (markUp * tarifB.js) + tarifB.js
  const jp = (markUp * tarifB.jp) + tarifB.jp
  store.setFormTindakan('kode', val?.kode)
  store.setFormTindakan('tarif', tarif)
  store.setFormTindakan('an', anas)
  store.setFormTindakan('js', js)
  store.setFormTindakan('jp', jp)
  if (store.form.tanpaAnas) store.setFormTindakan('subtotal', tarif - anasDisplay)
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
  console.log('form', store.form)
  // if (validate()) store.simpanLaporan()
}
onMounted(() => {
  store.resetForm()
  // store.setFormTindakan('tanggal', date.formatDate(Date.now(), 'YYYY-MM-DD'))
  // store.setFormTindakan('noreg', props?.pasien?.noreg)
  // store.setFormTindakan('nota', props?.pasien?.rs2)
})
</script>
<style lang="scss" scoped>
.q-field__control-container .q-textarea {
  padding-top: 0px !important;
}

.q-textarea.q-field--labeled .q-field__control-container {
  padding-top: 0px !important;
}

.q-textarea.q-field--dense.q-field--labeled .q-field__control-container {
  padding-top: 2px !important;
}

.q-textarea .q-field__control-container {
  padding-top: 2px !important;
}
</style>
