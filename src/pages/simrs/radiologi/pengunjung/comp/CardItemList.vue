<template>
  <q-item v-ripple clickable class="q-my-lg bg-white shadow-q relative-position">
    <q-card :class="`absolute text-grey-3 q-py-xs q-px-sm ${item?.status === '1' ? 'bg-teal' : 'bg-deep-orange-8'}`"
      style="top:-15px; left: 0;">
      <div class="f-10">
        {{ item?.status === '1' ? 'Terlayani' :
          item?.status === '2' ? 'Proses ...' :
            item?.status === '3' ? 'Dibatalkan' : 'Belum terlayani'
        }}
      </div>
    </q-card>
    <div class="row items-center full-width">
      <div class="col-6">
        <div class="row fit q-pa-none items-center q-col-gutter-md">
          <div class="col-auto">
            <q-avatar size="40px">
              <app-avatar-pasien :pasien="item" width="40px" />
            </q-avatar>
          </div>
          <div class="col full-width flex wrap ellipsis">
            <div class="full-width ellipsis">
              {{ item?.nama }}
            </div>
            <div class="full-width q-pt-xs">
              <div> <b>No. RM :</b> <span class="text-primary">{{ item?.norm }}</span></div>
            </div>
            <div class="full-width q-pt-xs">
              <div> <b>No. REG :</b> <span class="text-grey-8">{{ item?.noreg }}</span></div>
            </div>
            <div class="ellipsis text-grey-8 q-pt-xs">
              Alamat : <i>{{ item?.alamat }}</i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="row items-center full-width q-col-gutter-md">
          <div class="col-3 ">
            <div class="q-pt-sm">
              {{ item?.sistembayar }}
            </div>
          </div>
          <div class="col full-width flex wrap ellipsis">
            <div class="f-10">
              {{ item.nota_permintaan ? 'Permintaan dari' : 'Pendaftaran' }}
            </div>
            <div class="full-width ellipsis">
              <span class="text-primary">{{ item?.ruangan }}</span>
            </div>
          </div>
          <div class="col-2 flex justify-end">
            <div class="" style="margin-top: -30px;">
              <div class="text-grey-8 f-12">
                {{ date.formatDate(item?.tgl_kunjungan, 'MMM DD, YYYY') }}
              </div>
              <div class="text-grey-6 f-10">
                Jam : <b> {{ date.formatDate(item?.tgl_kunjungan, 'HH:mm') }}</b>
              </div>
            </div>
          </div>
        </div>


        <div class="absolute-bottom-right q-pa-sm">
          <div v-if="item?.status === ''" class="flex q-gutter-lg">
            <q-btn :loading="loadingBatal && idClick === item.nota_permintaan"
              :disable="loadingBatal && idClick === item.nota_permintaan" rounded size="sm" label="Batalkan"
              color="negative" @click="bataalkanPasien(item)"></q-btn>
            <q-btn :loading="loadingTerima && idClick === item.nota_permintaan"
              :disable="loadingTerima && idClick === item.nota_permintaan" rounded size="sm" label="Terima"
              color="primary" @click="terimaPasien(item)"></q-btn>
          </div>
          <div v-else-if="item?.status !== '' && item?.status !== '3'" class="flex q-gutter-lg">
            <q-btn rounded outline size="sm" color="primary" label="Lihat Layanan"
              @click="emits('details', item)"></q-btn>
          </div>
          <div v-else-if="item?.status === '3'" class="flex q-gutter-lg">
            <q-btn disable rounded outline size="sm" color="primary" label="DIBATALKAN"></q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-item>
</template>

<script setup>
import { ref } from 'vue'
import { date } from 'quasar'

defineProps({
  item: {
    type: Object,
    default: null
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  loadingBatal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['details', 'terima', 'batal'])

const idClick = ref(null)

function terimaPasien(item) {
  idClick.value = item.nota_permintaan
  // console.log('terima pasien', item);

  emits('terima', item)
}

function bataalkanPasien(item) {
  // console.log('batal pasien', item);
  idClick.value = item.nota_permintaan
  emits('batal', item)
}
</script>

<style lang="scss" scoped></style>
