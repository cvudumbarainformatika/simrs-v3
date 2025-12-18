<template>
  <q-form ref="formRef" @submit="simpan" class="q-gutter-sm q-pa-sm">
    <div class="" style="">
      <q-select v-model="store.form.kode50" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="Rekening LRA" class="ellipsis-2-lines" :options="options"
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
    </div>

    <div class="" style="">
      <q-select v-model="store.form.kode_bast" use-input outlined standout="bg-yellow-3" dense emit-value map-options
        option-value="kodeall3" input-debounce="300" label="BAST (LO)" class="ellipsis-2-lines" :options="options"
        clearable :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
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
        option-value="kodeall3" input-debounce="300" label="BAST (Neraca)" class="ellipsis-2-lines" :options="options"
        clearable :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
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
        :options="options" clearable :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''"
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
        map-options clearable option-value="kodeall3" input-debounce="300" label="Pencairan (Neraca K)"
        class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_bastcair2', null)" @update:model-value="(val) => {
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
        clearable option-value="kodeall3" input-debounce="300" label="Pencairan Tanpa BAST (Neraca D)"
        class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_cairx', null)" @update:model-value="(val) => {
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
        clearable option-value="kodeall3" input-debounce="300" label="Pencairan Tanpa BAST (Neraca K)"
        class="ellipsis-2-lines" :options="options"
        :option-label="opt => opt?.kodeall3 ? `${opt.kodeall3} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn" @clear="store.setForm('kode_cair2', null)" @update:model-value="(val) => {
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
        option-value="kode" input-debounce="300" label="LAK" class="ellipsis-2-lines" :options="options_lak" clearable
        :option-label="opt => opt?.kode ? `${opt.kode} - ${opt.uraian}` : ''" :disable="store.loading"
        :loading="store.loading" @filter="filterFn_lak" @clear="store.setForm('kode_lak', null)" @update:model-value="(val) => {
          const arr = store.optionrekeninglak || []
          const cari = arr.find(x => x.kode === val)
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
import { computed, onMounted, ref } from 'vue';

const store = useMasterRekeningJurnalStore()
const formRef = ref(null)

// const options = ref([])
// const options_lak = ref([])

const options = computed(() => store.optionrekening)
const options_lak = computed(() => store.optionrekeninglak)

function simpan() {
  console.log('Form yang akan disimpan:', store.form)
  store.simpanData().then(() => {
    formRef.value.resetValidation()
  })
}

onMounted(async () => {
  store.form = {
    id: null,
    kode50: null,
    uraian50: '',
    kode_bast: null,
    uraian_bast: '',
    kode_bastx: null,
    uraian_bastx: '',
    kode_bastcairx: null,
    uraian_bastcairx: '',
    kode_bastcair2: null,
    uraian_bastcair2: '',
    kode_cairx: null,
    uraian_cairx: '',
    kode_cair2: null,
    uraian_cair2: '',
    kode_lak: null,
    uraian_lak: ''
  }
  await store.getRekening()
  store.optionrekening = store.akuns   // ← WAJIB

  // options.value = store.akuns.map(a => ({
  //   ...a,
  //   label: `${a.kodeall3} - ${a.uraian}`,
  //   value: a.kodeall3
  // }))


  await store.getLak()
  store.optionrekeninglak = store.akunslak   // ← WAJIB

  // options_lak.value = store.akunslak.map(a => ({
  //   ...a,
  //   label: `${a.kode} - ${a.uraian}`,
  //   value: a.kode
  // }))


})

async function filterFn(val, update) {
  // Jika kosong → tampilkan semua data awal (page 1)
  if (!val) {
    update(() => {
      options.value = store.akuns.map(a => ({
        ...a,
        label: `${a.kodeall3} - ${a.uraian}`,
        value: a.kodeall3
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
      const resp = await api.get('v1/master/rekening/getrekening', {
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
      label: `${a.kodeall3} - ${a.uraian}`,
      value: a.kodeall3
    }))

    // Simpan supaya next search bisa cepat
    store.optionrekening = allData
  })
}

async function filterFn_lak(val, update) {
  // Jika kosong → tampilkan semua data awal (page 1)
  if (!val) {
    update(() => {
      options_lak.value = store.akunslak.map(a => ({
        ...a,
        label: `${a.kode} - ${a.uraian}`,
        value: a.kode
      }))
    })
    return
  }

  // Jika panjang key < 2 → jangan call API
  if (val.length < 2) {
    update(() => {
      options_lak.value = []
    })
    return
  }

  // Mulai pencarian server
  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get('v1/master/akunlak/select', {
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
    options_lak.value = allData.map(a => ({
      ...a,
      label: `${a.kode} - ${a.uraian}`,
      value: a.kode
    }))

    // Simpan supaya next search bisa cepat
    store.optionrekeninglak = allData
  })

}
</script>
