<template>
  <div class="column full-height">
    <q-bar class="col-auto bg-dark text-white">
      <div class="q-py-sm f-14 ">
        Form Order Radiologi
      </div>
    </q-bar>
    <div class="col full-height">
      <q-scroll-area style="height: calc(100% - 1px);">
        <q-form ref="formRef" class="row q-pa-md q-col-gutter-xs" @submit="saveOrderRadiologi">
          <div class="col-12">
            <q-input v-model="store.form.permintaan" label="Permintaan" autogrow outlined standout="bg-yellow-3"
              icon="icon-mat-search" :rules="[val => !!val || 'Harap cari pemeriksaan dahulu']" lazy-rules="ondemand"
              hide-bottom-space @click="modalOpen = true" />
          </div>
          <q-card flat borderred v-if="store.form.items?.length" class="col-12 overflow-hidden">
            <q-list dark borderred separator flat rounded class="cursor-pointer">
              <div class="bg-grey text-white q-pa-sm">
                <div class="text-weight-bold">List Permintaan</div>
              </div>
              <q-item v-for="(item, i) in store.form.items" class="bg-grey-9 text-white">
                <q-item-section>
                  <q-item-label>
                    {{ item.nama }} ({{ item.group }})
                    <em class="text-negative f-10 q-ml-sm"> - ({{ item.group }})</em>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="icon-mat-close" size="xs" @click="store.hapusFormItems(item)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
          <div class="col-6">
            <q-input v-model="store.form.diagnosakerja" label="Diagnosa Masalah" autogrow outlined
              standout="bg-yellow-3" icon="icon-mat-search" />
          </div>
          <div class="col-6">
            <q-input v-model="store.form.catatanpermintaan" label="Catatan / Keteragan" autogrow outlined
              standout="bg-yellow-3" icon="icon-mat-search" />
          </div>

          <div v-if="unit === 'ranap'" class="col-12">
            <app-autocomplete-new ref="refPerawat" :model="store.form.kodedokter" label="Dokter yg meminta"
              autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined :source="store.dokters"
              @on-select="(val) => {
                store.form.kodedokter = val
                const ceck = store.dokters.find(item => item.kdpegsimrs === val) ?? null
              }" />
          </div>

          <div class="col-12">
            <q-separator class="q-my-sm" />
          </div>
          <div class="col-12">
            <div class="flex items-center">
              <div class="q-mr-md">
                Pasien Hamil ?
              </div>
              <div class="q-gutter-sm">
                <q-radio v-model="store.form.statuskehamilan" val="Tidak" label="Tidak" size="sm" dense />
                <q-radio v-model="store.form.statuskehamilan" val="Iya" label="Iya" size="sm" dense />
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="flex items-center">
              <div class="q-mr-md">
                Pasien Alergi Terhadap Bahan kontras ?
              </div>
              <div class="q-gutter-sm">
                <q-radio v-model="store.form.statusalergipasien" val="Tidak" label="Tidak" size="sm" dense />
                <q-radio v-model="store.form.statusalergipasien" val="Iya" label="Iya" size="sm" dense />
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="flex items-center">
              <div class="q-mr-md">
                Cito ?
              </div>
              <div class="q-gutter-sm">
                <q-radio v-model="store.form.cito" val="Tidak" label="Tidak" size="sm" dense />
                <q-radio v-model="store.form.cito" val="Iya" label="Iya" size="sm" dense />
              </div>
            </div>
          </div>
          <div class="col-12">
            <q-separator class="q-my-sm" />
          </div>
          <div class="col-12">
            <div class="text-right">
              <q-btn label="Simpan & Kirim Permintaan" type="submit" color="primary" :loading="store.loadingSave"
                :disable="store.loadingSave" />
            </div>
          </div>
        </q-form>
      </q-scroll-area>
    </div>

    <!-- modal -->
    <ModalPermintaan v-model="modalOpen" :lists="store.namaPemeriksaans" :pasien="props.pasien"
      @ok="(val) => pilihPermintaan(val)" />
  </div>
</template>

<script setup>
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import ModalPermintaan from './ModalPermintaan.vue'
import { onMounted, ref } from 'vue'

const store = useRadiologiPoli()
const modalOpen = ref(false)
const formRef = ref()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  unit: {
    type: String,
    default: null
  }
})

// console.log('props', props?.pasien)

function pilihPermintaan(val) {
  store.mappingArrayItems(val)
  modalOpen.value = false
}

function saveOrderRadiologi() {
  const isRanap = props?.unit === 'ranap'
  store.saveRadiologi(props.pasien, isRanap).then(() => {
    formRef.value.resetValidation()
  })
}
onMounted(() => {
  formRef.value.resetValidation()
})
</script>
