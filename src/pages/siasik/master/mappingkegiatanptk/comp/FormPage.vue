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
import { onMounted, ref } from 'vue';

const store = useMasterMappingKegiatanPtkStore()
const formRef = ref(null)

const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
function simpan() {
  console.log('form store:', store.form)
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}
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
  // store.optionrekening = store.akuns   // ← WAJIB

  // options.value = store.akuns.map(a => ({
  //   ...a,
  //   label: `${a.nip} - ${a.nama}`,
  //   value: a.nip
  // }))

  // store.optionrekening = []
  // await store.getRekening()
  // options.value = store.akuns

})
async function ubahTahun(val) {

  store.reqs.tahun = val
  store.params.tahun = val
  await store.getData()
  options_kegiatan.value = []
  options.value = []
  store.form.kodekegiatan = null
  store.form.kodepptk = null

  await store.getKegiatan()
  await store.getPegawai()

  const used = store.items.map(x => parseInt(x.kodekegiatan))
  const hasil = store.kegiatans.filter(k => !used.includes(k.no))
  store.optionkegiatan = hasil

  options_kegiatan.value = hasil.map(a => ({
    ...a,
    label: `${a.kode} - ${a.nomenklatur}`,
    value: a.no
  }))

  store.optionrekening = store.akuns
  options.value = store.akuns.map(a => ({
    ...a,
    label: `${a.nip} - ${a.nama}`,
    value: a.nip
  }))
}
async function filterFn(val, update) {
  // Jika kosong → tampilkan semua data awal (page 1)
  if (!val) {
    update(() => {
      options.value = store.akuns.map(a => ({
        ...a,
        label: `${a.nip} - ${a.nama}`,
        value: a.nip
      }))
    })
    return
  }

  // Jika panjang key < 2 → jangan call API
  if (val.length < 2) {
    update(() => {
      options.value = []
    })
    return
  }

  // Mulai pencarian server
  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get('v1/master/siasik/ptk/index', {
        params: {
          q: val,
          per_page: 100,
          page: page
        }
      })

      const data = resp.data.data || []

      if (data.length > 0) {
        allData = [...allData, ...data]
        hasMore = resp.data.next_page_url !== null
        page++
      } else {
        hasMore = false
      }

    } catch (e) {
      console.error('Error load page:', e)
      hasMore = false
    }
  }

  // Update hasil pencarian
  update(() => {
    options.value = allData.map(a => ({
      ...a,
      label: `${a.nip} - ${a.nama}`,
      value: a.nip
    }))

    // Simpan supaya next search bisa cepat
    store.optionrekening = allData
  })
}

async function filterFnKegiatan(val, update) {
  // Jika kosong → tampilkan semua data awal (page 1)
  if (!val) {
    update(() => {
      options.value = store.kegiatans.map(a => ({
        ...a,
        label: `${a.kode} - ${a.nama}`,
        value: a.kode
      }))
    })
    return
  }

  // Jika panjang key < 2 → jangan call API
  if (val.length < 2) {
    update(() => {
      options.value = []
    })
    return
  }

  // Mulai pencarian server
  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get('v1/master/siasik/kegiatanblud/index', {
        params: {
          q: val,
          per_page: 100,
          page: page
        }
      })

      const data = resp.data.data || []

      if (data.length > 0) {
        allData = [...allData, ...data]
        hasMore = resp.data.next_page_url !== null
        page++
      } else {
        hasMore = false
      }

    } catch (e) {
      console.error('Error load page:', e)
      hasMore = false
    }
  }

  // Update hasil pencarian
  update(() => {
    options.value = allData.map(a => ({
      ...a,
      label: `${a.kode} - ${a.nomenklatur}`,
      value: a.kode
    }))

    // Simpan supaya next search bisa cepat
    store.optionkegiatan = allData
  })
}

</script>
