<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <q-icon name="icon-my-file_sign" size="24px" color="primary" />
          <div class="text-subtitle2 text-bold text-primary">
            {{ menu?.title || 'LEMBAR KONSULTASI SPESIALIS' }}
          </div>
          <q-badge v-if="hasData" color="primary" outline class="q-ml-sm">
            {{ listKonsul.length }} Konsultasi Tercatat
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="hasData">
          <q-btn
            v-print="printObj"
            color="primary"
            icon="icon-mat-print"
            label="Cetak Dokumen"
            no-caps
            dense
            class="q-px-md text-weight-bold btn-print"
          />
        </div>
      </div>
    </div>

    <!-- Container Preview Dokumen -->
    <div class="col full-height scroll q-py-md q-px-md flex flex-center bg-grey-4">
      <div
        id="print-konsul-doc"
        class="bg-white print-area q-pa-none shadow-3 text-black"
        style="width: 210mm; min-height: 297mm; box-sizing: border-box;"
      >
        <DokPage
          :pasien="pasien"
          :menu="menu"
          :data-header="dataHeader"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const DokPage = defineAsyncComponent(() => import('./DokPage.vue'))

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: null
  }
})

const listKonsul = computed(() => {
  return props?.pasien?.konsultasi || []
})

const hasData = computed(() => {
  return listKonsul.value.length > 0
})

const printObj = {
  id: 'print-konsul-doc',
  popTitle: 'Lembar Konsultasi Dokter Spesialis'
}
</script>

<style lang="scss" scoped>
.print-area {
  max-width: 100%;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
