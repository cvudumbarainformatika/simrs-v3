<template>
  <q-toolbar>
    <q-btn flat dense icon="icon-mat-sort" @click="emits('toggleLeftDrawer')" />
    <q-toolbar-title class="f-14">
      <div class="row items-center q-gutter-md">
        <div class="col-3">
          <q-btn color="primary" class="q-pl-xs" flat>
            <div class="row items-center no-wrap q-gutter-sm text-white">
              <q-avatar size="30px">
                <img :src="getImageDokter(pasien?.datasimpeg?.kelamin, pasien?.datasimpeg)">
              </q-avatar>
              <div class="column f-12">
                <div>
                  DPJP | {{ pasien?.datasimpeg?.nama }}
                </div>
              </div>
            </div>
          </q-btn>
        </div>
        <q-separator vertical color="orange" class="q-ml-sm" />
        <div class="col-3">
          <q-btn color="primary" class="q-pl-xs" flat>
            <div class="row items-center no-wrap q-gutter-sm text-white">
              <div class="column f-12">
                <div>
                  <q-badge color="lime-12" text-color="dark" class="text-bold">
                    Sistem Bayar : {{ pasien?.sistembayar }}
                  </q-badge>
                </div>
              </div>
            </div>
          </q-btn>
        </div>
      </div>
    </q-toolbar-title>
    <!-- <div v-if="pasien?.dokter !== ''">
      <q-btn v-if="pasien?.flagpelayanan === '' || pasien?.flagpelayanan === '2'" label="selesaikan layanan"
        color="negative" class="q-mr-lg q-px-lg" dense :loading="loadingFinish" :disable="loadingFinish"
        @click="selesaikanLayanan" />
      <q-btn v-else-if="pasien?.status === '3'" label="LAYANAN TELAH BATAL" color="negative" class="q-mr-lg q-px-lg"
        dense />
      <q-btn v-else label="SUDAH DILAYANI" color="white" class="q-mr-lg q-px-lg" dense outline disable />
    </div> -->
    <q-btn v-close-popup dense flat icon="icon-mat-close" :disable="store.loading || store.loadingObat">
      <q-tooltip class="bg-white text-primary">
        Close
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script setup>
import { usePermintaanEResepStore } from 'src/stores/simrs/farmasi/permintaanresep/eresep'

const store = usePermintaanEResepStore()

const emits = defineEmits(['toggleLeftDrawer'])
defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
function getImageDokter(kelamin, row) {
  if (row?.foto === null || row?.foto === '' || row?.foto === 'undefined' || row?.foto === undefined || row.kddpjp === null) {
    return kelamin === 'Perempuan'
      ? new URL('../../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../../assets/images/user-avatar.svg', import.meta.url).href
  }
  else {
    return 'http://192.168.100.100/simpeg/foto/' + row.nip + '/' + row.foto
  }
}

</script>
