<template>
  <q-card flat class="bg-white">
    <div class="col-12">
      <q-list dense>
        <q-banner class="bg-grey-2 relative-position">
          <template v-slot:avatar>
            <div class="text-h4">🧾</div>
          </template>
          <div class="text-subtitle2">No. Permintaan : </div>
          <div class="text-weight-bold text-subtitle2">{{ pasien?.nota_permintaan }}</div>

          <div v-if="pasien?.cito" class="absolute-right">
            <q-badge class="q-pa-sm">Cito</q-badge>
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
      <div class="text-h6 text-white bg-grey-9 q-pa-md flex items-center">
        📋 Daftar Permintaan Pemeriksaan
      </div>

      <div v-if="listPermintaans?.length">
        <q-list bordered>


          <template v-for="(item, index) in listPermintaans" :key="item">
            <q-expansion-item group="somegroup" icon="icon-mat-app_registration"
              :label="`${item?.rs2} - (${item?.rs3})`" header-class="text-teal f-16 text-weight-bold q-pa-md"
              switch-toggle-side>
              <q-card>
                <q-separator />
                <q-card-section>
                  <div class="row q-col-gutter-sm full-width">

                    <!-- <div class="col-3 q-mb-sm"> -->
                    <q-select v-model="item.ukuran" dense standout="bg-yellow-3 text-black" outlined label="Ukuran"
                      :options="ukurans" emit-value map-options input-class="ellipsis" fill-input hide-bottom-space
                      class="col-4" @update:model-value="(val) => {
                        item.ukuran = val
                      }" />
                    <!-- </div> -->
                    <!-- <div class="col-3 q-mb-sm"> -->
                    <app-input-simrs v-model="item.jumlah" label="Jumlah" class="col-3" />
                    <!-- </div> -->
                    <div class="col-12 q-mb-sm"> Hasil : </div>
                    <app-input-simrs-mode type="wysiwyg" v-model="item.hasil" :disable="false" class="col-12 q-mb-md" />
                  </div>
                </q-card-section>
                <q-separator />

                <!-- <q-card-section>
                  <div class="row q-col-gutter-sm justify-end">
                    <div class="col-auto">
                      <q-btn label="Batal" color="bg-dark" flat @click="store.batal(item)" />
                    </div>
                    <div class="col-auto">
                      <q-btn label="Simpan" color="primary" class="q-mr-sm" @click="store.simpan(item)" />
                    </div>
                  </div>
                </q-card-section> -->
              </q-card>
            </q-expansion-item>

            <q-separator />
          </template>
        </q-list>

        <div class="q-pa-md">
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
        </div>

        <div class="q-mb-xl"></div>
      </div>


      <div v-else class="flex flex-center q-pa-md bg-white" style="height:300px;">
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

const props = defineProps({
  pasien: {
    type: Object,
    required: true
  }
})

const storePermintaan = usePermintaanRadiologiStore()
const { permintaan, listPermintaans, ukurans } = storeToRefs(storePermintaan)

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY')
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY HH:mm')
}

</script>