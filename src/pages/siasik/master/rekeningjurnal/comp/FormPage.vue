<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <q-select v-model="store.form.kode50" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="Rekening LRA" class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
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
    </div>

    <div class="" style="">
      <q-select v-model="store.form.kode_bast" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="BAST (Neraca)" class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_bast', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_bast = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kode_bastx" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="BAST (LO)" class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_bastx', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_bastx = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kode_bastcairx" use-input outlined standout="bg-yellow-3" dense emit-value
        map-options option-value="kodeall3" input-debounce="300" label="Pencairan (Neraca D)" class="ellipsis-2-lines"
        :options="options" :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''"
        :disable="store.loading" :loading="store.loading" @filter="filterFn"
        @clear="store.setForm('kode_bastcairx', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_bastcairx = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kode_bastcair2" use-input outlined standout="bg-yellow-3" dense emit-value
        map-options option-value="kodeall3" input-debounce="300" label="Pencairan (Neraca K)" class="ellipsis-2-lines"
        :options="options" :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''"
        :disable="store.loading" :loading="store.loading" @filter="filterFn"
        @clear="store.setForm('kode_bastcair2', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_bastcair2 = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kode_cairx" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="Pencairan Tanpa BAST (Neraca D)" class="ellipsis-2-lines"
        :options="options" :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''"
        :disable="store.loading" :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_cairx', null)"
        @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_cairx = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="" style="">
      <q-select v-model="store.form.kode_cair2" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="Pencairan Tanpa BAST (Neraca K)" class="ellipsis-2-lines"
        :options="options" :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''"
        :disable="store.loading" :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_cair2', null)"
        @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_cair2 = cari ? cari.uraian : ''
        }">
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="" style="">
      <q-select v-model="store.form.kode_lak" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="LAK" class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_lak', null)" @update:model-value="(val) => {
          const arr = store.optionrekening || []
          const cari = arr.find(x => x.kodeall3 === val)
          store.form.uraian_lak = cari ? cari.uraian : ''
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
import { useMasterRekeningJurnalStore } from 'src/stores/siasik/master/rekeningjurnal/rekeningjurnal';
import { onMounted, ref } from 'vue';

const store = useMasterRekeningJurnalStore()
const formRef = ref(null)

const options = ref([])

function simpan() {
  console.log('Form yang akan disimpan:', store.form)
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}

onMounted(() => {
  store.optionrekening = []
  options.value = store.akuns
  store.getRekening()
})

async function filterFn(val, update) {
  if (!val) {
    update(() => {
      options.value = store.optionrekening || []
      console.log('Options saat pencarian kosong:', options.value)
    })
    store.loading = false
    return
  }
  const needle = val.toLowerCase()
  const localResults = store.optionrekening?.filter(
    (item) =>
    (item.kodeall3?.toLowerCase().includes(needle) ||
      item.uraian?.toLowerCase().includes(needle))
  ) || []
  if (localResults.length > 0) {
    update(() => {
      options.value = localResults
      console.log('Options dari filter lokal:', localResults)
    })
    store.loading = false
    return
  }
  if (val.length >= 2) {
    let allData = []
    let page = 1
    let hasMore = true

    // console.log('Mulai iterasi halaman untuk levelberapa:', store.reqs.levelberapa)

    while (hasMore) {
      try {
        const resp = await api.get('v1/master/rekening/getrekening', {
          params: {
            q: val,
            per_page: 100,
            page: page,
          }
        })

        console.log(`filterFn: Data halaman ${page}:`, resp.data)

        if (resp.status === 200 && resp.data.data?.length) {
          allData = [...allData, ...resp.data.data]
          hasMore = resp.data.next_page_url !== null && resp.data.next_page_url !== undefined // Untuk SimplePaginator
          page++
        } else {
          hasMore = false
        }
      } catch (error) {
        console.error('Error saat mengambil halaman:', error)
        hasMore = false
      }
    }

    console.log('filterFn: Semua data dari server:', allData)

    // Update opsi berdasarkan hasil server
    update(() => {
      if (allData.length > 0) {
        options.value = allData
        store.optionrekening = allData // Update hanya jika ada hasil
      } else {
        options.value = [] // Kosongkan opsi untuk menampilkan "Tidak ditemukan"
      }
      console.log('Options setelah update:', options.value)
    })
  } else {
    // Untuk input pendek, gunakan hasil lokal
    update(() => {
      options.value = localResults
      console.log('Options untuk pencarian pendek:', localResults)
    })
  }

  store.loading = false

}
</script>
