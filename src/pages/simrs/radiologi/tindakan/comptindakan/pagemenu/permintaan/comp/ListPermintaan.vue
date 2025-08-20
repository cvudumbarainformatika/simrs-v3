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
              <q-btn v-else-if="pasien.status === '3'" color="negative" rounded disabled outline>
                <q-icon name="icon-mat-close" class="q-mr-md"></q-icon>
                <div>Layanan telah Dibatalkan</div>
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
                <div class="col">{{ formatDateTime(permintaan?.tgl_kunjungan) }}</div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-4">Diterima Tgl</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ formatDateTime(permintaan?.trmtgl) }}</div>
              </div>
            </div>
          </div>
          <div v-if="permintaan?.rs9 === '1' || permintaan?.rs9 === '3'" class="row">
            <div class="col-4">{{ permintaan?.rs9 === '1' ? 'Diselesaikan Tgl' : 'Dibatalkan Tgl' }}</div>
            <div class="col-8">
              <div class="row">
                <div class="col-auto" style="min-width:5px"> : </div>
                <div class="col">{{ formatDateTime(permintaan?.updateststgl) }}</div>
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


          <template v-for="(item, index) in listPermintaans" :key="index">
            <q-expansion-item group="somegroup" :label="`${item?.nama} - (${item?.jenis})`" switch-toggle-side
              :header-class="{ 'bg-primary text-white': isActive === index }" expand-separator
              @click="isActive = index">

              <template #header>
                <q-item-section class="q-pa-sm">
                  <div class="f-14">{{ item?.nama }} ({{ item?.jenis }})</div>
                  <div class="text-md q-mt-sm text-positive">Rp. {{ formatRp(item?.subtotal) }}</div>

                </q-item-section>
                <q-item-section side>
                  <template v-if="permintaan?.rs9 !== '3'">
                    <q-icon :name="item?.hasil?.length > 1 ? 'icon-mat-done_all' : 'icon-mat-app_registration'"
                      :color="item?.hasil?.length > 1 ? 'positive' : 'orange'"></q-icon>
                  </template>
                  <template v-else>
                    <q-icon name="icon-mat-cancel" color="negative"></q-icon>

                  </template>
                </q-item-section>
              </template>

              <q-card v-if="permintaan?.rs9 !== '3'">
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
                    <app-input-simrs-mode v-model="item.hasilhtml" :disable="false" class="col-12 q-mb-md"
                      @update:model-value="(val) => {
                        item.hasilhtml = val
                      }" @plaintext:model-value="(val) => {
                        // console.log('plaintext', val);
                        item.hasil = val
                      }" :valid="{ required: true }" />
                    <div class="q-mb-sm">kesimpulan :</div>
                    <app-input-simrs-mode v-model="item.kesimpulanhtml" :disable="false" @update:model-value="(val) => {
                      item.kesimpulanhtml = val
                    }" @plaintext:model-value="(val) => {
                      // console.log('plaintext', val);
                      item.kesimpulan = val
                    }" class="col-12 q-mb-md" :valid="{ required: true }" />
                  </div>
                </q-card-section>
                <q-separator />

                <q-card-section class="bg-yellow-2">
                  <div class="row justify-between">
                    <!-- <div>
                      <q-btn label="Batalkan Permintaan" color="negative" @click="batalkan(item)" />
                    </div> -->
                    <div class="row q-col-gutter-sm ">
                      <div class="col-auto">
                        <q-btn label="Reset" color="bg-dark" flat @click="storePermintaan.reset(item)" />
                      </div>
                      <div class="col-auto">
                        <q-btn label="Simpan" color="primary" class="q-mr-sm"
                          @click="storePermintaan.simpan(item, pasien)" />
                      </div>
                    </div>
                    <div>
                      <!-- <q-btn v-if="item?.hasil?.length > 1" icon="icon-mat-print" color="dark"
                        @click="isPrint = true" /> -->
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />


            <PrintModal v-model="isPrint" :item="item" :pasien="pasien" />
          </template>
        </q-list>

        <div class="q-pa-md text-right">
          <q-btn v-if="pasien.status === '2'" :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan"
            color="primary" label="Selesaikan Layanan" @click="selesaikanLayanan"></q-btn>


          <div v-else-if="pasien.status === '1'">
            <q-btn v-if="listPermintaans[0]?.hasil?.length > 1" icon="icon-mat-print" color="dark"
              @click="isPrint = true" />
          </div>
        </div>

        <div class="q-mb-xl"></div>
      </div>



      <div v-else class="flex flex-center full-height q-pa-md bg-white" style="height:300px;">
        <div class="text-subtitle2">Tidak ada permintaan pemeriksaan radiologi.</div>
      </div>

    </div>





  </q-card>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { date } from 'quasar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { usePermintaanRadiologiStore } from 'src/stores/simrs/radiologi/permintaan'
import { storeToRefs } from 'pinia';
import { formatRp } from 'src/modules/formatter'
import { notifErrVue } from 'src/modules/utils'

import PrintModal from './PrintModal.vue'

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

// console.log('permintaan', permintaan, listPermintaans, props.pasien);
const refDialogPrint = ref(null)
const isActive = ref(null)
const isPrint = ref(false)


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



  let count = 0
  for (let i = 0; i < listPermintaans.value?.length; i++) {
    const el = listPermintaans.value[i];
    if (el?.hasil?.length >= 1) {
      count++
    }
  }

  // console.log('selesaikan layanan', listPermintaans.value?.length, count);
  if (count === listPermintaans.value?.length) {
    store.selesaikanLayanan(props.pasien)
  }
  else {
    notifErrVue('Ada Pemeriksaan yang belum ada hasil. Harap Isi Hasil terlebih dahulu.')
  }


  // store.selesaikanLayanan(props.pasien)

}

// function batalkan(item) {
//   console.log('batalkan item', item);

//   // store.batal(item)
// }

</script>