<template>
  <div class="row q-col-gutter-sm q-mb-sm">
    <!-- Card Total Nota Unik -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-primary">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">TOTAL NOTA UNIK</div>
              <div class="text-h5 text-weight-bold text-primary">
                {{ store.totalNotaUnik }}
                <span class="text-caption text-grey-6 font-normal">Nota</span>
              </div>
            </div>
            <q-avatar rounded color="blue-1" text-color="primary" icon="icon-mat-receipt" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Total Pemeriksaan -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-secondary">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">TOTAL PEMERIKSAAN</div>
              <div class="text-h5 text-weight-bold text-secondary">
                {{ totalPemeriksaan }}
                <span class="text-caption text-grey-6 font-normal">Tindakan</span>
              </div>
            </div>
            <q-avatar rounded color="teal-1" text-color="secondary" icon="icon-mat-biotech" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Dokter Peminta -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-info">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">DOKTER PEMINTA</div>
              <div class="text-h5 text-weight-bold text-deep-purple">
                {{ store.dataDokterMinta.length }}
                <span class="text-caption text-grey-6 font-normal">Dokter</span>
              </div>
            </div>
            <q-avatar rounded color="purple-1" text-color="deep-purple" icon="icon-mat-medical_services" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Ruangan Pengirim -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-warning">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">RUANGAN PENGIRIM</div>
              <div class="text-h5 text-weight-bold text-orange-9">
                {{ store.dataRuangan.length }}
                <span class="text-caption text-grey-6 font-normal">Ruangan / Poli</span>
              </div>
            </div>
            <q-avatar rounded color="orange-1" text-color="orange-9" icon="icon-mat-apartment" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()

const totalPemeriksaan = computed(() => {
  return store.dataPemeriksaan.reduce((sum, item) => sum + (Number(item?.total) || 0), 0)
})
</script>

<style scoped lang="scss">
.border-left-primary {
  border-left: 4px solid var(--q-primary, #1976D2);
}
.border-left-secondary {
  border-left: 4px solid var(--q-secondary, #26A69A);
}
.border-left-info {
  border-left: 4px solid #00BCD4;
}
.border-left-warning {
  border-left: 4px solid #FF9800;
}
</style>
