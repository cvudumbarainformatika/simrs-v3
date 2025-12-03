<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <q-select v-model="store.form.tahun" :disable="store.loading" :loading="store.loadingSave" :options="tahuns"
        outlined dense label="Tahun Anggaran" @update:model-value="val => {
          console.log('Tahun dipilih:', val)
        }" />
    </div>
    <div class="" style="">

      <q-select v-model="store.form.nip" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="nip" input-debounce="300" label="Pejabat Teknis Kegiatan" class="ellipsis-2-lines"
        :options="options" clearable :option-label="opt => opt?.nip ? `${opt.nip} - ${opt.nama}` : ''"
        :disable="store.loadingSave" :loading="store.loadingSave" @filter="filterFn" @clear="store.setForm('nip', null)"
        @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.nip === val)
          store.form.nama = cari ? cari.nama : ''
          store.form.bagian = cari ? cari.bagiansiasik?.nama : ''
          store.form.kodeBagian = cari ? cari.bagiansiasik?.kode : ''
          store.form.alias = cari ? cari.bagiansiasik?.panggilan : ''
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
import { useMasterPejabatTeknisStore } from 'src/stores/siasik/master/pejabat_teknis/pejabatteknis';
import { onMounted, ref } from 'vue';

const store = useMasterPejabatTeknisStore()
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
    label: `${a.nip} - ${a.nama}`,
    value: a.nip
  }))

  // store.optionrekening = []
  // await store.getRekening()
  // options.value = store.akuns

})

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
      const resp = await api.get('v1/master/siasik/ptk/getpegawai', {
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
