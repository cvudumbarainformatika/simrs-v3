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
              <div v-if="pasien.status === '2'" class="flex q-gutter-sm">
                <!-- <q-btn :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan" color="negative"
                  label="Batalkan Layanan" @click="batalkanPermintaan"></q-btn>
                <q-btn :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan" color="primary"
                  label="Selesaikan Layanan" @click="selesaikanLayanan"></q-btn> -->
                <q-btn color="primary" rounded disabled outline>
                  <q-icon name="icon-mat-done" class="q-mr-md"></q-icon>
                  <div>Proses Layanan ...</div>
                </q-btn>
              </div>
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

          <div v-if="hasAlatPacs && permintaan?.rincians?.length" class="q-my-sm flex justify-end">
            <!-- {{ permintaan?.rincians[0] }} -->
            <q-btn
              v-if="permintaan?.rincians[0]?.view_url"
              label="Lihat View PACS"
              icon="open_in_new"
              color="dark"
              @click="openViewPacs(permintaan?.rincians[0]?.view_url)"
            />
          </div>
        </q-banner>
      </q-list>



    </div>

    <div v-if="props?.pasien?.duplicates?.has" class="q-pa-md bg-negative text-white text-center">
      <div>
        <q-icon name="icon-mat-warning" size="lg"></q-icon>
      </div>
      Permintaan ini Sudah Pernah Diinputkan Sebelumnya dengan Permintaan :
      {{ props?.pasien?.duplicates?.details[0]?.permintaans?.join(', ') }}
      <div>
        Pada Nota Permintaan :
        <b>{{props?.pasien?.duplicates?.details[0]?.items?.map(item => item?.nota).join(', ')}}</b>
      </div>
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

                    <!-- Bagian View PACS & Gambar Basahan -->
                    <div v-if="itemHasPacs(item, index)" class="col-12 q-my-sm">
                      <div class="q-pa-sm rounded-borders bg-grey-1" style="border: 1px solid #e0e0e0;">
                        <div class="row items-center justify-between q-mb-xs">
                          <div class="text-weight-bold text-subtitle2 flex items-center">
                            <q-icon name="image" class="q-mr-xs text-primary" size="sm" />
                            <span>Gambar Radiologi & PACS</span>
                            <q-badge v-if="studyImages?.length" color="primary" class="q-ml-sm">
                              {{ studyImages.length }} Foto
                            </q-badge>
                          </div>
                          <div class="row items-center q-gutter-xs">
                            <q-btn
                              flat
                              round
                              dense
                              icon="refresh"
                              size="sm"
                              color="primary"
                              :loading="loadingImages"
                              title="Muat Ulang Gambar"
                              @click="fetchStudyImages(getNotaString())"
                            />
                            <q-btn
                              v-if="getItemViewUrl(item, index)"
                              label="Lihat View PACS"
                              icon="open_in_new"
                              color="dark"
                              size="sm"
                              unelevated
                              @click="openViewPacs(getItemViewUrl(item, index))"
                            />
                          </div>
                        </div>

                        <!-- Status Loading Gambar -->
                        <div v-if="loadingImages" class="text-caption text-grey-7 q-py-sm flex items-center">
                          <q-spinner size="sm" color="primary" class="q-mr-xs" />
                          <span>Memuat gambar basahan...</span>
                        </div>

                        <!-- Galeri Gambar Basahan (JPEG) -->
                        <div v-else-if="studyImages?.length" class="row q-gutter-sm items-center q-pt-xs">
                          <div
                            v-for="(img, imgIdx) in studyImages"
                            :key="img.instance_id || imgIdx"
                            class="col-auto"
                          >
                            <q-card
                              bordered
                              flat
                              class="cursor-pointer overflow-hidden bg-black text-white hover-scale"
                              style="width: 130px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.2);"
                              @click="previewImage(img)"
                            >
                              <q-img
                                :src="PACS_IMAGE_BASE_URL + img.url"
                                spinner-color="white"
                                style="height: 120px; width: 130px"
                                fit="cover"
                                @error="onImageError(img.index)"
                              >
                                <div class="absolute-bottom text-caption text-center q-pa-none bg-black" style="opacity: 0.75; font-size: 11px;">
                                  Gbr {{ img.index + 1 }}
                                </div>
                              </q-img>
                            </q-card>
                          </div>
                        </div>

                        <div v-else class="text-caption text-grey-6 q-py-xs">
                          Belum ada file gambar basahan dari server PACS.
                        </div>
                      </div>
                    </div>

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
                    <div class="row q-col-gutter-sm items-center">
                      <div class="col-auto">
                        <q-btn label="Reset" color="bg-dark" flat @click="storePermintaan.reset(item)" />
                      </div>
                      <div class="col-auto">
                        <q-btn label="Simpan" color="primary" class="q-mr-sm"
                          @click="storePermintaan.simpan(item, pasien)" />
                      </div>
                    </div>
                    <div class="row q-col-gutter-sm items-center">
                      <div class="col-auto" v-if="(item?.hasil && item.hasil.length > 1) || (item?.hasilhtml && item.hasilhtml.length > 1)">
                        <q-btn
                          icon="icon-mat-print"
                          color="dark"
                          label="Cetak Hasil"
                          unelevated
                          size="sm"
                          @click="bukaPrint(item)"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-separator />
          </template>
        </q-list>

        <!-- Print modal dipasang di luar loop agar tidak duplikat -->
        <PrintModal v-model="isPrint" :item="selectedItemPrint" :pasien="pasien" />

        <div class="q-pa-md text-right">
          <div class="flex justify-between" v-if="pasien.status === '2'">
            <q-btn :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan" color="negative"
              label="BATALKAN PERMINTAAN" @click="batalkanPermintaan"></q-btn>
            <q-btn :loading="store.loadingSelesaikan" :disabled="store.loadingSelesaikan" color="primary"
              label="Selesaikan Layanan" @click="selesaikanLayanan"></q-btn>
          </div>


          <div v-else-if="pasien.status === '1'">
            <q-btn v-if="listPermintaans?.length" color="dark" class="q-px-md" @click="bukaPrint(listPermintaans[0])">
              <q-icon name="icon-mat-print" class="q-mr-sm" />
              <span>Cetak</span>
            </q-btn>
          </div>
        </div>

        <div class="q-mb-xl"></div>
      </div>



      <div v-else class="flex flex-center full-height q-pa-md bg-white" style="height:300px;">
        <div class="text-subtitle2">Tidak ada permintaan pemeriksaan radiologi.</div>
      </div>

    </div>





  </q-card>


  <DialogView v-model="isView" :viewerUrl="viewUrl" />

  <!-- Dialog Preview Gambar Basahan / PACS -->
  <q-dialog v-model="dialogPreviewImg">
    <q-card style="min-width: 600px; max-width: 90vw; background: #121212; color: white;">
      <q-bar class="bg-grey-9 text-white">
        <div>Gambar Radiologi {{ (selectedPreviewImg?.index ?? 0) + 1 }}</div>
        <q-space />
        <q-btn
          flat
          dense
          icon="open_in_new"
          title="Buka Resolusi Penuh"
          :href="PACS_IMAGE_BASE_URL + (selectedPreviewImg?.hd_url || selectedPreviewImg?.url)"
          target="_blank"
        />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <q-card-section class="flex flex-center q-pa-sm" style="max-height: 80vh; overflow: auto;">
        <img
          v-if="selectedPreviewImg"
          :src="PACS_IMAGE_BASE_URL + (selectedPreviewImg?.hd_url || selectedPreviewImg?.url)"
          style="max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 4px;"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { date, useQuasar } from 'quasar'
import { useListPasienRadiologiStore } from 'src/stores/simrs/radiologi/radiologi'
import { usePermintaanRadiologiStore } from 'src/stores/simrs/radiologi/permintaan'
import { storeToRefs } from 'pinia';
import { formatRp } from 'src/modules/formatter'
import { notifErrVue, openPacsViewer } from 'src/modules/utils'

import PrintModal from './PrintModal.vue'
import DialogView from './DialogView.vue'

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

const $q = useQuasar()
const router = useRouter()

const store = useListPasienRadiologiStore()
const storePermintaan = usePermintaanRadiologiStore()
const { permintaan, listPermintaans, ukurans, } = storeToRefs(storePermintaan)

// console.log('permintaan', permintaan, listPermintaans, props.pasien);
const refDialogPrint = ref(null)
const isActive = ref(null)
const isPrint = ref(false)
const selectedItemPrint = ref(null)
const isView = ref(false)
const viewUrl = ref(null)

const PACS_IMAGE_BASE_URL = 'http://192.168.150.134:8001'
const studyImages = ref([])
const loadingImages = ref(false)
const dialogPreviewImg = ref(false)
const selectedPreviewImg = ref(null)

function previewImage(img) {
  selectedPreviewImg.value = img
  dialogPreviewImg.value = true
}

function onImageError(imgIndex) {
  studyImages.value = studyImages.value.filter(img => img.index !== imgIndex)
}

function getNotaString() {
  return (
    props.pasien?.nota_permintaan ||
    permintaan.value?.nota_permintaan ||
    permintaan.value?.rs2 ||
    props.pasien?.notrans ||
    props.pasien?.rs2 ||
    ''
  )
}

async function fetchStudyImages(nota) {
  if (!nota) {
    studyImages.value = []
    return
  }
  const notaClean = nota.replace(/\//g, '_')
  loadingImages.value = true
  try {
    let res = null
    // 1. Coba lewat proxy devServer /pacs-proxy (hindari CORS)
    try {
      res = await fetch(`/pacs-proxy/api/v1/study/${notaClean}/images`)
    } catch (e) {
      // proxy belum aktif / error
    }

    // 2. Jika proxy tidak berhasil, coba fetch langsung
    if (!res || !res.ok) {
      try {
        res = await fetch(`${PACS_IMAGE_BASE_URL}/api/v1/study/${notaClean}/images`)
      } catch (e) {
        // jika CORS error
      }
    }

    if (res && res.ok) {
      const data = await res.json()
      if (data?.status === 'success' && Array.isArray(data?.images) && data.images.length > 0) {
        studyImages.value = data.images
        return
      }
    }

    // 3. Fallback jika fetch JSON diblokir CORS:
    // Buat slot citra default index 0 (tag <img> tidak diblokir CORS)
    studyImages.value = [
      {
        index: 0,
        url: `/api/v1/study/${notaClean}/jpeg?index=0&width=800`,
        hd_url: `/api/v1/study/${notaClean}/jpeg?index=0`
      }
    ]
  } catch (err) {
    console.error('Gagal mengambil gambar study PACS:', err)
    studyImages.value = [
      {
        index: 0,
        url: `/api/v1/study/${notaClean}/jpeg?index=0&width=800`,
        hd_url: `/api/v1/study/${notaClean}/jpeg?index=0`
      }
    ]
  } finally {
    loadingImages.value = false
  }
}

watch(
  () => [props.pasien?.nota_permintaan, permintaan.value?.rs2, permintaan.value?.nota_permintaan],
  () => {
    const n = getNotaString()
    fetchStudyImages(n)
  },
  { immediate: true }
)

const hasAlatPacs = computed(() => {
  const fromPasien = props.pasien?.rinciansementara?.some(r => !!r?.relmasterpemeriksaan?.alat)
  const fromRinci = permintaan.value?.rincians?.some(r => !!r?.alat)
  return fromPasien || fromRinci || false
})

function getItemViewUrl(item, index) {
  return (
    item?.view_url ||
    permintaan.value?.rincians?.find(r => r.rs1 === item?.rs1 || r.id === item?.id)?.view_url ||
    permintaan.value?.rincians?.[index]?.view_url ||
    permintaan.value?.rincians?.[0]?.view_url ||
    props.pasien?.view_url ||
    null
  )
}

function itemHasPacs(item, index) {
  const url = getItemViewUrl(item, index)
  const alat = !!(item?.alat || item?.relmasterpemeriksaan?.alat || hasAlatPacs.value)
  return !!(url || alat || studyImages.value?.length > 0)
}

function bukaPrint(item) {
  selectedItemPrint.value = item
  isPrint.value = true
}

function openViewPacs(url) {
  if (!url) return
  viewUrl.value = url
  openPacsViewer(url, router)
}

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

function batalkanPermintaan() {
  console.log('batalkan item', props.pasien);

  $q.dialog({
    title: 'Alasan Pembatalan',
    message: `Berikan Alasan Pembatalan Pada Pasien <b>${props?.pasien?.nama} dengan </b> Nota Permintaan <b class="text-negative">${props?.pasien?.nota_permintaan}</b> dari ruangan <b>${props?.pasien?.ruangan}</b> ini`,
    prompt: {
      model: '',
      isValid: val => val.length > 2, // << here is the magic
      type: 'text' // optional
    },
    cancel: true,
    persistent: true,
    html: true
  }).onOk(data => {
    store.batalkanPasien(props.pasien, data)
  })

}






</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35) !important;
}
</style>