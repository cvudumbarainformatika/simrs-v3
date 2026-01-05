<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <q-select v-model="store.form.tahun" :disable="store.loading" :loading="store.loadingSave" :options="tahuns"
        outlined dense label="Tahun Anggaran" @update:model-value="ubahTahun" />
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kodekegiatan" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="no" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
        :options="options_kegiatan" clearable :option-label="opt => opt?.no ? `${opt.kode} - ${opt.nomenklatur}` : ''"
        :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFnKegiatan"
        @clear="store.setForm('kodekegiatan', null)" @update:model-value="(val) => {
          const arr = store.optionkegiatan || []
          const cari = arr.find(x => x.no === val)
          store.form.kegiatan = cari ? cari.nomenklatur : ''
          store.form.kodepptk = null
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="" style="">
      <q-select v-model="store.form.kodepptk" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="nip" input-debounce="300" label="Pejabat Teknis Kegiatan" class="ellipsis-2-lines"
        :options="options" clearable :option-label="opt => opt?.nip ? `${opt.nip} - ${opt.nama}` : ''"
        :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFn"
        @clear="store.setForm('kodepptk', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.nip === val)
          store.form.namapptk = cari ? cari.nama : ''
          store.form.bidang = cari ? cari.bagian : ''
          store.form.kodebidang = cari ? cari.kodeBagian : ''
          store.form.alias = cari ? cari.alias : ''

        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <!-- <div>
      <q-input v-model.number="store.form.nilai" outlined dense label="Nilai Anggaran Pendapatan" type="number"
        :disable="store.loadingSave" :loading="store.loadingSave" />
    </div> -->

    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { api } from 'src/boot/axios';
import { useMasterMappingKegiatanPtkStore } from 'src/stores/siasik/master/mapping_kegiatanptk/mapping_kegiatanptk';
import { onMounted, onUnmounted, ref } from 'vue';

const store = useMasterMappingKegiatanPtkStore()
const formRef = ref(null)

const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
const master_kegiatan = ref([])

onUnmounted(() => {
  store.resetForm()
})
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
  store.form.kodekegiatan = null
  store.form.kodepptk = null
  generateArrayOfYears()
}
function generateArrayOfYears() {
  const current = new Date().getFullYear()
  const years = []

  for (let i = current + 2; i >= current - 1; i--) {
    years.push(i)
  }

  tahuns.value = years
}

onMounted(async () => {
  init()
  await ubahTahun(store.form.tahun)
  // await store.getKegiatan()
  // store.optionkegiatan = store.kegiatans   // ← WAJIB
  // options_kegiatan.value = store.kegiatans.map(a => ({
  //   ...a,
  //   label: `${a.kode} - ${a.nomenklatur}`,
  //   value: a.kode
  // }))

  // await store.getPegawai()
  // store.optionrekening = store.pegawais   // ← WAJIB

  // options.value = store.pegawais.map(a => ({
  //   ...a,
  //   label: `${a.nip} - ${a.nama}`,
  //   value: a.nip
  // }))

  // store.optionrekening = []
  // await store.getRekening()
  // options.value = store.pegawais

})
async function ubahTahun(val) {

  store.reqs.tahun = val
  store.params.tahun = val
  // await store.getData()
  // options_kegiatan.value = []
  // options.value = []
  // store.form.kodekegiatan = null
  // store.form.kodepptk = null

  // await store.getKegiatan()
  // await store.getPegawai()

  // const used = store.items.map(x => Number(x.kodekegiatan))
  // const hasil = store.kegiatans.filter(k => !used.includes(Number(k.no)))
  // store.optionkegiatan = hasil

  // options_kegiatan.value = hasil.map(a => ({
  //   ...a,
  //   label: `${a.kode} - ${a.nomenklatur}`,
  //   value: a.no
  // }))

  const currentKode = store.form.kodekegiatan

  store.params.tahun = val
  await store.getData()
  await store.getKegiatan()
  await store.getPegawai()

  const used = store.items.map(x => Number(x.kodekegiatan))

  let hasil = store.kegiatans.filter(k => !used.includes(Number(k.no)))

  // pastikan kegiatan yg sudah dipilih tetap ada
  if (currentKode) {
    const exist = store.kegiatans.find(k => Number(k.no) === Number(currentKode))
    if (exist && !hasil.some(x => Number(x.no) === Number(exist.no))) {
      hasil.push(exist)
    }
  }

  store.optionkegiatan = hasil

  master_kegiatan.value = hasil.map(a => ({
    ...a,
    label: `${a.kode} - ${a.nomenklatur}`,
    value: a.no
  }))

  options_kegiatan.value = master_kegiatan.value

  store.optionrekening = store.pegawais
  options.value = store.pegawais.map(a => ({
    ...a,
    label: `${a.nip} - ${a.nama}`,
    value: a.nip
  }))
}

async function filterFn(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options.value = store.pegawais.map(a => ({
        ...a,
        label: `${a.nip} - ${a.nama}`,
        value: a.nip
      }))
    })
    return
  }

  try {
    const resp = await api.get('v1/master/siasik/ptk/index', {
      params: {
        q: val,
        per_page: 20,
        page: 1
      }
    })
    const data = resp.data.data || []

    update(() => {
      options.value = data.map(a => ({
        ...a,
        label: `${a.nip} - ${a.nama}`,
        value: a.nip
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options.value = []
    })
  }

}

async function filterFnKegiatan(val, update) {

  if (!val || val.length < 2) {
    update(() => {
      options_kegiatan.value = store.optionkegiatan.map(a => ({
        ...a,
        label: `${a.kode} - ${a.nomenklatur}`,
        value: a.kode
      }))
    })
    return
  }

  try {
    const resp = await api.get('v1/master/siasik/kegiatanblud/index', {
      params: {
        q: val,
        per_page: 20,
        page: 1
      }
    })
    const data = resp.data.data || []

    update(() => {
      options_kegiatan.value = data.map(a => ({
        ...a,
        label: `${a.kode} - ${a.nomenklatur}`,
        value: a.no
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options_kegiatan.value = []
    })
  }

}

async function simpan() {
  await store.simpanData()

  formRef.value.resetValidation()

  await store.getData()
  await ubahTahun(store.form.tahun)
}

</script>
