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
          <q-select v-model="store.form.keterangan" use-input outlined standout="bg-yellow-3" dense emit-value
            map-options option-value="value" input-debounce="300"
            label="Item Pengusulan (ketik min 2 huruf untuk mencari item)" class="ellipsis-2-lines"
            :options="optionsBarangs" clearable option-label="label" :disable="store.loadingSave"
            :loading="store.loadingSave" @filter="filterFnBarang" @clear="store.setForm('value', null)"
            @update:model-value="updateBarang">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Tidak Ada Data, Silahkan cari ulang</q-item-section>
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
          <app-input-simrs v-if="store.form.jenis === 'Barang' || store.form.jenis === 'Jasa'" label="Satuan" readonly
            v-model="store.form.satuan" :disable="store.disabled" outlined dense />
          <q-select v-else v-model="satuan" use-input outlined standout="bg-yellow-3" dense emit-value map-options
            option-value="id" input-debounce="300" label="Pilih Satuan" class="ellipsis-2-lines"
            :options="optionsSatuans" clearable option-label="satuanBarang" :disable="store.loadingSave"
            :loading="store.loadingSave" @filter="filterFnSatuan" @clear="store.setForm('id', null)"
            @update:model-value="updateSatuan">
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">Tidak Ada Data, Silahkan cari ulang</q-item-section>
              </q-item>
            </template>
          </q-select>
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
import { api } from 'src/boot/axios';
// const FormInputPajak = defineAsyncComponent(() => import('./formpajak/FormPajak.vue'))


const store = usePengusulanAnggaranStore()
const carisrt = dataBastFarmasiStore()
const satuan = ref(null)
onMounted(() => {
})

const pilihanJenis = [
  { label: 'Barang Persediaan (SIGARANG)', value: 'Barang' },
  { label: 'Barang Modal (ASET)', value: 'Modal' },
  { label: 'Jasa dan lain-lain', value: 'Jasa' },
  { label: 'Farmasi', value: 'Farmasi' },
]

function updateJenis(val) {
  store.params.jenis = val
  store.form.jenis = val
  const params = {
    jenis: val
  }
  store.getBarangs(params)
  store.form.kode = ''
  store.form.satuan = ''
  store.form.keterangan = ''
  store.form.volume = 0
  store.form.harga = 0
  store.form.nilai = 0
  store.form.kode_50 = null
  store.form.kode_108 = null
  store.form.uraian50 = null
  store.form.uraian108 = null

  // optionsBarangs.value = []
}

function updateBarang(val) {
  store.form.satuan = ''
  store.form.volume = 0
  store.form.harga = 0
  store.form.nilai = 0
  const data = optionsBarangs.value.find(x => x.value === val)
  // console.log('data items', data)
  if (!data) return
  store.form.keterangan = data?.nama ? data?.nama : data?.uraian108
  store.form.kode = data?.kode ? data?.kode : data?.kode108
  store.form.kode_50 = data?.kode_50 ? data?.kode_50 : data?.kode50
  store.form.kode_108 = data?.kode_108 ? data?.kode_108 : data?.kode108
  store.form.uraian50 = data?.uraian_50 ? data?.uraian_50 : data?.uraian50
  store.form.uraian108 = data?.uraian_108 ? data?.uraian_108 : data?.uraian108
  // Catatan di Master Aset Belum ada Satuan jadinya dipakai unit
  if (store.form.jenis === 'Farmasi') return updateSatuan()
  if (store.form.jenis === 'Modal') return updateSatuan()
  store.form.satuan = data?.satuan?.nama || data?.satuan

}
function updateSatuan(val) {
  const data = optionsSatuans.value.find(x => x.id === val)

  store.form.satuan = data?.satuanBarang
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
  if (!val || val.length < 2) {
    update(() => {
      optionsBarangs.value = []
    })
    return
  }

  try {
    const resp = await api.get('v1/anggaran/penyusunan/pengusulan/selectitem', {
      params: {
        q: val,
        per_page: 20,
        jenis: store.params.jenis
      }
    })
    const data = resp.data.data || []

    update(() => {
      optionsBarangs.value = data.map(a => ({
        ...a,
        label: a.kode
          ? `${a.kode} - ${a.nama}`
          : `${a.kode108} - ${a.uraian108}`,
        value: a.kode
          ? `${a.kode}`
          : `${a.kode108}`
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      optionsBarangs.value = []
    })
  }
}

const optionsSatuans = ref([])

async function filterFnSatuan(val, update) {


  try {
    const resp = await api.get('v1/anggaran/penyusunan/pengusulan/selectsatuan', {
      params: {
        q: val,
        per_page: 1000,
      }
    })
    const data = resp.data.data || []
    if (!val || val.length < 2) {
      update(() => {
        optionsSatuans.value = data
      })
      return
    }
    update(() => {
      optionsSatuans.value = data.map(a => ({
        ...a,
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      optionsSatuans.value = []
    })
  }
}

function saveData() {


  store.simpanData()
  store.disableSaved = true
  console.log('saved setlah simpan', store.form)
}
</script>
