<template>
  <q-form ref="formRef" @submit="simpan">
    <div class="row q-col-gutter-sm">
      <div class="col-3">
        <q-input v-model="store.formRsLain.norm" label="NORM (Automatis)" dense outlined standout="bg-yellow-3" readonly
          :rules="[val => !!val || 'Harus diisi']" hide-bottom-space />
      </div>
      <div class="col-3">
        <q-input v-model="store.formRsLain.noka" label="NOKA (Automatis)" dense outlined standout="bg-yellow-3"
          readonly />
      </div>
      <div class="col-6">
        <q-input v-model="store.formRsLain.nosep" label="SEP (Automatis)" dense outlined standout="bg-yellow-3"
          readonly />
      </div>
      <div class="col-3">
        <q-select v-model="store.formRsLain.jenispelayanan" label="Jenis Pelayanan" dense outlined
          standout="bg-yellow-3" use-input input-debounce="0" :options="optionsJnsKunjungan" map-options emit-value
          :rules="[val => !!val || 'Harus diisi']" hide-bottom-space />
      </div>
      <div class="col-3">
        <app-input-date :model="store.formRsLain.tglrujukan" label="Tgl Rujukan" outlined
          @set-model="(val) => store.setFormRsLain('tglrujukan', val)" />
      </div>
      <div class="col-3">
        <app-input-date :model="store.formRsLain.tglrencanakunjungan" label="Tgl Rencana Kunjungan" outlined
          @set-model="(val) => store.setFormRsLain('tglrencanakunjungan', val)" />
      </div>

      <div class="col-3">
        <q-select v-model="store.formRsLain.tipefaskes" label="Tipe Faskes" dense outlined standout="bg-yellow-3"
          use-input input-debounce="0" :options="optionTipe" map-options emit-value
          @update:model-value="setTipeFaskes" />
      </div>
      <div class="col-3">
        <q-select v-model="store.formRsLain.tiperujukan" label="Tipe Faskes" dense outlined standout="bg-yellow-3"
          use-input input-debounce="0"
          :options="store.formRsLain.tipefaskes === '2' ? optionTipeRujukan : optionRujukanTk1" map-options
          emit-value />
      </div>
      <div class="col-8">
        <q-select ref="refRs" v-model="store.formRsLain.ppkdirujuk" label="di rujuk Ke" dense outlined
          standout="bg-yellow-3" use-input input-debounce="800" map-options :options="optionsRs" option-value="kode"
          option-label="nama" hide-bottom-space @filter="onFilterTest" clearable @update:model-value="updateModelPpk" />
      </div>
      <div class="col-7">
        <q-select ref="refPoli" v-model="store.formRsLain.polirujukan" label="Poli Rujukan" dense outlined
          standout="bg-yellow-3" use-input input-debounce="800" :options="optionsPoli" option-value="kode" clearable
          option-label="nama" map-options hide-bottom-space @filter="filterPoli"
          @update:model-value="updateModelPoli" />
      </div>
      <div class="col-4">

        <!-- <app-autocomplete v-model="store.formRsLain.diagnosarujukan" label="Diagnosa rujukan" dense outlined
          option-label="keterangan" option-value="kode" :source="store.optionDiagnosas" @selected="(val) => {
            const diag = pasien?.diagnosa.find(d => d.rs3 === val)?.masterdiagnosa?.rs4 ?? '-'
            store.setFormRsLain('diagnosa', val + ' - ' + diag)
            // console.log('diagnosa', val, pasien?.diagnosa, diag)
          }" /> -->
        <q-select v-model="store.formRsLain.diagnosarujukan" use-input hide-selected fill-input outlined
          standout="bg-yellow-3" dense emit-value map-options option-value="kode"
          :option-label="opt => Object(opt) === opt && 'keterangan' in opt ? opt.kode + ' ~ ' + opt.keterangan : ' Cari Diagnosa '"
          input-debounce="0" :options="optionDiags" label="Cari Diagnosa (ICD)" @filter="filterFn">
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-12">
        <q-input ref="refCatat" v-model="store.formRsLain.catatan" label="Catatan" dense outlined
          :rules="[val => val?.length > 5 || 'Minimal 5 karakter']" standout="bg-yellow-3" />
      </div>
      <div class="col-12">
        <q-separator class=" q-my-md" />
        <div class="text-right q-gutter-sm">
          <q-btn label="Simpan" color="primary" type="submit" :loading="store.loadingSave"
            :disable="store.loadingSave" />
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { notifErrVue } from 'src/modules/utils'
import { date } from 'quasar'
import { usePerencanaanHDStore } from 'src/stores/simrs/hemodialisa/perencanaan'
// import { useQuasar } from 'quasar'
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const store = usePerencanaanHDStore()
// const $q = useQuasar()
const optionDiags = ref([])
const listDiagnosa = ref([])


function filterFn (val, update, abort) {
  if (val?.length < 1) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    // const arr = store.listDiagnosa
    const arr = listDiagnosa.value
    const filter = ['kode', 'keterangan']
    const multiFilter = (data = [], filterKeys = [], value = '') =>
      data.filter((item) => filterKeys.some(
        (key) =>
          item[key].toString().toLowerCase().includes(value.toLowerCase()) &&
          item[key]
      )
      )
    const filteredData = multiFilter(arr, filter, needle)
    optionDiags.value = filteredData
  })
}

const optionsJnsKunjungan = ref([
  { value: '', label: '-------' },
  { value: '1', label: 'Rawat Inap' },
  { value: '2', label: 'Rawat Jalan' }
])
const optionTipe = ref([
  { value: '1', label: 'FKTP' },
  { value: '2', label: 'Faskes 2' }
])
const optionTipeRujukan = ref([
  { value: '0', label: 'Penuh' },
  { value: '1', label: 'Partial' }
])
const optionRujukanTk1 = ref([
  { value: '2', label: 'Rujuk Balik (Non PRB)' }
])

function setTipeFaskes (val) {
  if (val === '1') {
    store.formRsLain.tiperujukan = '2'
    getFaskesPasien()
  } else {
    store.formRsLain.tiperujukan = '0'
    store.formRsLain.ppkdirujuk = ''
  }
  console.log('se', val, props.pasien)
}
const faskesPasienTk1 = ref(null)
async function getFaskesPasien () {
  const form = {
    tglsep: date.formatDate(new Date(), 'YYYY-MM-DD'),
    noka: props.pasien.noka
  }
  await api.post('v1/simrs/bridgingbpjs/pendaftaran/cekpsertabpjsbynoka', form)
    .then(res => {
      console.log('res', res?.data?.result?.peserta?.provUmum)
      const faskes = {
        nama: res?.data?.result?.peserta?.provUmum?.nmProvider,
        kode: res?.data?.result?.peserta?.provUmum?.kdProvider
      }
      optionsRs.value.push(faskes)
      store.formRsLain.ppkdirujuk = faskes.kode
      store.formRsLain.ppkdirujukx = faskes.nama
      store.formRsLain.namappkdirujuk = faskes.nama
    })
}
const refCatat = ref(null)
const optionsRs = ref([])
const optionsPoli = ref([])
function updateModelPoli (val) {
  if (!!val) {
    store.formRsLain.polirujukan = val.kode
    store.formRsLain.namapolirujukan = val.nama
  } else {
    store.formRsLain.polirujukan = ''
    store.formRsLain.namapolirujukan = ''
  }
  // console.log('poli ', val)
}
function updateModelPpk (val) {
  if (!!val) {
    store.formRsLain.ppkdirujuk = val.kode
    store.formRsLain.ppkdirujukx = val.nama
    store.formRsLain.namappkdirujuk = val.nama
  } else {
    store.formRsLain.ppkdirujuk = ''
    store.formRsLain.ppkdirujukx = ''
    store.formRsLain.namappkdirujuk = ''

  }

  // console.log('poli ', val)
}
const onFilterTest = async (val, update, abort) => {
  if (val?.length < 3) {
    abort()
    return
  }
  const params = {
    params: {
      namafaskes: val,
      jnsfaskes: store?.formRsLain?.tipefaskes
    }
  }
  const response = await api.get('v1/simrs/pelayanan/faskes', params)
  const code = response?.data?.metadata?.code
  console.log('faskes', response)
  if (code === '200') {
    update(() => {
      optionsRs.value = response?.data?.result?.faskes
    })
  } else {
    notifErrVue(response?.data?.metadata?.message)
    abort()
    return
  }
}
const filterPoli = async (val, update, abort) => {
  if (val?.length < 3) {
    abort()
    return
  }
  const params = {
    params: {
      namapoli: val
    }
  }
  const response = await api.get('v1/simrs/pelayanan/polibpjs', params)
  // console.log(response)
  const code = response?.data?.metadata?.code
  if (code === '200') {
    update(() => {
      optionsPoli.value = response?.data?.result?.poli
    })
  }
}

onMounted(() => {
  store.initPasien(props.pasien)
  store.getDiagnosaDropdown().then((res) => {
    optionDiags.value = res
    listDiagnosa.value = res
  })
  console.log('faskes pas', faskesPasienTk1.value)

})
const refRs = ref(null)
const refPoli = ref(null)
watch(() => store.formRsLain, (obj) => {
  console.log('watch', obj)
  console.log('edit', store.editRsLain)
  // console.log('ref rs', refRs.value)
  // console.log('ref poli', refPoli.value)
  if (obj?.namappkdirujuk !== '') {
    optionsRs.value.push({
      nama: obj?.namappkdirujuk,
      kode: obj?.ppkdirujuk
    })
    // refRs.value.filter(obj?.namappkdirujuk)
    // onFilterTest(obj?.namappkdirujuk)
  }
  if (obj?.namapolirujukan !== '') {
    optionsPoli.value.push({
      nama: obj?.namapolirujukan,
      kode: obj?.polirujukan
    })
    // refPoli.value.filter(obj?.namapolirujukan)
    // filterPoli(obj?.namapolirujukan)
  }
}, { deep: true })
function simpan () {
  console.log('ok', store.formRsLain)
  console.log('cat', refCatat.value.validate())
  if (refCatat.value.validate()) {
    store.saveRsLain(props?.pasien)
  }
  // $q.notify({
  //   type: 'negative',
  //   message: 'Maaf, Anda tidak terhubung ke BPJS',
  //   position: 'top-right',
  //   color: 'negative'
  // })
}
</script>
