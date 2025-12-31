<template>
  <q-form ref="formNpdLS" @submit="saveData">
    <div class="col-12 col-md-12">
      <div class="row">
        <div class="col-6 q-pa-sm q-gutter-y-md">
          <app-autocomplete label="Jenis Pengusulan" v-model="store.form.jenis" autocomplete="label"
            option-value="value" option-label="label" outlined :disable="store.disabled" :source="pilihanJenis"
            @update:model-value="updateJenis" />

        </div>
        <div class="col-6 q-pa-sm q-gutter-y-md">
          <q-select v-model="store.form.kode" use-input outlined standout="bg-yellow-3" dense emit-value map-options
            option-value="kode" input-debounce="300" label="Item Pengusulan" class="ellipsis-2-lines"
            :options="optionsBarangs" clearable
            :option-label="opt => opt?.kode ? `${opt.kode} - ${opt.nama}` : `${opt.nama}`" :disable="store.loadingSave"
            :loading="store.loadingSave" @filter="filterFnBarang" @clear="store.setForm('kode', null)"
            @update:model-value="updateBarang">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Data Tidak Ditemukan / Sudah Ada di List</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="row">
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Volume" v-model="store.form.volume" :disable="store.disabled" outlined dense
            @update:model-value="updateVolume" />


        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Satuan" readonly v-model="store.form.satuan" :disable="store.disabled" outlined
            dense />
        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Harga" v-model="store.form.harga" :disable="store.disabled" outlined dense
            :valid="{ number: true }" @update:model-value="updateHarga" />
        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Total" readonly :model-value="formattanpaRp(store.form.nilai)"
            :disable="store.disabled" outlined dense />
        </div>

      </div>
      <div class="row items-center q-pl-sm q-gutter-y-md">
        <app-btn label="Simpan Rincian" class="bg-black" type="submit" :disable="store.loading"
          :loading="store.loading" />
      </div>
    </div>
  </q-form>
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils';
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi';
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { formattanpaRp } from 'src/modules/formatter'
import { usePengusulanAnggaranStore } from 'src/stores/siasik/anggaran/penyusunan/pengusulan';
// const FormInputPajak = defineAsyncComponent(() => import('./formpajak/FormPajak.vue'))


const store = usePengusulanAnggaranStore()
const carisrt = dataBastFarmasiStore()
onMounted(() => {
  console.log('store barang', store.dataBarangs)
  store.getBarangs()
})

const pilihanJenis = [
  { label: 'Barang Habis Pakai', value: 'Barang' },
  { label: 'Barang Modal', value: 'Modal' },
  { label: 'Jasa dan lain-lain', value: 'Jasa' },
]

function updateJenis(val) {
  console.log('updatejenis', val)
}

function updateBarang(val) {
  const data = store.dataBarangs.find(x => x.kode === val)
  store.form.satuan = data?.satuan ? data?.satuan?.nama : data?.satuan

}

function updateVolume(val) {
  const _removedZeros = val.replace(/^0+/, '')
  if (val > 1) store.form.volume = _removedZeros
  store.form.nilai = parseInt(store.form.harga) * parseInt(val)
}
function updateHarga(val) {
  const _removedZeros = val.replace(/^0+/, '')
  if (val > 1) store.form.harga = _removedZeros
  store.form.nilai = parseInt(store.form.volume) * parseInt(val)
}
const optionsBarangs = ref([])
async function filterFnBarang(val, update) {
  if (!val) {
    update(() => {
      optionsBarangs.value = store.dataBarangs
    })
    return
  }

  const needle = val.toLowerCase()

  const localFiltered = store.dataBarangs.filter(v =>
    v.kode?.toLowerCase().includes(needle) ||
    v.nama?.toLowerCase().includes(needle)
  )

  if (localFiltered.length) {
    update(() => {
      optionsBarangs.value = localFiltered
    })
    return
  }

  let allData = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    try {
      const resp = await api.get(
        'v1/barangs/index',
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
    optionsBarangs.value = allData.map(a => ({
      ...a,
      label: `${a.kode} - ${a.nama}`,
      value: a.kode
    }))
  })
}

function saveData() {
  console.log('saved', store.form)
}
</script>
