<template>
  <q-dialog persistent @show="show()" @hide="() => {
    console.log('tutup');
  }">
    <q-card style="min-width: 550px; max-height: 80vh;">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">Input Monitoring Anestesi</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="() => { emit('close') }" />
      </q-card-section>

      <q-card-section class="q-pa-md scroll">
        <div class="row q-col-gutter-md">
          <div class="col-12 row q-col-gutter-sm items-center">
            <div class="col-6">
              <q-select v-model="form.time" :options="minuteOptions" label="Pilih Waktu" filled dense emit-value
                map-options options-dense behavior="menu">
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
              </q-select>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-8">
                Interval 5 menit sesuai standar rekam medis anestesi.
              </div>
            </div>
          </div>


          <div class="col-3">
            <q-input v-model.number="form.td_sistolik" label="Sistolik" filled dense color="green-9" />
          </div>
          <div class="col-3">
            <q-input v-model.number="form.td_diastolik" label="Diastolik" filled dense color="red-9" />
          </div>
          <div class="col-3">
            <q-input v-model.number="form.nadi" label="Nadi" filled dense color="blue-9" />
          </div>
          <div class="col-3">
            <q-input v-model.number="form.resp" label="Resp" filled dense color="orange-9" />
          </div>

          <q-separator class="col-12 q-my-sm" />
          <!--
          <div class="col-12 text-subtitle2 text-primary">Gas Inhalasi (L/mnt atau %)</div>
          <div class="col-4" v-for="gas in ['o2', 'n2o', 'halothan', 'isoflurane', 'sevoflurane']" :key="gas">
            <q-input v-model.number="form[gas]" :label="gas.toUpperCase()" filled dense />
          </div> -->
          <div class="col-12 text-subtitle2 text-primary">Gas Inhalasi (Maintenance)</div>
          <div class="col-4" v-for="gas in ['o2', 'n2o', 'halothan', 'isoflurane', 'sevoflurane']" :key="gas">
            <q-item tag="label" v-ripple class="bg-grey-2 rounded-borders">
              <q-item-section>
                <q-item-label class="text-caption text-bold">{{ gas.toUpperCase() }}</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle v-model="form[gas]" :true-value="15" :false-value="null" dense color="primary" />
              </q-item-section>
            </q-item>
          </div>

          <q-separator class="col-12 q-my-sm" />

          <div class="col-12 text-subtitle2 text-primary">Milestone / Penanda</div>
          <div class="col-12 row q-gutter-xs">
            <q-option-group v-model="selectedMilestones" :options="milestoneOptions" color="primary" type="checkbox"
              inline dense />
          </div>

          <q-separator class="col-12 q-my-sm" />

          <div class="col-12">
            <div class="row items-center justify-between">
              <div class="text-subtitle2 text-primary">Obat & Cairan</div>
              <q-btn icon="add" color="secondary" label="Tambah Item" dense flat @click="addItem" />
            </div>

            <div v-for="(item, index) in dynamicItems" :key="index" class="row q-col-gutter-xs q-mb-xs items-center">
              <div :class="item.type == 'obat' ? 'col-4' : 'col-5'">
                <q-input v-model="item.nama" placeholder="Nama Obat/Cairan" filled dense />
              </div>
              <div :class="item.type == 'obat' ? 'col-3' : 'col-4'">
                <q-input v-model="item.val" placeholder="Dosis/Vol" filled dense />
              </div>
              <div v-if="item.type == 'obat'" class="col-2">
                <q-select v-model="item.cara_masuk" :options="['IV', 'IM', 'IT']" plceholder="Cara masuk" filled
                  dense />
              </div>
              <div class="col-2">
                <q-select v-model="item.type" :options="['obat', 'cairan']" filled dense />
              </div>
              <div class="col-1">
                <q-btn icon="delete" color="negative" flat dense @click="removeItem(index)" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md bg-grey-2">
        <q-btn label="Batal" flat @click="emit('close')" />
        <q-btn label="Simpan Ke Grafik" color="primary" @click="processAndSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  logs: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'add-log', 'close'])
// const minuteOptions = Array.from({ length: 30 }, (_, i) => ({
//   label: `Menit ke-${i * 5}`,
//   value: i * 5
// }))
const minuteOptions = computed(() => {
  // 1. Cari menit tertinggi yang sudah ada di data
  const lastTime = props.logs.length > 0
    ? Math.max(...props.logs.map(l => l.time))
    : 0

  // 2. Tentukan batas atas (minimal 145, atau lastTime + 30 menit cadangan)
  const limit = Math.max(145, lastTime + 30)

  // 3. Generate array kelipatan 5 sampai batas limit
  const length = Math.floor(limit / 5) + 1

  return Array.from({ length }, (_, i) => {
    const val = i * 5
    return {
      label: `Menit ke-${val}`,
      value: val
    }
  })
})
// const show = ref(props.modelValue)
const selectedMilestones = ref([])
const dynamicItems = ref([]) // Untuk obat/cairan dinamis
// / Di dalam script setup InputObservasi.vue
const milestoneOptions = [
  { label: 'Mulai OP', value: 'mulai_op' },
  { label: 'Selesai OP', value: 'selesai_op' },
  { label: 'Intubasi', value: 'intubasi' },
  { label: 'Extubasi', value: 'extubasi' },
  { label: 'e-N-o O.R.O', value: 'eno_oro' },
  { label: 'X-Ana-X', value: 'x_ana' },
  { label: 'Ass. Resep', value: 'ass_resep' },
  { label: 'Conrt Resep', value: 'cn_resp' },
  { label: 'Spont Resep', value: 'sp_resp' },
]
const form = reactive({
  time: 0,
  td_sistolik: null,
  td_diastolik: null,
  nadi: null,
  resp: null,
  o2: null,
  n2o: null,
  halothan: null,
  isoflurane: null,
  sevoflurane: null,
  mulai_op: null,
  selesai_op: null,
  intubasi: null,
  extubasi: null,
  eno_oro: null,
  x_ana: null,
  ass_resep: null,
  cn_resp: null,
  sp_resp: null,

})
// Letakkan di bawah deklarasi form dan milestones
const resetFormExceptTime = () => {
  // 1. Reset Vital Signs & Gas menjadi null
  Object.assign(form, {
    // time TIDAK direset di sini
    td_sistolik: null,
    td_diastolik: null,
    nadi: null,
    resp: null,
    o2: null,
    n2o: null,
    halothan: null,
    isoflurane: null,
    sevoflurane: null,
    mulai_op: null,
    selesai_op: null,
    intubasi: null,
    extubasi: null,
    eno_oro: null,
    x_ana: null,
    ass_resep: null,
    cn_resp: null,
    sp_resp: null,

  })

  // 2. Kosongkan pilihan Milestone (QOptionGroup)
  selectedMilestones.value = []

  // 3. Kosongkan daftar Obat & Cairan dinamis
  dynamicItems.value = []
}
const addItem = () => dynamicItems.value.push({ nama: '', val: '', type: 'obat' })
const removeItem = (index) => dynamicItems.value.splice(index, 1)

const processAndSave = () => {
  // Susun kembali data agar sesuai format logs
  const milestoneData = {
    mulai_op: null,
    selesai_op: null,
    intubasi: null,
    extubasi: null,
    eno_oro: null,
    x_ana: null,
    ass_resep: null,
    cn_resp: null,
    sp_resp: null,
  }
  // Jika item ada di dalam array pilihan, beri nilai (misal 20 untuk posisi Y di chart)
  selectedMilestones.value.forEach(key => {
    milestoneData[key] = 20
  })
  const finalData = {
    ...form,
    ...milestoneData,
    obat: dynamicItems.value.filter(i => i.type === 'obat').map(i => ({ nama: i.nama, dosis: i.val, cara_masuk: i.cara_masuk })),
    cairan: dynamicItems.value.filter(i => i.type === 'cairan').map(i => ({ nama: i.nama, volume: i.val })),
    // Jika checkbox dicentang, beri nilai (misal 20 untuk posisi Y di chart)

  }

  emit('add-log', finalData)
  emit('close')

  // Reset state untuk input berikutnya
  // (Biasanya time tidak di-reset agar user tinggal nambah 5 menit)
}
function show () {
  const lastTime = props.logs.length > 0
    ? Math.max(...props.logs.map(l => l.time))
    : -5
  // form.time = lastTime + 5 > 145 ? 145 : lastTime + 5
  form.time = lastTime + 5
}

// Di dalam InputObservasi.vue
watch(() => form.time, (newTime) => {
  // Sekarang props.logs sudah terdefinisi
  const existingData = props.logs.find(l => l.time === newTime)

  if (existingData) {
    // Load data lama untuk diedit
    Object.assign(form, {
      td_sistolik: existingData.td_sistolik || null,
      td_diastolik: existingData.td_diastolik || null,
      nadi: existingData.nadi || null,
      resp: existingData.resp || null,
      o2: existingData.o2 || null,
      n2o: existingData.n2o || null,
      halothan: existingData.halothan || null,
      isoflurane: existingData.isoflurane || null,
      sevoflurane: existingData.sevoflurane || null
    })
    const activeMilestones = []
    if (existingData.mulai_op) activeMilestones.push('mulai_op')
    if (existingData.selesai_op) activeMilestones.push('selesai_op')
    if (existingData.intubasi) activeMilestones.push('intubasi')
    if (existingData.extubasi) activeMilestones.push('extubasi')
    if (existingData.eno_oro) activeMilestones.push('eno_oro')
    if (existingData.x_ana) activeMilestones.push('x_ana')
    if (existingData.ass_resep) activeMilestones.push('ass_resep')
    if (existingData.cn_resp) activeMilestones.push('cn_resp')
    if (existingData.sp_resp) activeMilestones.push('sp_resp')

    selectedMilestones.value = activeMilestones
    // Re-map Obat & Cairan agar muncul lagi di list dinamis
    dynamicItems.value = [
      ...(existingData.obat || []).map(o => ({ nama: o.nama, val: o.dosis, cara_masuk: o.cara_masuk, type: 'obat' })),
      ...(existingData.cairan || []).map(c => ({ nama: c.nama, val: c.volume, type: 'cairan' }))
    ]
  } else {
    // Jika ganti ke menit yang kosong, reset formnya
    resetFormExceptTime()
  }
})
</script>
