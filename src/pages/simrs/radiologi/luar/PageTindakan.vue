<template>
  <div class="fit scroll">
    <div class="row q-col-gutter-xs fit">
      <div class="col-12 col-md-4 full-height">
        <q-card flat class="fit">
          <q-card-section>

            <app-avatar-pasien :key="pasien" :pasien="pasien" width="100%" />
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="text-weight-bold">👤 {{ pasien?.nama }}</div>
            </div>
            <div class="row no-wrap items-center">
              <div class="text-caption">⚤ {{ pasien?.kelamin }}</div>
            </div>
            <div class="row no-wrap items-center">
              <div class="text-caption">⚤ {{ pasien?.alamat }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-8 full-height">
        <q-card flat class="fit">
          <div class="col-12">
            <q-list dense>
              <q-banner class="bg-grey-2 relative-position">
                <template v-slot:avatar>
                  <div class="text-h4">🧾</div>
                </template>
                <div class="text-subtitle2">No. Permintaan : </div>
                <div class="text-weight-bold text-subtitle2">{{ pasien?.notrans || '-' }}
                  <q-badge v-if="pasien?.cito" color="teal" class="q-pa-sm">Cito</q-badge>
                </div>

                <div class="absolute-right">
                  <div class="q-pa-md">
                    <q-btn v-if="pasien.flag === '2'" color="primary" label="Selesaikan Layanan"
                      @click="selesaikanLayanan"></q-btn>
                    <q-btn v-else-if="pasien.flag === '1'" color="primary" rounded disabled outline>
                      <q-icon name="icon-mat-lock" class="q-mr-md"></q-icon>
                      <div>Layanan telah selesai</div>
                    </q-btn>
                  </div>
                </div>


              </q-banner>
              <q-separator></q-separator>
              <q-banner class="bg-white">
                <div class="row">
                  <div class="col-3">Dibuat Tgl </div>
                  <div class="col-9">
                    <div class="row">
                      <div class="col-auto" style="min-width:10px"> : </div>
                      <div class="col">{{ formatDateTime(pasien?.tglentri) }}</div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3">Jenis Pembayaran </div>
                  <div class="col-9">
                    <div class="row">
                      <div class="col-auto" style="min-width:10px"> : </div>
                      <div class="col">{{ pasien?.jenispembayaran }} <span
                          v-if="pasien?.jenispembayaran == 'Perusahaan'" class="text-weight-bold">
                          ( {{ pasien?.perusahaan || '' }} ) </span></div>
                    </div>
                  </div>
                </div>
              </q-banner>
            </q-list>



          </div>


          <!-- RINCIAN -->

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

            <div v-else-if="listPemeriksaans?.length">
              <q-list bordered>


                <template v-for="(item, index) in listPemeriksaans" :key="item">
                  <q-expansion-item group="somegroup" icon="icon-mat-app_registration"
                    :label="`${item?.nama} - (${item?.jenis})`" switch-toggle-side>

                    <template #header>
                      <q-item-section class="q-pa-sm">
                        <div class="f-14">{{ item?.nama }} ({{ item?.jenis }})</div>
                        <div class="text-md q-mt-sm text-grey">Rp. {{ formatRp(parseInt(item?.rs4 || 0) +
                          parseInt(item?.rs6 || 0)) }}</div>
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="icon-mat-app_registration"></q-icon>
                      </q-item-section>
                    </template>

                    <q-card>
                      <q-separator />
                      <q-form @submit="store.simpan(item, pasien)">
                        <q-card-section>
                          <div class="row q-col-gutter-sm full-width">

                            <!-- <div class="col-3 q-mb-sm"> -->
                            <!-- <q-select v-model="item.ukuran" dense standout="bg-yellow-3 text-black" outlined
                              label="Ukuran" :options="ukurans" emit-value map-options input-class="ellipsis" fill-input
                              hide-bottom-space class="col-3" @update:model-value="(val) => {
                                item.ukuran = val
                              }" /> -->
                            <!-- </div> -->
                            <!-- <div class="col-3 q-mb-sm"> -->
                            <!-- <app-input-simrs v-model="item.jumlah" label="Jumlah" class="col-3"
                              :valid="{ required: false, number: true }" /> -->
                            <!-- </div> -->

                            <app-autocomplete-new ref="refDokter" :model="item.kdPelaksana" label="Pelaksana Tindakan"
                              :key="item" autocomplete="nama" option-value="kdpegsimrs" option-label="nama" outlined
                              :source="store.dokters" class="col-6" @on-select="(val) => {
                                // console.log('selected pelaksana', val);
                                const finder = store.dokters.find(d => d.kdpegsimrs === val);
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
                            <app-input-simrs-mode type="wysiwyg" v-model="item.hasil" :disable="false"
                              class="col-12 q-mb-md" @update:model-value="(val) => {
                                item.hasil = val
                              }" :valid="{ required: true }" />
                            <div class="q-mb-sm">kesimpulan :</div>
                            <app-input-simrs-mode type="wysiwyg" v-model="item.kesimpulan" :disable="false"
                              @update:model-value="(val) => {
                                item.kesimpulan = val
                              }" class="col-12 q-mb-md" :valid="{ required: true }" />
                          </div>
                        </q-card-section>
                        <q-separator />

                        <q-card-section class="bg-yellow-2">
                          <div class="row q-col-gutter-sm justify-end">
                            <!-- <div class="col-auto">
                              <q-btn label="Batal" color="bg-dark" flat @click="store.batal(item)" />
                            </div> -->
                            <div class="col-auto">
                              <q-btn type="submit" label="Simpan" color="primary" class="q-mr-sm" />
                            </div>
                          </div>
                        </q-card-section>
                      </q-form>
                    </q-card>
                  </q-expansion-item>

                  <q-separator />
                </template>




              </q-list>


              <div class="q-mb-xl"></div>



            </div>



            <div v-else class="flex flex-center full-height q-pa-md bg-white" style="height:300px;">
              <div class="text-subtitle2">Tidak ada permintaan pemeriksaan radiologi.</div>
            </div>

          </div>




        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { date } from 'quasar'
import { formatRp } from 'src/modules/formatter'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { useListRadiologiLuarStore } from 'src/stores/simrs/radiologi/radiologiluar'
import { usePengunjungRanapStore } from 'src/stores/simrs/ranap/pengunjung'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})



const store = useListRadiologiLuarStore()
const storeRanap = usePengunjungRanapStore()

const { listPemeriksaans } = storeToRefs(store)


onMounted(() => {
  store.initPermintaan(props.pasien)
  // console.log('init Permintaan', listPemeriksaans.value);

  Promise.all([
    storeRanap.getNakes()
  ]).then(() => {
    store.initNakes(storeRanap)
  }).catch((err) => {
    // console.log('error', err)
  })
})


function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return date.formatDate(dateStr, 'DD MMMM YYYY HH:mm')
}

function hitungBilTotal() {
  // console.log('listPermintaans', listPermintaans.value);

  let total = 0
  const rincians = listPemeriksaans.value || []
  for (let i = 0; i < rincians?.length; i++) {
    const el = rincians[i];
    total += parseInt(el?.rs4) + parseInt(el?.rs6)
  }

  return formatRp(total)
}


function selesaikanLayanan() {
  store.selesaikanLayanan(props.pasien)
  // console.log('selesaikan layanan', props.pasien);

}

</script>