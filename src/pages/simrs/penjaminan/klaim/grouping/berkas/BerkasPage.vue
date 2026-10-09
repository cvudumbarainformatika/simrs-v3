<template>
  <div class="fit column bg-white document-page">
    <div class="col-auto bg-grey-2 border-bottom document-tabs-wrap">
      <q-tabs v-model="tabActive" dense align="left" mobile-arrows active-color="primary" active-bg-color="white"
        indicator-color="primary" class="text-grey-8 document-tabs">
        <q-tab name="dokumen-rajal" icon="icon-mat-description"
          :label="pasien?.kodepoli === 'POL014' ? 'Dokumen Rekam Medis (IGD)' : 'Dokumen Rekam Medis (Rawat Jalan)'"
          no-caps />
        <q-tab name="upload-rajal" icon="icon-mat-attach_file" label="Berkas Luar / Upload" no-caps />
      </q-tabs>
    </div>

    <div class="col full-height document-content">
      <q-tab-panels v-model="tabActive" animated class="fit q-pa-none document-panels">
        <!-- Panel 1: Dokumen Rekam Medis Otomatis (Embed IGD atau Poli) -->
        <q-tab-panel name="dokumen-rajal" class="fit q-pa-none document-panel">
          <Suspense>
            <template #default>
              <!-- Jika Pasien IGD (POL014) -->
              <DokumenIgdIndex v-if="pasien?.kodepoli === 'POL014'" :key="pasien?.noreg" :pasien="pasien"
                :loadingaja="loadingaja" />
              <!-- Jika Pasien Poli Rawat Jalan -->
              <DokumenPoliIndex v-else :key="pasien.noreg" :pasien="pasien" :loadingaja="loadingaja" />
            </template>
            <template #fallback>
              <app-loading />
            </template>
          </Suspense>
        </q-tab-panel>

        <!-- Panel 2: Dokumen Upload Luar -->
        <q-tab-panel name="upload-rajal" class="fit q-pa-md">
          <div v-if="!pasien?.dokumenluar?.length" class="column flex-center full-height text-grey-7">
            <q-icon name="icon-mat-folder_open" size="48px" class="q-mb-sm" />
            <div>Tidak ada berkas/dokumen luar yang diunggah</div>
          </div>
          <div v-else class="row q-col-gutter-sm">
            <ListUploadComp :items="pasien?.dokumenluar" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'

const DokumenIgdIndex = defineAsyncComponent(() =>
  import('src/pages/simrs/igd/layanan/dokumen/DokumenPage.vue')
)

const DokumenPoliIndex = defineAsyncComponent(() =>
  import('src/pages/simrs/dokumen/comppoli/DocumentPageNew.vue')
)

const ListUploadComp = defineAsyncComponent(() =>
  import('src/pages/simrs/igd/layanan/uploaddokumen/compDokUpload/ListComp.vue')
)

const tabActive = ref('dokumen-rajal')

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  },
  ruangranap: {
    type: Object,
    default: null
  },
  depo: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.document-page,
.document-tabs-wrap,
.document-content,
.document-panels {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.document-page,
.document-content {
  overflow: hidden;
}

.document-tabs {
  width: 100%;
}

.document-panels :deep(.q-tab-panel) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.document-panels :deep(.q-tab-panel > *) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
</style>
