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
      <div v-if="lists?.length <= 0" class="column full-height flex-center">
        <div class="text-white">
          Belum Ada data tersimpan
        </div>
      </div>
      <q-scroll-area v-else style="height:calc(100% - 32px);">
        <q-list class="">
          <transition-group name="list">
            <q-item v-for="(item, n) in lists" :key="n" class="list-move q-mb-sm bg-white">
              <q-item-section class="q-pb-xl">
                <q-item-label class="f-12">
                  <span class="">Subjective </span> : <span class="text-weight-bold">{{ item?.subjective || '-'
                  }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="">Objective </span> : <span class="text-weight-bold">{{
                    item?.objective || '-' }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="">Asessment </span> : <span class="text-weight-bold">{{
                    item?.asessment || '-' }}</span>
                </q-item-label>


                <q-separator class="q-my-sm" />
                <q-item-label>
                  <span class="text-weight-bold">Planning</span>
                </q-item-label>
                <q-item-label>
                  <span class="">a. Goal of Treatment : <b>{{ item?.goal || '-' }}</b></span>
                  <div class="q-my-xs">
                    b. Tindakan Program Rehabmedik : <b>{{ item?.tindakan || '-' }}</b>
                  </div>
                  <div>c. Edukasi : <em>{{ item?.edukasi || '-' }}</em> </div>
                  <div>d. Frekuensi : <em>{{ item?.frek || '-' }}</em> </div>

                </q-item-label>

                <q-separator class="q-my-sm" />
                <q-item-label>
                  <span>Rencana Tindak Lanjut : <b> {{ item?.rencana || '-' }}</b></span>
                </q-item-label>
                <q-item-label>
                  <span>Procedure : <b> {{ item?.procedure || '-' }}</b></span>
                </q-item-label>
                <q-separator class="q-my-md" />
                <q-item-label>
                  <em>By {{ item?.petugas?.nama || '-' }}</em>
                </q-item-label>


              </q-item-section>
              <div class="absolute-bottom-right q-pa-sm">
                <div class="q-gutter-sm">
                  <q-btn flat round size="sm" icon="icon-mat-edit" @click="setItem(item)" />
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
import { useRehabmedikSoapStore } from 'src/stores/simrs/pelayanan/rehabmedik/soap'
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
  },
  isDokter: {
    type: Boolean,
    default: false
  }
})

const store = useRehabmedikSoapStore()

const lists = computed(() => {
  const arr = props.pasien?.soap
  const res = props.isDokter ? arr?.filter(item => item?.nakes === '1') : arr?.filter(item => item?.nakes !== '1')
  // console.log('arr', arr)

  return res?.sort((a, b) => { return b.id - a.id })
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
    const resp = await api.post(`v1/simrs/rehabmedik/soap/delete`, payload)
    if (resp.status === 200) {
      props.storeKunjungan.hapusDataInjectan(props.pasien?.noreg, id, 'soap')
      store.setItem(null)
      notifSuccessVue('Data berhasil dihapus')
    }
  }
  catch (error) {
    console.log('error', error);

  }
}

function setItem(item) {
  // console.log(item);

  store.setItem(item)
}


</script>
