<template>
  <div class="row q-col-gutter-sm q-mb-sm">
    <!-- Card Total Pasien -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-primary">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">TOTAL PASIEN</div>
              <div class="text-h5 text-weight-bold text-primary">
                {{ store.summary.totalPasien }}
                <span class="text-caption text-grey-6 font-normal">Pasien</span>
              </div>
            </div>
            <q-avatar rounded color="blue-1" text-color="primary" icon="icon-mat-people" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Total Tindakan -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-secondary">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">TOTAL TINDAKAN</div>
              <div class="text-h5 text-weight-bold text-secondary">
                {{ store.summary.totalTindakan }}
                <span class="text-caption text-grey-6 font-normal">Pemeriksaan</span>
              </div>
            </div>
            <q-avatar rounded color="teal-1" text-color="secondary" icon="icon-mat-biotech" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Breakdown Rajal / Ranap / IGD -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-accent">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div class="full-width">
              <div class="text-caption text-grey-7 text-weight-medium">SEBARAN PASIEN</div>
              <div class="row items-center justify-between q-mt-xs text-caption">
                <span class="text-weight-medium text-blue-9">Rajal: <b>{{ store.summary.totalRajal }}</b></span>
                <span class="text-weight-medium text-orange-9">Ranap: <b>{{ store.summary.totalRanap }}</b></span>
                <span class="text-weight-medium text-negative">IGD: <b>{{ store.summary.totalIgd }}</b></span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Card Total Dokter -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="shadow-1 overflow-hidden border-left-info">
        <q-card-section class="q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-7 text-weight-medium">TOTAL DOKTER</div>
              <div class="text-h5 text-weight-bold text-deep-purple">
                {{ store.summary.totalDokter }}
                <span class="text-caption text-grey-6 font-normal">Dokter</span>
              </div>
            </div>
            <q-avatar rounded color="purple-1" text-color="deep-purple" icon="icon-mat-medical_services" size="42px" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useLaporanRadiologiStore } from 'src/stores/simrs/radiologi/laporanradiologi'

const store = useLaporanRadiologiStore()
</script>

<style scoped lang="scss">
.border-left-primary {
  border-left: 4px solid var(--q-primary, #1976D2);
}
.border-left-secondary {
  border-left: 4px solid var(--q-secondary, #26A69A);
}
.border-left-accent {
  border-left: 4px solid #9C27B0;
}
.border-left-info {
  border-left: 4px solid #00BCD4;
}
</style>
