<template>
  <q-card flat class="bg-white">
    <div class="col-12">
      <q-list dense>
        <q-banner class="bg-grey-2 relative-position">
          <template v-slot:avatar>
            <div class="text-h4">🧾</div>
          </template>
          <div class="text-subtitle2">No. Permintaan : </div>
          <div class="text-weight-bold text-subtitle2">{{ pasien?.nota_permintaan }}

            <q-badge v-if="pasien?.cito" class="q-pa-sm">Cito</q-badge>
          </div>


          <!-- <div v-if="pasien?.cito" class="absolute-right">
            <q-badge class="q-pa-sm">Cito</q-badge>
          </div> -->

          <div class="absolute-right">
            <div class="q-pa-md">
              <q-btn :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan" v-if="pasien.status === '2'"
                color="primary" label="Selesaikan Layanan" @click="selesaikanLayanan"></q-btn>
              <q-btn v-else-if="pasien.status === '1'" color="primary" rounded disabled outline>
                <q-icon name="icon-mat-lock" class="q-mr-md"></q-icon>
                <div>Layanan telah selesai</div>
              </q-btn>
            </div>
          </div>
        </q-banner>
        <q-separator></q-separator>
        <q-banner class="bg-white">
          <div class="row">
            <div class="col-4">Diagnosa Kerja</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ permintaan?.diagnosakerja }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">Metode Peny. Hasil</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ permintaan?.metodepenyampaianhasil }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">Status Alergi</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ permintaan?.statusalergipasien }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">Catatan</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ permintaan?.catatanpermintaan }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">Dibuat Tgl</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ formatDateTime(permintaan?.created_at) }}</div>
              </div>
            </div>
          </div>
        </q-banner>
      </q-list>



    </div>

    <q-separator />
    <div class="bg-white">
      <div class="flex justify-between text-white bg-grey-9 q-pa-md ">
        <div class="f-16 flex items-center">
          📋 Daftar Permintaan
        </div>
        <div v-if="!loading" class="f-14 text-weight-bold">
          Rp {{ hitungBilTotal() }}
        </div>
      </div>

      <div v-if="loading" class="flex flex-center full-height q-pa-md bg-grey" style="height:300px;">
        <div>Harap Tunggu ... </div>
      </div>

      <div v-else-if="listPermintaans?.length">
        <q-list bordered>


          <template v-for="(item, index) in listPermintaans" :key="item">
            <q-expansion-item group="somegroup" icon="icon-mat-app_registration"
              :label="`${item?.nama} - (${item?.jenis})`" switch-toggle-side>

              <template #header>
                <q-item-section class="q-pa-sm">
                  <div class="f-14">{{ item?.nama }} ({{ item?.jenis }})</div>
                  <div class="text-md q-mt-sm text-grey">Rp. {{ formatRp(item?.subtotal) }}</div>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="icon-mat-app_registration"></q-icon>
                </q-item-section>
              </template>

              <q-card>
                <q-separator />
                <q-card-section>
                  <div class="row q-col-gutter-sm full-width">

                    <!-- <div class="col-3 q-mb-sm"> -->
                    <q-select v-model="item.ukuran" dense standout="bg-yellow-3 text-black" outlined label="Ukuran"
                      :options="ukurans" emit-value map-options input-class="ellipsis" fill-input hide-bottom-space
                      class="col-3" @update:model-value="(val) => {
                        item.ukuran = val
                      }" />
                    <!-- </div> -->
                    <!-- <div class="col-3 q-mb-sm"> -->
                    <app-input-simrs v-model="item.jumlah" label="Jumlah" class="col-3"
                      :valid="{ required: false, number: true }" />
                    <!-- </div> -->

                    <app-autocomplete-new ref="refDokter" :model="item.kdPelaksana" label="Pelaksana Tindakan"
                      :key="item" autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined
                      :source="storePermintaan.dokters" class="col-6" @on-select="(val) => {
                        // console.log('selected pelaksana', val);
                        const finder = storePermintaan.dokters.find(d => d.kdpegsimrs === val);
                        if (!finder) {
                          item.pelaksana = null;
                          item.kdPelaksana = null;
                          return;
                        }

                        item.kdPelaksana = val
                        item.pelaksana = finder.nama;
                      }" @clear="() => {
                        item.kdPelaksana = null
                        item.pelaksana = null
                      }" />

                    <div class="col-12 q-mb-sm"> Hasil : <span class="text-red">*</span> </div>
                    <app-input-simrs-mode type="wysiwyg" v-model="item.hasil" :disable="false" class="col-12 q-mb-md"
                      @update:model-value="(val) => {
                        item.hasil = val
                      }" :valid="{ required: true }" />
                    <div class="q-mb-sm">kesimpulan :</div>
                    <app-input-simrs-mode type="wysiwyg" v-model="item.kesimpulan" :disable="false" @update:model-value="(val) => {
                      item.kesimpulan = val
                    }" class="col-12 q-mb-md" :valid="{ required: true }" />
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="bg-yellow-2">
                  <div class="row q-col-gutter-sm justify-end">
                    <div class="col-auto">
                      <q-btn label="Batal" color="bg-dark" flat @click="storePermintaan.batal(item)" />
                    </div>
                    <div class="col-auto">
                      <q-btn label="Simpan" color="primary" class="q-mr-sm"
                        @click="storePermintaan.simpan(item, pasien)" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />
          </template>
        </q-list>

        <!-- <div class="q-pa-md">
          <div class="q-mb-sm">kesimpulan :</div>
          <app-input-simrs-mode type="wysiwyg" v-model="permintaan.kesimpulan" :disable="false"
            class="col-12 q-mb-md" />

          <q-separator class="q-my-lg"></q-separator>

          <div class="row q-col-gutter-sm justify-end">
            <div class="col-auto">
              <q-btn label="Batal" color="bg-dark" flat @click="store.batal(item)" />
            </div>
            <div class="col-auto">
              <q-btn label="Simpan" color="primary" class="q-mr-sm" @click="store.simpan(item)" />
            </div>
          </div>
        </div> -->

        <div class="q-mb-xl"></div>
      </div>



      <div v-else class="flex flex-center full-height q-pa-md bg-white" style="height:300px;">
        <div class="text-subtitle2">Tidak ada permintaan pemeriksaan radiologi.</div>
      </div>

    </div>

  </q-card>

</template>

<script setup>
import { computed, onMounted } from 'vue'
import { date } from 'quasar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { usePermintaanRadiologiStore } from 'src/stores/simrs/radiologi/permintaan'
import { storeToRefs } from 'pinia';
import { formatRp } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingTerima: {
    type: Boolean,
    default: false
  },
  loadingBatal: {
    type: Boolean,
    default: false
  }
})

const store = useListPasienRadiologiStore()
const storePermintaan = usePermintaanRadiologiStore()
const { permintaan, listPermintaans, ukurans, } = storeToRefs(storePermintaan)

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY HH:mm')
}

function hitungBilTotal() {
  // console.log('listPermintaans', listPermintaans.value);

  let total = 0
  for (let i = 0; i < listPermintaans.value?.length; i++) {
    const el = listPermintaans.value[i];
    total += el?.subtotal
  }

  return formatRp(total)
}

function selesaikanLayanan() {
  store.selesaikanLayanan(props.pasien)

}

</script>