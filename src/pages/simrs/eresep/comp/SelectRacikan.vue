<template>
  <q-select ref="refObat" outlined dense use-input hide-selected fill-input input-debounce="200" :rules="[obatValid]"
    :options="options" @filter="filterFn" placeholder="Min 3 character untuk pencarian obat" option-label="namaobat"
    option-value="kodeobat" autocomplete="namaobat" autofocus class="full-width" hide-bottom-space hide-dropdown-icon
    no-error-icon @update:model-value="obatSelected">
    <template #prepend>
      <q-icon name="icon-mat-search" />
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps" class="row items-end">
        <div v-if="scope.opt.namaobat">
          {{ scope.opt.namaobat }}
        </div>
        <div v-if="scope.opt.kandungan"
          :class="scope.opt.alokasi <= 0 ? 'f-10 q-ml-xs q-mr-xs' : 'q-ml-xs q-mr-xs text-deep-orange'">
          ({{ scope.opt.kandungan }})
        </div>
        <div v-if="scope.opt.alokasi > 0" class="q-ml-xs text-weight-bold text-green">
          {{ scope.opt.alokasi }} <span class="f-8">(tersedia)</span>
        </div>
        <div v-if="scope.opt.alokasi <= 0" class="q-ml-xs text-weight-bold text-negative f-14">
          {{ scope.opt.alokasi }} <span class="f-8">(habis)</span>
        </div>
        <div v-if="scope.opt.satuankecil" :class="scope.opt.alokasi <= 0 ? 'f-10 q-ml-xs' : 'q-ml-xs text-primary'">
          {{ scope.opt.satuankecil }}
        </div>
      </q-item>
    </template>
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { notifErrVue } from 'src/modules/utils'
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'

import { ref } from 'vue'
const emits = defineEmits(['tidakBisaSimpan'])
const store = usePermintaanEResepStore()
// ngisi form
const refObat = ref(null)
function obatSelected (val) {
  if (val?.alokasi <= 0) {
    store.namaObat = null
    // notifErrVue('Stok Alokasi sudah habis, silahkan pilih obat yang lain')
  }
  const kekDosis = val?.kekuatandosis?.split(' ')
  if (kekDosis?.length > 1) {
    store.setForm('dosisobat', parseInt(kekDosis[0]) ?? 1)
    store.setForm('dosismaksimum', parseInt(kekDosis[0]) ?? 1)

    // console.log('kekDosis', kekDosis)

  }
  console.log('obat selected', val)
  store.setForm('satuan_kcl', val?.satuankecil ?? '-')
  store.setForm('kodeobat', val?.kdobat ?? '-')
  store.setForm('kandungan', val?.kandungan ?? '-')
  store.setForm('fornas', val?.fornas ?? '-')
  store.setForm('forkit', val?.forkit ?? '-')
  store.setForm('generik', val?.generik ?? '-')
  store.setForm('kode108', val?.kode108 ?? '-')
  store.setForm('uraian108', val?.uraian108 ?? '-')
  store.setForm('kode50', val?.kode50 ?? '-')
  store.setForm('uraian50', val?.uraian50 ?? '-')
  store.setForm('stokalokasi', val?.alokasi ?? '-')
  store.setForm('kodedepo', store.dpPar)
  // console.log('laokasi ', store.form.stokalokasi, ' jumlah ', store.form.jumlah)
  if ((parseFloat(store.form.jumlah) > parseFloat(store.form.stokalokasi)) && store.form.kodeobat !== '') {
    emits('tidakBisaSimpan', true)
    notifErrVue('Stok Alokasi tidak mencukupi silahkan cari obat alternatif')
  }
  else {
    emits('tidakBisaSimpan', false)
  }
}
function obatValid (val) {
  return (val !== null && val !== '') || ''
}
const options = ref([])
async function filterFn (val, update, abort) {
  if (val?.length < 3) {
    abort()
    return
  }
  store.bypass = false
  const depo = store.depos.filter(pa => pa.jenis === store.depo)
  // console.log('depo', store?.depo, depo)
  if (depo?.length) {
    store.dpPar = depo[0]?.value
  }
  else return notifErrVue('depo tujuan tidak ditemukan')

  const param = {
    groups: store?.pasien?.groups,
    kdruang: store.dpPar,
    q: val,
    tiperesep: store.form.tiperesep
  }

  const params = { params: param }

  const resp = await api.get('v1/simrs/farmasinew/depo/lihatstokobateresepBydokter', params)
  console.log('resp', resp)
  const data = resp.data?.dataobat ?? []

  update(() => {
    // const needle = val?.toLowerCase()
    // options.value = data?.length ? data?.filter(v => v?.namaobat.toLowerCase().indexOf(needle) > -1) : []
    options.value = data
  })
}

// eslint-disable-next-line no-unused-vars
function highlightSearchTerm (label) {
  const regex = new RegExp(store.namaObat, 'gi')
  return label?.replace(regex, '<span class="txt-highlight">$&</span>')
}

</script>
