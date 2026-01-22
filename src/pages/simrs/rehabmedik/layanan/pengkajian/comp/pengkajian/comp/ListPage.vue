<template>
  <q-card flat bordered square class="full-height bg-teal-2" style="overflow: hidden;">
    <q-bar class="bg-teal text-white z-top" style="width: inherit;">
      <div class="f-12">
        Data Tersimpan
      </div>
      <q-space />
    </q-bar>
    <q-card-section style="padding:0" class="full-height bg-grey">
      <div v-if="props.loadingTerima" class="column full-height flex-center">
        <div class="text-white">
          Harap Tunggu .....
        </div>
        <div class="text-white">
          Sinkron Data Ke DATABASE
        </div>
      </div>
      <div v-if="pasien?.pengkajian?.length <= 0" class="column full-height flex-center">
        <div class="text-white">
          Belum Ada data tersimpan
        </div>
      </div>
      <q-scroll-area v-else style="height:calc(100% - 32px);">
        <q-list class="">
          <transition-group name="list">
            <q-item v-for="(item, n) in lists" :key="n" class="list-move q-mb-sm bg-white">
              <q-item-section>
                <q-item-label class="f-12">
                  <span class="">Keluhan Utama </span> : <span class="text-weight-bold">{{ item?.keluhan_utama || '-'
                  }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="">Riwayat Penyakit (Sekarang) </span> : <span class="text-weight-bold">{{
                    item?.riwayat_penyakit_sekarang || '-' }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="">Riwayat Penyakit Dahulu </span> : <span class="text-weight-bold">{{
                    item?.riwayat_penyakit_dahulu || '-' }}</span>
                </q-item-label>


                <q-separator class="q-my-md" />
                <q-item-label>
                  <span class="text-weight-bold">Pemeriksaan Fisik</span>
                </q-item-label>
                <q-item-label>
                  <span class="">- Keadaan Umum : <b>{{ item?.keadaan_umum || '-' }}</b></span>
                  <div class="q-my-xs">
                    - VAS : <b>{{ item?.vas || '-' }}</b>
                  </div>
                  <div>- Neurologis : <em>{{ item?.neurologis || '-' }}</em> </div>
                  <div>- Muskuloskeletal : <em>{{ item?.muskuloskeletal || '-' }}</em> </div>
                  <div>- Pencitraan : <em>{{ item?.pencitraan || '-' }}</em> </div>
                  <div>- Lain-lain : <em>{{ item?.lain_lain || '-' }}</em> </div>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-bold">Diagnosis Fungsional</span>
                </q-item-label>
                <q-item-label>
                  <div v-for="(d, i) in item?.diagnosis_fungsional" :key="i">
                    <div> - {{ d }}</div>
                  </div>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-bold">Problem Rehabilitasi Medik</span>
                </q-item-label>
                <q-item-label>
                  <div v-for="(p, k) in item?.problem_rehabilitasimedik" :key="k">
                    <div> - {{ p || '-' }}</div>

                  </div>
                  <div v-if="item?.problem_rehabilitasimedik_lain">
                    - {{ item?.problem_rehabilitasimedik_lain }}
                  </div>
                </q-item-label>
              </q-item-section>
              <q-separator class="q-my-md" />
              <div class="absolute-bottom-right q-pa-sm">
                <div class="q-gutter-sm">
                  <q-btn flat round size="sm" icon="icon-mat-edit" @click="store.setItem(item)" />
                  <q-btn flat round size="sm" icon="icon-mat-delete" color="negative" @click="hapusItem(item.id)" />
                </div>
              </div>
            </q-item>
          </transition-group>
          <q-separator />
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { notifSuccessVue } from 'src/modules/utils'
import { useRehabmedikPengkajianStore } from 'src/stores/simrs/pelayanan/rehabmedik/pengkajian'
import { computed } from 'vue'
const $q = useQuasar()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  storeKunjungan: {
    type: Object,
    default: null
  },
  loadingTerima: {
    type: Boolean,
    default: false
  }
})

const store = useRehabmedikPengkajianStore()

const lists = computed(() => {
  const arr = props.pasien?.pengkajian
  // console.log('arr', arr)

  return arr?.sort((a, b) => { return b.id - a.id })
})

function hapusItem(id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    // console.log('OK')
    // props.storeKunjungan.deleteData(props.pasien, id)
    deleteData(id)
  }).onCancel(() => {
    // console.log('Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

async function deleteData(id) {

  const payload = {
    id
  }
  try {
    const resp = await api.post(`v1/simrs/rehabmedik/pengkajian/delete`, payload)
    if (resp.status === 200) {
      props.storeKunjungan.hapusDataInjectan(props.pasien?.noreg, id, 'pengkajian')
      store.setItem(null)
      notifSuccessVue('Data berhasil dihapus')
    }
  }
  catch (error) {
    console.log('error', error);

  }
}


</script>
