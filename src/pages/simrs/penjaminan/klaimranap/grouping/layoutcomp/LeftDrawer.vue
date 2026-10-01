<template>
  <div class="fit column no-wrap bg-white">
    <!-- Profil Pasien (Header Box) -->
    <div class="col-auto bg-dark text-white q-pa-sm shadow-1">
      <div class="row items-center justify-between q-mb-xs">
        <q-badge outline color="orange" :label="pasien?.sistembayar || '-'" class="f-10" />
        <q-badge outline color="cyan" :label="pasien?.ruangan || pasien?.poli || 'RANAP'" class="f-10" />
      </div>

      <div class="row items-center q-col-gutter-sm q-py-xs">
        <div class="col-auto">
          <app-avatar-pasien :key="pasien?.noreg" :pasien="pasien" width="46px" />
        </div>
        <div class="col" style="min-width: 0;">
          <div class="text-weight-bold f-12 ellipsis text-white" :title="pasien?.pasien">
            {{ pasien?.pasien ?? '-' }}
          </div>
          <div class="text-teal text-weight-bold f-11 ellipsis">
            {{ pasien ? pasien.noreg : '-' }} || {{ pasien?.norm ?? '-' }}
          </div>
          <div class="text-yellow text-italic f-10">
            {{ pasien?.usia ?? '-' }}
          </div>
        </div>
      </div>

      <div class="row items-center justify-between q-mt-xs q-pt-xs border-top-dark">
        <div class="text-grey-4 f-10 ellipsis" style="max-width: 150px;">
          DPJP: <span class="text-white text-weight-medium">{{ pasien?.dokter ?? '-' }}</span>
        </div>
        <q-btn
          dense
          flat
          size="sm"
          color="white"
          icon="icon-mat-history"
          @click="emits('historyPasien')"
        >
          <q-tooltip class="bg-dark text-white">
            History Pasien
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- List Menu Navigasi (Flex natural, tidak tumpang tindih dan tanpa scroll aneh) -->
    <div class="col-grow bg-grey-1">
      <list-menu
        :menus="menus"
        :menu="menu"
        @menu-click="(val) => emits('clickMenu', val)"
      />
    </div>
  </div>
</template>

<script setup>
import ListMenu from './ListMenu.vue'

const emits = defineEmits(['clickMenu', 'historyPasien'])

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menus: {
    type: Array,
    default: () => []
  },
  menu: {
    type: Object,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.border-top-dark {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}
</style>
