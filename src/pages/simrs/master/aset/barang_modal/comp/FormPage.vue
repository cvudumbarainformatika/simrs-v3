<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <!-- <div class="" style="">
      <q-select v-model="store.form.tahun" :disable="store.loading" :loading="store.loadingSave" :options="tahuns"
        outlined dense label="Tahun Anggaran" @update:model-value="val => {
          console.log('Tahun dipilih:', val)
        }" />
    </div> -->
    <div>
      <q-input v-model.number="store.form.namaaset" outlined dense label="Nama Barang Modal"
        :disable="store.loadingSave" :loading="store.loadingSave" />
    </div>
    <div class="" style="">

      <q-select v-model="store.form.kd108" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kd108" input-debounce="300" label="Rekening 108" class="ellipsis-2-lines" :options="options"
        clearable :option-label="opt => opt?.uraian108 ? `${opt.kode108} - ${opt.uraian108}` : ''"
        :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFn"
        @clear="store.setForm('kd108', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kode108 === val)
          store.form.uraian108 = cari ? cari.uraian108 : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>


    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { api } from 'src/boot/axios';
import { useMasterBarangModalStore } from 'src/stores/simrs/master/aset/barang_modal/barangmodal';
import { onMounted, ref } from 'vue';

const store = useMasterBarangModalStore()
const formRef = ref(null)

const options = ref([])
const options_lak = ref([])
const tahuns = ref([])
function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}
function init() {
  const d = new Date()
  store.form.tahun = d.getFullYear()
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
  await store.getPegawai()
  store.optionrekening = store.akuns   // ← WAJIB

  options.value = store.akuns.map(a => ({
    ...a,
    label: `${a.kode} - ${a.nama}`,
    value: a.kode
  }))

  // store.optionrekening = []
  // await store.getRekening()
  // options.value = store.akuns

})

async function filterFn(val, update) {
  if (!val) {
    update(() => {
      options.value = store.akuns.map(a => ({
        ...a,
        label: `${a.kode108} - ${a.uraian108}`,
        value: a.kode108
      }))
    })
    return
  }

  if (val.length < 2) {
    update(() => {
      options.value = []
    })
    return
  }

  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get('v1/master/siasik/kegiatanblud/getbidang', {
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

  update(() => {
    options.value = allData.map(a => ({
      ...a,
      label: `${a.kode108} - ${a.uraian108}`,
      value: a.kode108
    }))

    store.optionrekening = allData
  })
}

// async function filterFn(val, update) {
//   if (!val) {
//     update(() => {
//       options.value = store.optionrekening || []
//       console.log('Options saat pencarian kosong:', options.value)
//     })
//     store.loading = false
//     return
//   }
//   const needle = val.toLowerCase()
//   const localResults = store.optionrekening?.filter(
//     (item) =>
//     (item.kodeall3?.toLowerCase().includes(needle) ||
//       item.uraian?.toLowerCase().includes(needle))
//   ) || []
//   if (localResults.length > 0) {
//     update(() => {
//       options.value = localResults
//       // console.log('Options dari filter lokal:', localResults)
//     })
//     store.loading = false
//     return
//   }
//   if (val.length >= 2) {
//     let allData = []
//     let page = 1
//     let hasMore = true

//     // console.log('Mulai iterasi halaman untuk levelberapa:', store.reqs.levelberapa)

//     while (hasMore) {
//       try {
//         const resp = await api.get('v1/anggaran/penyusunan/anggaranpendapatan/getrekening', {
//           params: {
//             q: val,
//             per_page: 100,
//             page: page,
//           }
//         })

//         if (resp.status === 200 && resp.data.data?.length) {
//           allData = [...allData, ...resp.data.data]
//           hasMore = resp.data.next_page_url !== null && resp.data.next_page_url !== undefined
//           page++
//         } else {
//           hasMore = false
//         }
//       } catch (error) {
//         console.error('Error saat mengambil halaman:', error)
//         hasMore = false
//       }
//     }

//     // Update opsi berdasarkan hasil server
//     update(() => {
//       if (allData.length > 0) {
//         options.value = allData
//         store.optionrekening = allData
//       } else {
//         options.value = []
//       }
//       console.log('Options setelah update:', options.value)
//     })
//   } else {
//     update(() => {
//       options.value = localResults
//     })
//   }

//   store.loading = false

// }

</script>
