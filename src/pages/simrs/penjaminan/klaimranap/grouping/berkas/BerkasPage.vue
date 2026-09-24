<template>
  <div class="fit column bg-white">
    <div class="col-auto bg-grey-2 border-bottom">
      <q-tabs
        v-model="tabActive"
        dense
        align="left"
        active-color="primary"
        active-bg-color="white"
        indicator-color="primary"
        class="text-grey-8"
      >
        <q-tab name="dokumen-ranap" icon="icon-mat-description" label="Dokumen Rekam Medis (Ranap)" no-caps />
        <q-tab name="billing-ranap" icon="icon-mat-receipt_long" label="Billing & Rincian Biaya" no-caps />
        <q-tab name="upload-ranap" icon="icon-mat-attach_file" label="Berkas Luar / Upload" no-caps />
      </q-tabs>
    </div>

    <div class="col full-height" style="overflow: hidden;">
      <q-tab-panels v-model="tabActive" animated class="fit q-pa-none">
        <!-- Panel 1: Dokumen Rawat Inap (Otomatis mencakup semua dokumen ranap) -->
        <q-tab-panel name="dokumen-ranap" class="fit q-pa-none">
          <Suspense>
            <template #default>
              <DokumenRanapIndex :key="pasien?.noreg" :pasien="pasien" />
            </template>
            <template #fallback>
              <app-loading />
            </template>
          </Suspense>
        </q-tab-panel>

        <!-- Panel 2: Billing & Faktur Rawat Inap -->
        <q-tab-panel name="billing-ranap" class="fit q-pa-none">
          <Suspense>
            <template #default>
              <BillingRanapIndex :key="pasien?.noreg" :pasien="pasien" />
            </template>
            <template #fallback>
              <app-loading />
            </template>
          </Suspense>
        </q-tab-panel>

        <!-- Panel 3: Dokumen Upload Luar -->
        <q-tab-panel name="upload-ranap" class="fit q-pa-md">
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

const DokumenRanapIndex = defineAsyncComponent(() =>
  import('src/pages/simrs/ranap/layanan/dokumen/IndexPage.vue')
)

const BillingRanapIndex = defineAsyncComponent(() =>
  import('src/pages/simrs/ranap/layanan/billing/IndexPage.vue')
)

const ListUploadComp = defineAsyncComponent(() =>
  import('src/pages/simrs/igd/layanan/uploaddokumen/compDokUpload/ListComp.vue')
)

const tabActive = ref('dokumen-ranap')

defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>
