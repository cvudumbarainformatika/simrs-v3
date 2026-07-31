<template>
  <q-dialog v-model="model" persistent>
    <q-card class="col">

      <!-- HEADER -->
      <q-card-section class="row items-center bg-grey-2">
        <div class="text-weight-bold text-subtitle1">
          Pilih Rincian Pengusulan
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <!-- BODY -->
      <q-card-section class="q-pa-none">
        <q-list bordered separator>

          <q-item v-for="item in rincianByKegiatan" :key="item.id" class="q-px-md q-my-sm">
            <q-item-section>
              <div class="row justify-beetwen">
                <div class="col">
                  <div class="row items-center q-mb-xs">
                    <div class="text-weight-bold">
                      {{ item.keterangan }}
                    </div>
                    <q-space />
                  </div>

                  <!-- INFO -->
                  <div class="text-caption q-mb-xs">
                    Volume {{ item.volume }} {{ item.satuan }}
                    • Harga {{ formatRpDouble(item.harga) }}
                    • Pagu {{ formatRpDouble(item.nilai) }}
                  </div>
                </div>

              </div>
              <!-- HEADER ITEM -->



              <!-- FORM ROW -->
              <div class="row q-col-gutter-sm items-start">

                <!-- KODE 50 -->
                <div class="col-4">
                  <template v-if="item.koderek50">
                    <q-input dense outlined label="Rekening" :model-value="item.uraian50" readonly />
                  </template>
                  <template v-else>
                    <q-select v-model="item.tmp_kode50" use-input outlined standout="bg-yellow-3" dense emit-value
                      map-options option-value="kodeall2" input-debounce="800" label="Pilih Kode Rekening"
                      :options="options" :option-label="opt => opt?.kodeall2 ? `${opt.kodeall2} - ${opt.uraian}` : ''"
                      clearable :disable="store.loading" :loading="store.loading" @filter="filterFn"
                      @update:model-value="(val) => {
                        const arr = options || []
                        const cari = arr.find(x => x.kodeall2 === val)
                        item.tmp_uraian50 = cari ? cari.uraian : ''

                        item.opsi108 = cari?.rekening108 || []
                        if (!item.opsi108.length) {
                          // tidak ada rekening 108
                          item.koderek108 = ' '
                          item.uraian108 = ' '
                        } else {
                          // reset kalau sebelumnya sudah terisi
                          item.koderek108 = null
                          item.uraian108 = null
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

                <!-- KODE 108 -->
                <div class="col-4">
                  <template v-if="item.koderek108 !== null">
                    <q-input dense outlined label="Kode Rekening 108" :model-value="item.uraian108" readonly />
                  </template>
                  <template v-else>
                    <q-select v-model="item.tmp_kode108" :options="item.opsi108 || []" dense outlined emit-value
                      map-options option-value="kode108" :option-label="opt => `${opt.kode108} - ${opt.uraian108}`"
                      label="Pilih Kode Rekening 108" @update:model-value="(val) => {
                        const cari = (item.opsi108 || []).find(x => x.kode108 === val)
                        item.tmp_uraian108 = cari?.uraian108 || ''
                      }" />
                  </template>
                </div>

                <!-- JUMLAH ACC -->
                <div class="col-4">
                  <div class="row q-gutter-sm">
                    <q-input dense outlined label="Realisasi" :model-value="formattanpaRp(item.total_realisasi)"
                      readonly />
                    <q-input dense outlined label="Sisa Pagu" :model-value="formattanpaRp(item.sisapagu)" readonly />
                    <!-- <q-input dense outlined type="number" label="Jumlah ACC" style="width:70%"
                      v-model.number="item.tmp_jumlahacc" :rules="[val => !!val || 'Harap Diisi terlebih dahulu']" /> -->

                  </div>
                </div>

                <div class="col-12">
                  <div class="row q-col-gutter-sm">
                    <app-input-simrs class="col-3" label="Volume Baru" v-model="item.tmp_volumebaru"
                      :disable="store.disabled" outlined dense :valid="{ number: true }"
                      @update:model-value="val => updateVolume(item, val)" />
                    <app-input-simrs class="col-3" label="Harga Baru" v-model="item.tmp_hargabaru"
                      :disable="store.disabled" outlined dense :valid="{ number: true }"
                      @update:model-value="val => updateHarga(item, val)" />
                    <app-input-simrs class="col-3" label="Total Baru" readonly
                      :model-value="formattanpaRp(item.tmp_totalbaru || 0)" :disable="store.disabled" outlined dense />
                    <div class="justify-center q-pl-sm q-pt-md">
                      <q-btn color="primary" type="button" size="sm" round dense icon="check"
                        :disable="!validItem(item) || store.loadingSave || !item.tmp_totalbaru"
                        :loading="item.loadingSave" @click="tetapkan(item)">
                        <q-tooltip>
                          Simpan Rincian
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>

          <!-- EMPTY STATE -->
          <q-item v-if="!rincianByKegiatan.length">
            <q-item-section class="text-grey text-center q-pa-md">
              Tidak ada rincian yang bisa dipilih
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>



<script setup>
import { computed, ref, watch } from 'vue'
import { usePrioritasAnggaranStore } from
  'src/stores/siasik/anggaran/penyusunan/penyesuaianprioritas'
import { formatRpDouble, formattanpaRp } from 'src/modules/formatter'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { usePerubahanAnggaranBelanja_PAK } from 'src/stores/siasik/anggaran/perubahan/anggaranbelanja'

const props = defineProps({
  modelValue: Boolean
})
const options = ref([])
const emit = defineEmits(['update:modelValue'])

const store = usePerubahanAnggaranBelanja_PAK()

/* dialog v-model */
const model = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})


function updateVolume(item, val) {
  const volume = Number(String(val || '0').replace(/^0+/, '')) || 0

  item.tmp_volumebaru = volume
  item.tmp_totalbaru =
    volume * Number(item.tmp_hargabaru || 0)
}

function updateHarga(item, val) {
  const harga = Number(String(val || '0').replace(/^0+/, '')) || 0

  item.tmp_hargabaru = harga
  item.tmp_totalbaru =
    Number(item.tmp_volumebaru || 0) * harga
}

/* filter rincian yg belum dipakai */
const rincianByKegiatan = computed(() => {
  if (!store.form.kodeKegiatan) return []
  const all = Array.isArray(store.dataBarangslama) ? store.dataBarangslama : []
  const used = Array.isArray(store.rincians) ? store.rincians : []
  console.log('all', all)
  console.log('all used', used)
  const usedKode = new Set(
    used
      .map(r => r.kode)
      .filter(Boolean)
  )

  // tampilkan hanya yang BELUM dipakai
  return all.filter(r => !usedKode.has(r.kode))
})

/* validasi tombol */
const validItem = (item) => {
  return (
    item.tmp_kode50 ||
    (item.tmp_kode108 || item.koderek108 === ' ') ||
    item.tmp_totalbaru > 0
  )
}

const $q = useQuasar()
/* simpan */
const tetapkan = async (item) => {
  console.log('item xxx', item)
  item.loadingSave = true
  item.koderek50 = item.tmp_kode50 || item.koderek50
  item.uraian50 = item.tmp_uraian50 || item.uraian50
  item.koderek108 = item.tmp_kode108 || item.koderek108
  item.uraian108 = item.tmp_uraian108 || item.uraian108
  // item.jumlahacc = item.tmp_jumlahacc
  item.volumebaru = item.tmp_volumebaru
  item.hargabaru = item.tmp_hargabaru
  item.totalbaru = item.tmp_totalbaru

  store.form.keterangan = item.keterangan
  store.form.volume = item.volumebaru
  store.form.harga = item.hargabaru
  store.form.nilai = item.totalbaru
  store.form.satuan = item.satuan

  store.form.koderek50 = item.koderek50
  store.form.uraian50 = item.uraian50
  store.form.koderek108 = item.koderek108
  store.form.uraian108 = item.uraian108
  store.form.jenis = item.jenis
  // store.form.jumlahacc = item.jumlahacc
  store.form.idpp = item.idpp
  store.form.kode = item.kode


  store.form.realisasi = item.total_realisasi
  store.form.sisaanggaran = item.sisapagu
  store.form.paguterakhir = item.pagu
  store.form.npdbelumcair = 0
  store.form.pagualokasi = item.sisapagu

  // store.form.nousulan = item.notrans

  const nilaiLama = store.rincians
    ?.reduce((sum, r) => sum + Number(r.nilai || 0), 0)

  const nilaiBaru = Number(item.volumebaru || 0) * Number(item.hargabaru || 0)
  const realisasi = Number(item.total_realisasi || 0)
  // console.log('pagu', realisasi)
  // console.log('baru', nilaiBaru)
  if (nilaiLama + nilaiBaru < realisasi) {
    $q.notify({
      type: 'negative',
      message: 'Total Baru yang diinput kurang dari Realisasi'
    })
    item.loadingSave = false
    return
  }
  console.log('foooormssss', store.form)

  await store.simpanData()


  delete item.tmp_kode50
  delete item.tmp_uraian50
  delete item.tmp_kode108
  delete item.tmp_uraian108
  delete item.tmp_hargabaru
  delete item.tmp_volumebaru
  delete item.tmp_totalbaru


  store.disableSaved = true
  item.loadingSave = false
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
    console.log('rekening', resp)
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

watch(
  () => store.getRincian,
  (val) => {
    // debugging
    console.log('Rincian dialog update:', val?.length)
  },
  { immediate: true }
)
</script>
