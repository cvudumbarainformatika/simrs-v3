<template>
  <div class="full-height">
    <div class="q-pa-md text-weight-bold">
      FORM DIAGNOSA
      <div class="f-10 text-weight-light">
        <em>form Diagnosa sekaligus pensimulasian INACBG </em>
      </div>

      <q-btn color="primary" class="q-pa-none full-width" flat dense :loading="pengunjung.loadingGantiMemo"
        :disable="pengunjung.loadingGantiMemo" no-caps>
        {{ pasien?.memodiagnosa ?? 'MEMO DOKTER' }}
        <q-menu ref="refMemo" style="width: 400px;" @show="showMemo">
          <div class="q-pa-sm">
            <!-- <q-form @submit="gantiMemo"> -->
            <q-input ref="refInputMemo" v-model="memoDokter" label="Masukkan Memo Dokter untuk diagnosa" outlined
              standout="bg-yellow-3" dense :rules="[val => !!val || 'Harap diisi']" @keyup.enter.self="gantiMemo" />
            <!-- </q-form> -->
          </div>
        </q-menu>
      </q-btn>
    </div>
    <q-separator style="margin-top:-10px" />
    <q-form ref="formRef" class="row q-pa-md q-col-gutter-xs" @submit="onSubmit">
      <div class="col-3">
        <div>Kasus Baru ?</div>
      </div>
      <div class="col-9 q-gutter-sm">
        <!-- <q-radio
        v-model="store.formdiagnosa.kasus"
        dense
        val="Baru"
        label="Iya"
        name="kasus"
        color="primary"
      />
      <q-radio
        v-model="store.formdiagnosa.kasus"
        dense
        val="Lama"
        label="Tidak"
        name="kasus"
        color="negative"
      /> -->
        <q-option-group v-model="store.formdiagnosa.kasus" name="kasus" :options="optionsKasus" inline dense
          @update:model-value="kasusDiUbah" />
      </div>
      <div class="col-3">
        Type Diagnosa
      </div>
      <div class="col-9">
        <q-select v-model="store.formdiagnosa.tipediagnosa" label="Type Diagnosa" outlined dense :options="tipediagnosa"
          :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
      </div>
      <div class="col-3">
        Jenis Khasus
      </div>
      <div class="col-9">
        <q-select v-model="store.formdiagnosa.jeniskasus" label="Type Diagnosa" outlined dense
          :options="props.tipekhasusdiagnosa" option-label="rs1" option-value="rs1" emit-value
          :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
      </div>
      <div class="col-12">
        <q-separator class="q-my-sm" />
      </div>
      <!-- <div class="col-3">
        <div>Diagnosis Utama ?</div>
      </div>
      <div class="col-9 q-gutter-sm">
        <q-option-group
          v-model="store.formdiagnosa.tipediagnosa"
          name="tipediagnosa"
          :options="optionsDiagutama"
          inline
          dense
          @update:model-value="diagnosaUtamaDiubah"
        />
      </div>
      <div class="col-12">
        <q-separator class="q-my-sm" />
      </div> -->

      <!-- <div class="col-12 q-mb-sm">
        <q-select
          v-model="store.formdiagnosa.jeniskasus"
          use-input
          hide-selected
          fill-input
          outlined
          standout="bg-yellow-3"
          dense
          emit-value
          map-options
          option-value="kode"
          input-debounce="0"
          :options="options"
          label="Jenis Kasus"
          :rules="[val => !!val || 'Harus diisi']"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
</q-select>
</div> -->
      <div class="col-12 q-mb-sm">
        <q-select v-model="store.searchdiagnosa" use-input hide-selected fill-input outlined standout="bg-yellow-3"
          dense emit-value map-options option-value="kode"
          :option-label="opt => Object(opt) === opt && 'keterangan' in opt ? opt.kode + ' ~ ' + opt.keterangan : ' Cari Diagnosa '"
          input-debounce="0" :options="options" label="Cari Diagnosa (ICD)" @filter="filterFn"
          @update:model-value="(val) => store.setKode(val)">
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ditemukan
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="col-3">
        <div>Kode (ICD)</div>
      </div>
      <div class="col-9">
        <q-input v-model="store.formdiagnosa.kddiagnosa" placeholder="Kode (Automatis)" dense outlined
          standout="bg-yellow-3" :rules="[val => !!val || 'Harus diisi']" hide-bottom-space readonly
          style="max-width: 150px;" />
      </div>
      <div class="col-3">
        <div>Diagnosa</div>
      </div>
      <div class="col-9">
        <q-input v-model="store.formdiagnosa.diagnosa" placeholder="Diagnosa (Automatis)" outlined autogrow
          standout="bg-yellow-3" :rules="[val => !!val || 'Harus diisi']" hide-bottom-space readonly />
      </div>
      <div class="col-3">
        <div>Keterangan</div>
      </div>
      <div class="col-9">
        <q-input v-model="store.formdiagnosa.keterangan" autogrow outlined standout="bg-yellow-3" hide-bottom-space />
      </div>

      <div class="col-12">
        <q-separator class="q-my-lg" />
      </div>
      <div class="col-12">
        <q-btn label="Simpan Diagnosa" color="primary" type="submit" :loading="store.loadingFormDiagnosa"
          :disable="store.loadingFormDiagnosa" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useDiagnosaDokter } from 'src/stores/simrs/igd/diagnosadokter'
import { usePengunjungIgdStore } from 'src/stores/simrs/igd/pengunjung'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  tipekhasusdiagnosa: {
    type: Array,
    default: () => []
  }
})

const formRef = ref(null)
const store = useDiagnosaDokter()
const pengunjung = usePengunjungIgdStore()
const emits = defineEmits(['savePemeriksaan'])

const memoDokter = ref('')

const $q = useQuasar()

const optionsKasus = ref([
  { label: 'Iya', value: 'Baru', color: 'primary' },
  { label: 'Tidak', value: 'Lama', color: 'negative' }
])
// const optionsDiagutama = ref([
//   { label: 'Iya', value: 'Primer', color: 'primary' },
//   { label: 'Tidak', value: 'Sekunder', color: 'negative' }
// ])

function onSubmit () {
  if (store.formdiagnosa.kasus === null || store.formdiagnosa.kasus === '') {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'icon-mat-warning',
      message: 'Maaf Kasus Baru Atau Lama harus dipilih'
    })
  }
  else if (!store.formdiagnosa.kasus) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'icon-mat-warning',
      message: 'Maaf Kasus Baru Atau Lama harus dipilih'
    })
  }
  else {
    emits('savePemeriksaan')
  }
}

function resetValidation () {
  formRef.value.resetValidation()
}
defineExpose({ resetValidation })
const options = ref([])
const listDiagnosa = ref([])

onMounted(() => {
  options.value = store.listDiagnosa
  // console.log('a', store.listDiagnosa)
  // console.log('ax', options)
  store.initReset().then(() => {
    resetValidation()
  })
})

function filterFn (val, update, abort) {
  if (val?.length < 1) {
    abort()
    return
  }

  if (store.formdiagnosa.kasus === null || store.formdiagnosa.kasus === '') {
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'icon-mat-warning',
      message: 'Maaf Kasus Baru Atau Lama harus dipilih',
      position: 'top-left'
    })
    abort()
    return
  }
  console.log('sasaxxxx', store.formdiagnosa.kasus)
  console.log('cccccc', update)
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
    options.value = filteredData
  })
}

function kasusDiUbah (val) {
  ganti(val)
}

function ganti (val) {
  const arr = store.listDiagnosa
  // const arr2 = props.pasien?.diagnosa
  listDiagnosa.value = arr?.length ? arr : []
  // if (val === 'Baru' && arr2?.length === 0) {
  //   // listDiagnosa.value = arr?.length ? arr.filter(x => !x.kode.toString().toLowerCase().includes('z')) : []
  //   listDiagnosa.value = arr?.length ? arr : []
  // }
  // else if (val === 'Baru' && arr2?.length > 0) {
  //   // listDiagnosa.value = arr?.length ? arr.filter(x => x.kode.toString().toLowerCase().includes('z')) : []
  //   listDiagnosa.value = arr?.length ? arr : []
  // }
  // else if (val === 'Lama' && arr2?.length === 0) {
  //   listDiagnosa.value = arr?.length ? arr.filter(x => x.kode.toString().toLowerCase().includes('z')) : []
  // }
  // else if (val === 'Lama' && arr2?.length > 0) {
  //   listDiagnosa.value = arr?.length ? arr.filter(x => !x.kode.toString().toLowerCase().includes('z')) : []
  // }
  // arr2?.length ? store.setFormDianosa('tipediagnosa', 'Awal') : store.setFormDianosa('tipediagnosa', 'Primer')
}

const tipediagnosa = ref(['Awal', 'Primer', 'Sekunder'])

// function diagnosaUtamaDiubah (val) {
//   console.log(props.pasien)
//   if (store.formdiagnosa.kasus === null || store.formdiagnosa.kasus === '') {
//     $q.notify({
//       color: 'negative',
//       textColor: 'white',
//       icon: 'icon-mat-warning',
//       message: 'Maaf Kasus Baru Atau Lama harus dipilih terlebih dahulu',
//       position: 'top-left'
//     })

//     // store.setFormDianosa('tipediagnosa', '')
//   }
// }

const refMemo = ref(null)
const refInputMemo = ref(null)
function gantiMemo () {
  const form = {
    memo: memoDokter.value,
    noreg: props.pasien?.noreg,
    kdruang: props.pasien?.kodepoli,
  }
  refMemo.value?.hide()
  // console.log('ganti memo', props.pasien, form)
  pengunjung.gantiMemo(form, props.pasien)
}
function showMemo () {
  console.log('show memo')
  memoDokter.value = props.pasien?.memodiagnosa
  // refInputMemo.value.focus()
  refInputMemo.value.select()

}

watch(() => store.formdiagnosa.kasus, () => {
  ganti(store.formdiagnosa.kasus)
}, { deep: true })

</script>
