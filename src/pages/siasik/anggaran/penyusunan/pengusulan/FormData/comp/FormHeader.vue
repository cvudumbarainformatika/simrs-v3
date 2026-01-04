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
            map-options option-value="value" input-debounce="300" label="Kegiatan BLUD" class="ellipsis-2-lines"
            :options="options_kegiatan" clearable option-label="label" :display-value="store.form.kegiatan"
            :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFnKegiatan"
            @clear="store.setForm('kodeKegiatan', null)" @update:model-value="(val) => {
              val = Number(val)
              const arr = store.optionkegiatan || []
              const cari = arr.find(x => Number(x.no) === val)
              console.log('cari', cari)
              store.form.kodeKegiatan = val
              store.form.kegiatan = cari ? cari.nomenklatur : ''
              store.form.ruangan = cari ? cari.namaorganisasi : ''
              store.form.kodeRuangan = cari ? cari.kode : ''
              store.form.kodebagian = cari ? cari.kode : ''
              store.form.organisasi_nama = cari ? cari.namaorganisasi : ''
              store.form.paguanggaran = cari ? Number(cari.total) : 0
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
    store.rincians = []
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
  const currentKode = store.form.kodeKegiatan

  store.params.tahun = val
  await store.getData()
  await store.getKegiatan()

  const used = store.items.map(x => Number(x.kodeKegiatan))

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
}

async function filterFnKegiatan(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options_kegiatan.value = master_kegiatan.value
    })
    return
  }

  try {
    const resp = await api.get('v1/anggaran/penyusunan/pengusulan/select', {
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








  // // 🔹 jika input kosong → tampilkan data awal
  // if (!val) {
  //   update(() => {
  //     options_kegiatan.value = master_kegiatan.value
  //   })
  //   return
  // }

  // const needle = val.toLowerCase()

  // // 🔹 filter lokal dulu (kode + nomenklatur)
  // const localFiltered = master_kegiatan.value.filter(v =>
  //   v.kode?.toLowerCase().includes(needle) ||
  //   v.nomenklatur?.toLowerCase().includes(needle)
  // )

  // // kalau ketemu di lokal → langsung pakai
  // if (localFiltered.length) {
  //   update(() => {
  //     options_kegiatan.value = localFiltered
  //   })
  //   return
  // }

  // // 🔹 kalau tidak ketemu → baru hit API
  // let allData = []
  // let page = 1
  // let hasMore = true

  // while (hasMore) {
  //   try {
  //     const resp = await api.get(
  //       'v1/anggaran/penyusunan/pengusulan/select',
  //       {
  //         params: {
  //           q: val,
  //           per_page: 100,
  //           page
  //         }
  //       }
  //     )

  //     const data = resp.data.data || []

  //     allData.push(...data)
  //     hasMore = resp.data.next_page_url !== null
  //     page++
  //   } catch (err) {
  //     console.error(err)
  //     hasMore = false
  //   }
  // }

  // update(() => {
  //   options_kegiatan.value = allData.map(a => ({
  //     ...a,
  //     label: `${a.kode} - ${a.nomenklatur}`,
  //     value: a.no
  //   }))
  // })
}


</script>
