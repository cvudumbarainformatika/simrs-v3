<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <app-input-simrs label="Nama" v-model="store.form.nama" :disable="store.disabled" outlined dense />
    </div>
    <!-- <div class="" style="">

      <q-select v-model="store.form.kode50" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="Kode Rekening" class="ellipsis-2-lines" :options="options"
        clearable :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode50', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian50 = cari ? cari.uraian : ''
          store.form.kodeall = cari ? cari.kodeall2 : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
</q-select>
</div> -->

    <q-separator class="q-my-lg" />
    <div class="text-right">
      <q-btn label="Simpan" type="submit" color="primary" :loading="store.loadingSave" />
    </div>
  </q-form>
</template>
<script setup>

import { api } from 'src/boot/axios';
import { useMasterJasadanLainStore } from 'src/stores/siasik/master/master_jasa/masterjasa';
import { onMounted, ref } from 'vue';

const store = useMasterJasadanLainStore()
const formRef = ref(null)

const options = ref([])
const options_lak = ref([])
const tahuns = ref([])
function simpan() {
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}
// function init() {
//   const d = new Date()
//   store.form.tahun = d.getFullYear()
//   generateArrayOfYears()
// }
// function generateArrayOfYears() {
//   const current = new Date().getFullYear()
//   const years = []

//   for (let i = current + 2; i >= current - 1; i--) {
//     years.push(i)
//   }

//   tahuns.value = years
// }

onMounted(() => {
  // init()

})

// async function filterFn(val, update) {
//   // Jika kosong → tampilkan semua data awal (page 1)
//   if (!val) {
//     update(() => {
//       options.value = store.akuns.map(a => ({
//         ...a,
//         label: `${a.kodeall3} - ${a.uraian}`,
//         value: a.kodeall3
//       }))
//     })
//     return
//   }

//   // Jika panjang key < 2 → jangan call API
//   if (val.length < 2) {
//     update(() => {
//       options.value = []
//     })
//     return
//   }

//   // Mulai pencarian server
//   let allData = []
//   let page = 1
//   let hasMore = true

//   while (hasMore) {
//     try {
//       const resp = await api.get('v1/master/siasik/jasa/getrekening', {
//         params: {
//           q: val,
//           per_page: 100,
//           page: page
//         }
//       })

//       const data = resp.data.data || []

//       if (data.length > 0) {
//         allData = [...allData, ...data]
//         hasMore = resp.data.next_page_url !== null
//         page++
//       } else {
//         hasMore = false
//       }

//     } catch (e) {
//       console.error('Error load page:', e)
//       hasMore = false
//     }
//   }

//   // Update hasil pencarian
//   update(() => {
//     options.value = allData.map(a => ({
//       ...a,
//       label: `${a.kodeall3} - ${a.uraian}`,
//       value: a.kodeall3
//     }))

//     // Simpan supaya next search bisa cepat
//     store.optionrekening = allData
//   })
// }

async function filterFn(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options.value = []
    })
    return
  }

  try {
    const resp = await api.get('v1/master/siasik/jasa/getrekening', {
      params: {
        q: val,
        per_page: 20 // kecil saja
      }
    })

    const data = resp.data.data || []

    update(() => {
      options.value = data.map(a => ({
        ...a,
        label: `${a.kodeall3} - ${a.uraian}`,
        value: a.kodeall3
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options.value = []
    })
  }
}



</script>
