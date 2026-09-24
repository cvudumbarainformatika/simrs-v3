<template>
  <q-toolbar>
    <q-btn flat dense icon="icon-mat-sort" @click="emits('toggleLeftDrawer')" />
    <q-toolbar-title class="f-14">
      <div class="row items-center q-gutter-md">
        <div class="col-auto">
          <div class="row items-center no-wrap q-gutter-sm text-white">
            <q-avatar size="30px">
              <img :src="getImageDokter(pasien?.datasimpeg?.kelamin, pasien?.datasimpeg)">
            </q-avatar>
            <div class="column f-12">
              <div>
                DPJP: <span class="text-weight-bold">{{ pasien?.dokter || pasien?.datasimpeg?.nama || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        <q-separator vertical color="orange" class="q-ml-sm" />
        <div class="col-auto">
          <div class="row items-center no-wrap q-gutter-sm text-white">
            <div class="column f-12">
              <div class="row items-center q-gutter-xs">
                <q-badge color="lime-12" text-color="dark" class="text-bold">
                  Sistem Bayar : {{ pasien?.sistembayar ?? '-' }}
                </q-badge>
                <q-badge color="cyan-10" text-color="white" class="text-bold q-ml-xs">
                  Ruangan : {{ pasien?.ruangan || pasien?.poli || '-' }}
                </q-badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-toolbar-title>

    <q-btn v-close-popup dense flat icon="icon-mat-close">
      <q-tooltip class="bg-white text-primary">
        Tutup
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script setup>
const emits = defineEmits(['toggleLeftDrawer'])
defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

function getImageDokter(kelamin, row) {
  if (row?.foto === null || row?.foto === '' || row?.foto === 'undefined' || row?.foto === undefined || row?.kddpjp === null) {
    return kelamin === 'Perempuan'
      ? new URL('../../../../../assets/images/actress.svg', import.meta.url).href
      : new URL('../../../../../assets/images/user-avatar.svg', import.meta.url).href
  } else {
    return 'http://192.168.100.100/simpeg/foto/' + row.nip + '/' + row.foto
  }
}
</script>
