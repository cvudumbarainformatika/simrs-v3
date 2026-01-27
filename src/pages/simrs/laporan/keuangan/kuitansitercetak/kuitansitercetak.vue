<template>
  <q-page padding>
    <q-card>

      <!-- HEADER -->
      <q-card-section>
        <div class="row items-center garis-bawah">
          <div class="col-2">
            <q-img src="~assets/images/logo-kota-grey.png" style="height: 3.56cm; max-width: 2.86cm" />
          </div>

          <div class="col-8 text-center">
            <div class="f-18">PEMERINTAH KOTA PROBOLINGGO</div>
            <div class="f-14 text-weight-bold">
              DINAS KESEHATAN, PENGENDALIAN PENDUDUK, DAN KELUARGA BERENCANA
            </div>
            <div class="f-28 text-weight-bold">
              UOBK RSUD DOKTER MOHAMAD SALEH
            </div>
            <div class="f-14">
              Jl. Mayjen Panjaitan No.65 Telp.(0335) 433119
            </div>
            <div class="f-14">
              E-mail : rsudprob@probolinggokota.go.id
            </div>
            <div class="f-14 text-weight-bold">
              PROBOLINGGO 67219
            </div>
          </div>

          <div class="col-2">
            <q-img src="~assets/logos/logo-rsud.png" style="height: 4cm; max-width: 4cm" />
          </div>
        </div>

        <div class="text-center text-weight-bold f-18 q-mt-md">
          REKAP KUITANSI TERCETAK
        </div>
      </q-card-section>

      <!-- FILTER -->
      <q-card-section class="bg-grey-1">
        <q-form class="row items-end q-col-gutter-md" @submit.prevent="store.initAmbilData">

          <!-- DARI TANGGAL -->
          <div class="col-12 col-md-3">
            <app-input-date-human :model="store.tanggal.from" label="Dari Tanggal" outlined dense @db-model="setTo"
              @set-display="val => store.tanggal.from = val" />
          </div>

          <!-- SAMPAI TANGGAL -->
          <div class="col-12 col-md-3">
            <app-input-date-human :model="store.tanggal.to" label="Sampai Tanggal" outlined dense @db-model="setTox"
              @set-display="val => store.tanggal.to = val" />
          </div>

          <!-- LAYANAN -->
          <div class="col-12 col-md-4">
            <q-select v-model="store.params.layanan" :options="layanan" option-label="namalayanan"
              option-value="kodelayanan" emit-value map-options outlined dense label="Layanan" clearable
              transition-show="scale" transition-hide="scale" />
          </div>

          <!-- TOMBOL -->
          <div class="col-12 col-md-2">
            <q-btn label="Cari Data" type="submit" color="primary" icon="search" unelevated class="full-width"
              :loading="store.loading" :disable="store.loading" />
          </div>

        </q-form>
      </q-card-section>


      <!-- TABLE -->
      <q-card-section>
        <q-table flat bordered dense row-key="nokuitansi" :rows="store.rows" :columns="store.columns"
          :loading="store.loading" no-data-label="Data tidak ditemukan" :rows-per-page-options="[0]"
          :pagination="{ rowsPerPage: 0 }">
          <template #body-cell-total="props">
            <q-td align="right">
              {{ formatDouble(props.row.total) }}
            </q-td>
          </template>
          <template #bottom-row>
            <q-tr class="bg-grey-3 text-weight-bold">
              <q-td colspan="5" align="right">
                TOTAL
              </q-td>
              <q-td align="right">
                {{ formatDouble(totalNominal) }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatDouble } from 'src/modules/formatter'
import { useLaporanKuitansiTercetak } from
  'src/stores/simrs/laporan/keuangan/kuitansitercetak/kuitansitercetak'

const store = useLaporanKuitansiTercetak()

const layanan = ref([
  { kodelayanan: '1', namalayanan: 'RAWAT JALAN' },
  { kodelayanan: '2', namalayanan: 'RAWAT INAP' },
  { kodelayanan: '3', namalayanan: 'IGD' }
])

const totalNominal = computed(() => {
  return store.rows.reduce((acc, row) => {
    return acc + Number(row.total || 0)
  }, 0)
})

function setTo(val) {
  store.params.tgldari = val
}

function setTox(val) {
  store.params.tglsampai = val
}
</script>

<style scoped lang="scss">
.garis-bawah {
  border-bottom: 6px double black;
}
</style>
