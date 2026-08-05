<template>
  <q-card class="shadow-1 full-height column no-wrap">
    <q-card-section class="q-pa-sm bg-blue-grey-1 col-auto">
      <div class="row items-center justify-between">
        <div class="text-subtitle2 text-weight-bold text-deep-purple">
          <q-icon name="icon-mat-folder" class="q-mr-xs" color="deep-purple-5" />
          Rekapitulasi Per Dokter Pelaksana Radiologi
        </div>
        <div class="text-caption text-grey-7">
          Total {{ store.filteredDokterLaksana.length }} dokter pelaksana
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Container dengan Scroll Area -->
    <q-card-section class="q-pa-none col scroll">
      <div v-if="store.loading" class="q-pa-md text-center">
        <q-spinner color="deep-purple" size="3em" />
        <div class="text-caption text-grey-7 q-mt-xs">Memuat data dokter pelaksana...</div>
      </div>

      <div v-else-if="!store.filteredDokterLaksana.length" class="q-pa-lg text-center text-grey-6">
        <q-icon name="icon-mat-folder_open" size="48px" class="q-mb-xs" />
        <div>Belum ada data dokter pelaksana</div>
      </div>

      <!-- Tampilan Tree / Folder Explorer -->
      <div v-else class="tree-explorer q-pa-sm">
        <div
          v-for="(dok, dIdx) in store.filteredDokterLaksana"
          :key="dIdx"
          class="tree-folder-node q-mb-xs"
        >
          <!-- Root Node: Dokter Pelaksana (Folder) -->
          <div class="tree-folder-header row items-center justify-between q-pa-xs rounded-borders bg-deep-purple-1">
            <div class="row items-center q-gutter-xs">
              <q-icon name="icon-mat-folder_open" color="deep-purple" size="20px" />
              <span class="text-weight-bold text-subtitle2 text-grey-9">
                {{ dIdx + 1 }}. {{ dok.nama }}
              </span>
            </div>
            <div class="row items-center q-gutter-xs">
              <span class="text-caption text-grey-7">Total Tindakan:</span>
              <q-chip
                dense
                color="deep-purple"
                text-color="white"
                class="text-weight-bold"
                size="11px"
              >
                {{ dok.total || 0 }}
              </q-chip>
            </div>
          </div>

          <!-- Leaf Nodes: Detail Pemeriksaan (File Tree items, Langsung Tampil) -->
          <div class="tree-children q-pl-md q-pt-xs">
            <div
              v-for="(pmr, pIdx) in dok.pemeriksaan"
              :key="pIdx"
              class="tree-leaf-item row items-center justify-between q-py-xs q-px-sm"
            >
              <div class="row items-center q-gutter-xs">
                <!-- Tree connector line / icon -->
                <span class="tree-branch-symbol text-grey-5">└─</span>
                <q-icon name="icon-mat-insert_drive_file" color="purple-6" size="16px" />
                <span class="text-caption text-weight-medium text-grey-8">{{ pmr.nama }}</span>
              </div>
              <q-badge color="deep-purple-7" text-color="white" class="text-weight-bold" style="min-width: 24px; text-align: center;">
                {{ pmr.total }}
              </q-badge>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Footer Total -->
    <q-separator />
    <q-card-section class="q-pa-sm bg-blue-grey-2 col-auto">
      <div class="row items-center justify-between">
        <div class="text-weight-bold text-caption text-deep-purple">
          TOTAL TINDAKAN SELURUH DOKTER PELAKSANA
        </div>
        <div class="text-subtitle2 text-weight-bold text-deep-purple-9">
          {{ store.dataDokterLaksana.reduce((sum, item) => sum + (Number(item?.total) || 0), 0) }} Tindakan
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()
</script>

<style lang="scss" scoped>
.tree-explorer {
  font-family: inherit;
}

.tree-folder-node {
  border: 1px solid #D1C4E9;
  border-radius: 6px;
  overflow: hidden;
  background: #ffffff;
}

.tree-folder-header {
  border-bottom: 1px solid #EDE7F6;
}

.tree-children {
  border-left: 2px solid #D1C4E9;
  margin-left: 12px;
}

.tree-leaf-item {
  border-bottom: 1px dashed #EEEEEE;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #F3E5F5;
    border-radius: 4px;
  }
}

.tree-branch-symbol {
  font-family: monospace;
  font-size: 13px;
  user-select: none;
}
</style>
