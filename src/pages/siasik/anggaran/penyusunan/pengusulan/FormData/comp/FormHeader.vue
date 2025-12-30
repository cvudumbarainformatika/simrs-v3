<template>
  <q-card flat class="col full-height">
    <q-form @submit="onSubmit" ref="formNpdLS" class="full-height">
      <div class="row q-pa-sm q-col-gutter-md">
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Nomor Pengusulan" v-model="store.form.notrans" readonly :disable="store.disabled"
            outlined dense />
          <q-select v-model="store.form.tahun" :disable="store.loading" :loading="store.loadingSave" :options="tahuns"
            outlined dense label="Tahun Anggaran" @update:model-value="ubahTahun" />
          <app-input-date-human label="Tanggal Transaksi" :model="store.params.tgl" icon="icon-mat-event" outlined
            :autofocus="false" :disable="store.disabled" @db-model="tglTransaksi"
            :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" />
        </div>
        <div class="col-6 q-gutter-y-md">
          <app-input-simrs label="Bidang/Bagian" v-model="store.form.ruangan" readonly :disable="store.disabled"
            outlined dense />

          <q-select v-model="store.form.kodeKegiatan" use-input outlined standout="bg-yellow-3" dense emit-value
            map-options option-value="no" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
            :options="options_kegiatan" clearable
            :option-label="opt => opt?.no ? `${opt.kode} - ${opt.nomenklatur}` : `${opt.nomenklatur}`"
            :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFnKegiatan"
            @clear="store.setForm('kodeKegiatan', null)" @update:model-value="(val) => {
              val = Number(val)
              const arr = store.optionkegiatan || []
              const cari = arr.find(x => Number(x.no) === val)
              store.form.kodeKegiatan = val
              store.form.kegiatan = cari ? cari.nomenklatur : ''
              store.form.kodebagian = cari ? cari.kodebidang : ''
              store.form.organisasi_nama = cari ? cari.bidang : ''
              store.form.kodeRuangan = cari ? cari.kodebidang : ''
              store.form.ruangan = cari ? cari.bidang : ''
            }">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Data Tidak Ditemukan / Sudah Ada di List</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

      </div>
      <div class="q-px-sm">
        <q-card class="full-width bg-grey-4 q-my-sm q-px-sm">
          <div class="row text-primary q-pa-sm q-my-sm q-px-sm">
            <div class="f-14 text-weight-bold">
              Rincian Pengusulan Anggaran
            </div>
          </div>
        </q-card>
      </div>
    </q-form>
    <FormRincian />
  </q-card>
</template>
<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import FormRincian from './FormRincian.vue'
import { formInputPajakStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formpajak';
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';
import { usePenetapanPaguStore } from 'src/stores/siasik/anggaran/penyusunan/penetapanpagu';
import { api } from 'src/boot/axios';

const form = ref([])
const store = usePengusulanAnggaranStore()
const options = ref([])
const options_kegiatan = ref([])
const tahuns = ref([])
const master_kegiatan = ref([])
onMounted(async () => {
  init()
  await ubahTahun(store.form.tahun)
})

function tglTransaksi(val) {
  // console.log('val Parameter', val)
  store.form.tglTransaksi = val
  store.params.tgl = val
}
function onSubmit() {
  store.fixed = true
}
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
  if (!store.form.id) { // kalau FORM BARU
    store.form.notrans = null
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

async function ubahTahun(val) {
  store.setForm('kodeKegiatan')
  const currentKode = store.form.kodeKegiatan
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

  master_kegiatan.value = hasil.map(a => ({
    ...a,
    label: `${a.kode} - ${a.nomenklatur}`,
    value: a.no
  }))

  options_kegiatan.value = master_kegiatan.value
}

async function filterFnKegiatan(val, update) {
  // 🔹 jika input kosong → tampilkan data awal
  if (!val) {
    update(() => {
      options_kegiatan.value = master_kegiatan.value
    })
    return
  }

  const needle = val.toLowerCase()

  // 🔹 filter lokal dulu (kode + nomenklatur)
  const localFiltered = master_kegiatan.value.filter(v =>
    v.kode?.toLowerCase().includes(needle) ||
    v.nomenklatur?.toLowerCase().includes(needle)
  )

  // kalau ketemu di lokal → langsung pakai
  if (localFiltered.length) {
    update(() => {
      options_kegiatan.value = localFiltered
    })
    return
  }

  // 🔹 kalau tidak ketemu → baru hit API
  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get(
        'v1/anggaran/penyusunan/pengusulan/select',
        {
          params: {
            q: val,
            per_page: 100,
            page
          }
        }
      )

      const data = resp.data.data || []

      allData.push(...data)
      hasMore = resp.data.next_page_url !== null
      page++
    } catch (err) {
      console.error(err)
      hasMore = false
    }
  }

  update(() => {
    options_kegiatan.value = allData.map(a => ({
      ...a,
      label: `${a.kode} - ${a.nomenklatur}`,
      value: a.no
    }))
  })
}


</script>
