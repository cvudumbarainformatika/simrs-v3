<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <q-select v-model="store.form.tahun" :disable="store.loading" :loading="store.loadingSave" :options="tahuns"
        outlined dense label="Tahun Anggaran" @update:model-value="ubahTahun" />
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kodekegiatan" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="no" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
        :options="options_kegiatan" clearable
        :option-label="opt => opt?.no ? `${opt.kode} - ${opt.nomenklatur}` : `${opt.nomenklatur}`"
        :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFnKegiatan"
        @clear="store.setForm('kodekegiatan', null)" @update:model-value="(val) => {

          val = Number(val)
          const arr = store.optionkegiatan || []
          const cari = arr.find(x => Number(x.no) === val)
          store.form.no = val
          store.form.kegiatanblud = cari ? cari.nomenklatur : ''
          store.form.kodeorganisasi1 = cari ? cari.organisasi_kode1 : ''
          store.form.kodeorganisasi2 = cari ? cari.organisasi_kode2 : ''
          store.form.kodeorganisasi3 = cari ? cari.organisasi_kode3 : ''
          store.form.namaorganisasi = cari ? cari.organisasi_nama : ''
          store.form.total = 0
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Data Tidak Ditemukan / Sudah Ada di List</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div>
      <q-input v-model.number="store.form.total" outlined dense label="Nilai Penetapan" type="number"
        :disable="store.loadingSave" :loading="store.loadingSave" />
    </div>

    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { api } from 'src/boot/axios';
import { usePenetapanPaguStore } from 'src/stores/siasik/anggaran/penyusunan/penetapanpagu';
import { nextTick, onMounted, ref } from 'vue';

const store = usePenetapanPaguStore()
const formRef = ref(null)

const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
  if (!store.form.id) { // kalau FORM BARU
    store.form.kodekegiatan = null
  }
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

  // options_kegiatan = store.akuns.map(a => ({
  //   ...a,
  //   label: `${a.nip} - ${a.nama}`,
  //   value: a.nip
  // }))

  // store.optionrekening = []
  // await store.getRekening()
  // options_kegiatan = store.akuns

})
async function ubahTahun(val) {
  store.setForm('kodekegiatan')
  const currentKode = store.form.kodekegiatan
  store.params.tahun = val
  await store.getData()

  options_kegiatan.value = []
  options.value = []

  await store.getKegiatan()
  const used = store.items.map(x => parseInt(x.kodekegiatan))
  let hasil = store.kegiatans.filter(k => !used.includes(k.no))


  if (currentKode) {
    const existing = store.kegiatans.find(k => k.no == currentKode)
    if (existing && !hasil.some(x => x.no == existing.no)) {
      hasil.push(existing)
    }
  }

  store.optionkegiatan = hasil

  options_kegiatan.value = hasil.map(a => ({
    ...a,
    label: `${a.kode} - ${a.nomenklatur}`,
    value: a.no
  }))

}

async function filterFnKegiatan(val, update) {
  if (!val) {
    update(() => {
      options_kegiatan.value = store.optionkegiatan.map(a => ({
        ...a,
        label: `${a.kode} - ${a.nomenklatur}`,
        value: a.no
      }))
    })
    return
  }

  if (val.length < 2) {
    update(() => {
      options_kegiatan.value = []
    })
    return
  }

  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get('v1/master/siasik/kegiatanblud/index', {
        params: { q: val, per_page: 100, page }
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

  update(() => {
    options_kegiatan.value = allData.map(a => ({
      ...a,
      label: `${a.kode} - ${a.nomenklatur}`,
      value: a.no
    }))

    store.optionkegiatan = allData
  })
}

</script>
