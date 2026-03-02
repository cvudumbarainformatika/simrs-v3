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
          <q-select v-model="store.form.usulan" use-input outlined standout="bg-yellow-3" dense emit-value map-options
            option-value="value" input-debounce="300" label="Item Pengusulan" class="ellipsis-2-lines"
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
        <div class="col-6 q-pa-sm q-gutter-y-md">
          <template v-if="store.form.koderek50">
            <q-input dense outlined label="Kode Rekening" :model-value="store.form.uraian50" readonly />
          </template>
          <template v-else>
            <q-select v-model="store.form.tmp_kode50" use-input outlined standout="bg-yellow-3" dense emit-value
              map-options option-value="kodeall2" input-debounce="800" label="Pilih Kode Rekening" :options="options"
              :option-label="opt => opt?.kodeall2 ? `${opt.kodeall2} - ${opt.uraian}` : ''" clearable
              :disable="store.loading" :loading="store.loading" @filter="filterFn" @update:model-value="(val) => {
                const arr = options || []
                const cari = arr.find(x => x.kodeall2 === val)
                store.form.uraian50 = cari ? cari.uraian : ''
                store.form.koderek50 = cari ? cari.kodeall2 : ''

                options108 = cari?.rekening108 || []
                if (!options108.length) {
                  // tidak ada rekening 108
                  store.form.koderek108 = ' '
                  store.form.uraian108 = ' '
                } else {
                  // reset kalau sebelumnya sudah terisi
                  store.form.koderek108 = null
                  store.form.uraian108 = null
                }
              }">
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">Tidak ditemukan</q-item-section>
                </q-item>
              </template>
            </q-select>
          </template>

        </div>
        <div class="col-6 q-pa-sm q-gutter-y-md">
          <template v-if="store.form.koderek108 !== null">
            <q-input dense outlined label="Kode Rekening 108" :model-value="store.form.uraian108" readonly />
          </template>
          <template v-else>
            <q-select v-model="store.form.tmp_kode108" :options="options108 || []" dense outlined emit-value map-options
              option-value="kode108" :option-label="opt => `${opt.kode108} - ${opt.uraian108}`"
              label="Pilih Kode Rekening 108" @update:model-value="(val) => {
                const cari = (options108 || []).find(x => x.kode108 === val)
                store.form.uraian108 = cari?.uraian108 || ''
                store.form.koderek108 = cari?.kode108 || ''
              }" />
          </template>
        </div>
      </div>
      <div class="row">
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Volume" v-model="store.form.volume" :disable="true" outlined dense
            :valid="{ number: true }" :autofocus="false" />
        </div>

        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Harga" v-model="store.form.harga" :disable="true" outlined dense
            :valid="{ number: true }" :autofocus="false" />
        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Total" :model-value="formattanpaRp(store.form.nilai || 0)" :disable="true" outlined
            dense />
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

      </div>
      <div class="row">
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Volume Baru" v-model="store.form.volumebaru" :disable="store.disabled" outlined dense
            @update:model-value="updateVolume" :valid="{ number: true }" :autofocus="false" />
        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Harga Baru" v-model="store.form.hargabaru" :disable="store.disabled" outlined dense
            :valid="{ number: true }" :autofocus="false" @update:model-value="updateHarga" />
        </div>
        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Total Baru" readonly :model-value="formattanpaRp(store.form.totalbaru || 0)"
            :disable="store.disabled" outlined dense :class="{
              'bg-red-1': isWarningRealisasi,
              'shake': isWarningRealisasi
            }" />
          <!-- <div v-if="isWarningRealisasi" class="col" style="height: 10px">
            <q-banner dense rounded class="bg-red text-white" style="height: 10px">
              ⚠ Total Baru tidak boleh lebih kecil dari Realisasi
            </q-banner>
          </div> -->
        </div>

        <div class="col-3 q-pa-sm q-gutter-y-md">
          <app-input-simrs label="Realisasi" :model-value="formattanpaRp(store.form.realisasi || 0)" :disable="true"
            outlined dense :valid="{ number: true }" :autofocus="false" />
        </div>

      </div>
      <div class="row items-center q-pl-sm q-gutter-y-md">
        <app-btn label="Simpan Rincian" class="bg-black" type="submit" :disable="store.loading || isWarningRealisasi"
          :loading="store.loadingSave" />
      </div>
    </div>
  </q-form>
  <transition name="fade">
    <div v-if="isWarningRealisasi" class="warning-floating">
      ⚠ Total Baru tidak boleh lebih kecil dari Realisasi
    </div>
  </transition>
</template>
<script setup>
import { notifErrVue } from 'src/modules/utils';
import { dataBastFarmasiStore } from 'src/stores/siasik/transaksi/ls/newnpdls/bastfarmasi';
import { formInputNpdlsStore } from 'src/stores/siasik/transaksi/ls/newnpdls/formnpdls';
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { formattanpaRp } from 'src/modules/formatter'
import { api } from 'src/boot/axios';
import { usePergeseranAnggaranStore } from 'src/stores/siasik/anggaran/pergeseran/pergeseranrincian';
// const FormInputPajak = defineAsyncComponent(() => import('./formpajak/FormPajak.vue'))


const store = usePergeseranAnggaranStore()
const carisrt = dataBastFarmasiStore()
const satuan = ref(null)
const options = ref([])
const options108 = ref([])
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
  store.form.nousulan = ''
  store.form.usulan = ''
  store.form.idpp = ''
  store.form.koders = ''
  store.form.satuan = ''
  store.form.volume = 0
  store.form.harga = 0
  store.form.nilai = 0
  store.form.volumebaru = 0
  store.form.hargabaru = 0
  store.form.totalbaru = 0
  store.form.jumlahacc = 0
  store.form.koderek50 = ''
  store.form.koderek108 = ''
  store.form.uraian50 = ''
  store.form.uraian108 = ''
  store.form.tmp_kode50 = ''
  store.form.tmp_kode108 = ''

  // optionsBarangs.value = []
}

function updateBarang(val) {
  store.form.nousulan = ''
  store.form.idpp = ''
  store.form.koders = ''
  store.form.satuan = ''
  store.form.volume = 0
  store.form.harga = 0
  store.form.nilai = 0
  store.form.volumebaru = 0
  store.form.hargabaru = 0
  store.form.totalbaru = 0
  store.form.jumlahacc = 0
  store.form.koderek50 = ''
  store.form.koderek108 = ''
  store.form.uraian50 = ''
  store.form.uraian108 = ''
  store.form.tmp_kode50 = ''
  store.form.tmp_kode108 = ''
  const data = optionsBarangs.value.find(x => x.value === val)
  // console.log('data items', data)
  if (!data) return
  store.form.usulan = data?.nama ? data?.nama || '' : data?.uraian108 || ''
  store.form.koders = data?.kode ? data?.kode || '' : data?.kode108 || ''
  store.form.koderek50 = data?.kode_50 ? data?.kode_50 || '' : data?.kode50 || ''
  store.form.koderek108 = data?.kode_108 ? data?.kode_108 || '' : data?.kode108 || ''
  store.form.uraian50 = data?.uraian_50 ? data?.uraian_50 || '' : data?.uraian50 || ''
  store.form.uraian108 = data?.uraian_108 ? data?.uraian_108 || '' : data?.uraian108 || ''
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
  if (val > 1) store.form.volumebaru = _removedZeros
  store.form.totalbaru = parseInt(store.form.hargabaru) * parseInt(val)
  store.form.jumlahacc = 0
}
function updateHarga(val) {
  const _removedZeros = val.replace(/^0+/, '')
  if (val > 1) store.form.hargabaru = _removedZeros
  store.form.totalbaru = parseInt(store.form.volumebaru) * parseInt(val)
  store.form.jumlahacc = 0
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


async function filterFn(val, update) {
  if (!val || val.length < 2) {
    update(() => {
      options.value = []
    })
    return
  }

  try {
    const resp = await api.get('v1/anggaran/penyusunan/prioritas/getrekening', {
      params: {
        q: val,
        per_page: 20 // kecil saja
      }
    })
    // console.log('rekening', resp)
    const data = resp.data.data || []

    update(() => {
      options.value = data.map(a => ({
        ...a,
        label: `${a.kodeall2} - ${a.uraian}`,
        value: a.kodeall2
      }))
    })

  } catch (e) {
    console.error(e)
    update(() => {
      options.value = []
    })
  }
}
const isWarningRealisasi = computed(() => {
  const total = Number(store.form.totalbaru || 0)
  const realisasi = Number(store.form.realisasi || 0)

  return total < realisasi
})
function saveData() {
  if (isWarningRealisasi.value) {
    notifErrVue('Total Baru tidak boleh lebih kecil dari Realisasi')
    return
  }

  store.simpanData()
  store.disableSaved = true
  console.log('saved setlah simpan', store.form)
}

// watch(
//   () => store.form.jenis,
//   (val) => {
//     if (!val) return

//     store.params.jenis = val
//   }
// )
</script>
<style>
.warning-floating {
  position: fixed;
  top: 0px;
  right: 20px;
  z-index: 9999;

  background: #c10015;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, .25);
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.shake {
  animation: shake 0.3s;
}

@keyframes shake {
  25% {
    transform: translateX(3px);
  }

  75% {
    transform: translateX(-3px);
  }
}
</style>
