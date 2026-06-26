<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-teal">INFORMED CONSENT PASIEN</div>
          <q-badge color="teal" outline class="q-ml-sm">
            {{ pasien?.informconcern?.length || 0 }} Dokumen Terbuat
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="pasien?.informconcern?.length">
          <q-btn
            v-print="printAllObj"
            color="teal"
            icon="icon-mat-print"
            label="Cetak Semua Dokumen"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>

    <!-- Container list dokumen -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="!pasien?.informconcern?.length" class="text-center text-grey-6 q-pa-xl">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm" />
        <div class="text-bold">Belum ada data Informed Consent</div>
        <div class="text-caption">Belum ada dokumen Informed Consent yang dibuat untuk pasien ini.</div>
      </div>

      <div v-else id="print-all-informed-consents" class="column items-center q-gutter-y-md full-width">
        <div
          v-for="(item, idx) in pasien?.informconcern"
          :key="item.id"
          class="document-card relative-position print-page"
        >
          <!-- Tombol print satuan di atas kanan (non-print) -->
          <div class="absolute-top-right q-pa-md no-print z-top row items-center q-gutter-x-sm">
            <div class="text-caption text-bold text-teal bg-white q-px-sm q-py-xs rounded-borders shadow-1 border-teal">
              {{ mapJenis[item.jenis] || item.jenis }}
            </div>
            <q-btn
              v-print="getPrintObj(item.id)"
              color="teal"
              round
              icon="icon-mat-print"
              size="sm"
            >
              <q-tooltip class="primary">Cetak Dokumen Ini Saja</q-tooltip>
            </q-btn>
          </div>

          <!-- Wrapper cetak satuan -->
          <div :id="'print-doc-' + item.id">
            <component
              :is="asyncComponentPreviews[item.jenis]"
              :pasien="pasien"
              :item="item"
            />
          </div>

          <!-- Halaman pembatas saat print semua -->
          <div class="page-break-after-always" v-if="idx < pasien.informconcern.length - 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: () => null
  }
})

const printAllObj = {
  id: 'print-all-informed-consents',
  popTitle: 'Seluruh Informed Consent Pasien'
}

function getPrintObj(itemId) {
  return {
    id: 'print-doc-' + itemId,
    popTitle: 'Informed Consent'
  }
}

const mapJenis = {
  OperasiInvasif: 'Operasi / Tindakan Invasif',
  Sedasi: 'Tindakan Anestesi / Sedasi',
  Colonoscopy: 'Tindakan Colonoscopy',
  TransfusiDarah: 'Tindakan Transfusi Darah',
  PenandaanLokasiOperasi: 'Penandaan Lokasi Operasi',
  Resusitasi: 'Penolakan Resusitasi (DNR)',
  Restrain: 'Persetujuan Pemasangan Restrain'
}

const asyncComponentPreviews = {
  OperasiInvasif: defineAsyncComponent(() => import('../../informconsent/comp/concernoperasi/PreviewPage.vue')),
  Sedasi: defineAsyncComponent(() => import('../../informconsent/comp/concernsedasi/PreviewSedasi.vue')),
  Colonoscopy: defineAsyncComponent(() => import('../../informconsent/comp/colonoscopy/PreviewColonoscopy.vue')),
  TransfusiDarah: defineAsyncComponent(() => import('../../informconsent/comp/transfusi/PreviewTransfusi.vue')),
  PenandaanLokasiOperasi: defineAsyncComponent(() => import('../../informconsent/comp/penandaan/PreviewPenandaan.vue')),
  Resusitasi: defineAsyncComponent(() => import('../../informconsent/comp/resusitasi/PreviewResusitasi.vue')),
  Restrain: defineAsyncComponent(() => import('../../informconsent/comp/restrain/PreviewRestrain.vue'))
}
</script>

<style lang="scss" scoped>
.z-top {
  z-index: 99;
}

.document-card {
  width: 210mm;
  margin: 0 auto;
}

.border-teal {
  border: 1px solid var(--q-teal);
}

/* Menetralisir style #pdfDoc bawaan dari sub-komponen agar tidak double background abu-abu di screen */
:deep(#pdfDoc) {
  background-color: transparent !important;
  padding: 0 !important;
  gap: 0 !important;
}

:deep(.page-1), :deep(.page-2), :deep(.page-3) {
  margin-bottom: 24px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

@media print {
  .no-print {
    display: none !important;
  }

  .print-page {
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  .page-break-after-always {
    page-break-after: always !important;
    break-after: page !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    overflow: hidden !important;
  }
}
</style>
