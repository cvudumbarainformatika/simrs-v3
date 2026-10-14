<template>
  <div class="column full-height">
    <q-bar class="col-auto bg-teal text-white">
      <div class="q-py-sm f-14 text-weight-bold">
        List Order Radiologi
      </div>
      <q-space />
      <div class="q-py-xs">
        <q-select v-model="store.form.nota" outlined standout="bg-yellow-3" bg-color="white" dense
          :options="store.notas"
          :display-value="`NOTA: ${store.form.nota === null || store.form.nota === '' || store.form.nota === 'BARU' ? 'BARU' : store.form.nota}`"
          style="min-width: 200px;" />
      </div>
    </q-bar>
    <div class="col-grow bg-grey-5">
      <!-- jika belum ada pemeriksaan -->
      <div v-if="filterredTable?.length === 0" class="column full-height flex-center text-white">
        Belum Ada Permintaan Order
      </div>
      <q-scroll-area v-else style="height:calc(100% - 1px)" class="q-pa-sm">
        <q-list separator>
          <transition-group name="list">
            <template v-for="(item, i) in filterredTable" :key="i">
              <q-expansion-item
                class="q-pa-xs bg-white rounded-borders shadow-1 q-mb-sm"
                header-class="items-start"
                hide-expand-icon
              >
                <template #header>
                  <q-item-section>
                    <q-item-label caption class="text-weight-bold">
                      NOMOR : <span class="text-primary">{{ item?.rs2 }}</span>
                    </q-item-label>
                    <q-item-label caption class="q-mt-xs">
                      PERMINTAAN
                    </q-item-label>
                    <q-item-label lines="4" class="text-weight-medium text-dark f-12">
                      {{ item?.rs4 }}
                    </q-item-label>
                    <q-item-label caption class="q-mt-xs">
                      DIAGNOSA KERJA
                    </q-item-label>
                    <q-item-label lines="3" class="f-12">
                      {{ item?.rs7 || '-' }}
                    </q-item-label>
                    <q-item-label caption class="q-mt-xs">
                      CATATAN / Ket.Klinis
                    </q-item-label>
                    <q-item-label lines="3" class="f-12">
                      {{ item?.catatanpermintaan || '-' }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side class="justify-between items-end q-pl-xs" style="min-width: 105px;">
                    <!-- Baris Atas: Badge Status & Tombol Hapus (jika diizinkan) -->
                    <div class="row items-center q-gutter-xs no-wrap">
                      <q-badge
                        outline
                        :color="getStatusColor(item?.rs9)"
                        :label="getStatusLabel(item?.rs9)"
                        class="text-weight-bold text-caption"
                      />
                      <q-btn
                        v-if="canDelete(item)"
                        flat
                        dense
                        round
                        icon="icon-mat-delete"
                        color="negative"
                        size="sm"
                        @click.stop="hapusItem(item?.id)"
                      >
                        <q-tooltip>Hapus Permintaan</q-tooltip>
                      </q-btn>
                    </div>

                    <!-- Baris Bawah: Tombol PACS & Print yang Tertata Rapi -->
                    <div class="row items-center q-gutter-xs no-wrap q-mt-md">
                      <q-btn
                        v-if="getPacsUrl(item)"
                        size="sm"
                        color="indigo-9"
                        unelevated
                        dense
                        icon="icon-mat-image"
                        label="Buka PACS"
                        class="q-px-sm text-weight-bold"
                        @click.stop="openPacs(getPacsUrl(item))"
                      >
                        <q-tooltip>Lihat Citra PACS</q-tooltip>
                      </q-btn>

                      <q-btn
                        flat
                        dense
                        round
                        icon="icon-mat-print"
                        color="primary"
                        size="md"
                        @click.stop="handlePrint(item)"
                      >
                        <q-tooltip>Cetak Dokumen</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </template>

                <!-- Rincian & Hasil Radiologi -->
                <div class="q-pa-xs bg-grey-2">
                  <div v-if="item?.rincians?.length">
                    <div class="text-caption text-weight-bold q-pa-xs text-grey-8 f-12">
                      HASIL PEMERIKSAAN RADIOLOGI :
                    </div>
                    <q-card
                      v-for="(rinci, idx) in item.rincians"
                      :key="idx"
                      flat
                      bordered
                      class="q-mb-sm bg-white rounded-borders"
                    >
                      <q-card-section class="q-pa-xs bg-grey-9 text-white">
                        <div class="row items-center justify-between no-wrap">
                          <div class="text-weight-bold ellipsis col-grow f-12">
                            {{ rinci?.relmasterpemeriksaan?.rs2 || rinci?.nama || item?.rs4 }}
                            <span v-if="rinci?.relmasterpemeriksaan?.rs3" class="text-grey-4 f-11">
                              ({{ rinci?.relmasterpemeriksaan?.rs3 }})
                            </span>
                          </div>
                          <div class="col-auto text-right text-weight-bold text-amber-3 q-ml-sm f-12">
                            {{ formatRp(rinci?.subtotal) }}
                          </div>
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pa-sm">
                        <!-- Info Dokter Pelaksana -->
                        <div class="row items-center justify-between q-mb-xs">
                          <div class="text-grey-8 f-12">
                            <span class="text-weight-medium">Pelaksana: </span>
                            <span class="text-weight-bold text-primary">{{ rinci?.pelaksana || item?.dokter?.nama || '-' }}</span>
                          </div>
                        </div>

                        <!-- Tombol Buka PACS yang Mencolok & Jelas -->
                        <div v-if="getPacsUrl(item, rinci) || studyImagesMap[item?.rs2]?.length" class="q-my-sm">
                          <q-btn
                            v-if="getPacsUrl(item, rinci)"
                            color="indigo-9"
                            unelevated
                            icon="icon-mat-image"
                            label="Lihat Gambar Radiologi (Buka PACS)"
                            class="full-width text-weight-bold"
                            size="sm"
                            @click.stop="openPacs(getPacsUrl(item, rinci))"
                          />
                        </div>

                        <!-- Tampilan Gambar Basahan Radiologi / Orthanc PACS -->
                        <div v-if="getStudyImages(item)?.length" class="q-my-sm">
                          <div class="text-caption text-weight-bold text-grey-8 q-mb-xs flex items-center justify-between">
                            <div class="flex items-center">
                              <q-icon name="image" color="primary" class="q-mr-xs" size="xs" />
                              <span>Citra / Gambar Radiologi ({{ getStudyImages(item).length }}) :</span>
                            </div>
                            <div class="text-caption text-grey-6 text-italic" style="font-size: 11px;">
                              Klik gambar untuk memperbesar
                            </div>
                          </div>
                          <div class="row q-gutter-sm items-center q-py-xs">
                            <div
                              v-for="(img, imgIdx) in getStudyImages(item)"
                              :key="img.instance_id || imgIdx"
                              class="col-auto"
                            >
                              <q-card
                                bordered
                                flat
                                class="cursor-pointer overflow-hidden bg-black text-white hover-scale"
                                style="width: 120px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.25);"
                                @click.stop="previewImage(img)"
                              >
                                <q-img
                                  :src="PACS_IMAGE_BASE_URL + img.url"
                                  spinner-color="white"
                                  style="height: 110px; width: 120px"
                                  fit="cover"
                                  @error="onImageError(item?.rs2, img.index)"
                                >
                                  <div class="absolute-bottom text-caption text-center q-pa-none bg-black" style="opacity: 0.75; font-size: 10px;">
                                    Gbr {{ img.index + 1 }}
                                  </div>
                                </q-img>
                              </q-card>
                            </div>
                          </div>
                        </div>

                        <!-- Status Loading Gambar -->
                        <div v-else-if="loadingImagesMap[item?.rs2]" class="text-caption text-grey-6 flex items-center q-my-xs">
                          <q-spinner size="xs" color="primary" class="q-mr-xs" />
                          <span>Memuat citra radiologi...</span>
                        </div>

                        <!-- Hasil Pemeriksaan: Ukuran font disamakan dengan list (12px) -->
                        <div class="q-mb-sm">
                          <div class="text-weight-bold text-dark q-mb-xs f-12">Hasil :</div>
                          <div
                            v-if="rinci?.hasilhtml"
                            class="q-pa-sm bg-grey-1 rounded-borders hasil-radiologi-content"
                            v-html="rinci.hasilhtml"
                          ></div>
                          <div
                            v-else-if="rinci?.hasil"
                            class="q-pa-sm bg-grey-1 rounded-borders hasil-radiologi-content"
                            style="white-space: pre-wrap;"
                          >
                            {{ rinci.hasil }}
                          </div>
                          <div v-else class="text-italic text-grey-6 f-12">
                            Belum ada hasil yang diinputkan.
                          </div>
                        </div>

                        <!-- Kesimpulan: Ukuran font disamakan dengan list (12px) -->
                        <div>
                          <div class="q-pa-sm bg-teal-1 text-teal-10 rounded-borders" style="border-left: 4px solid #009688;">
                            <div class="text-weight-bold q-mb-xs f-12">Kesimpulan :</div>
                            <div
                              v-if="rinci?.kesimpulanhtml"
                              class="kesimpulan-radiologi-content"
                              v-html="rinci.kesimpulanhtml"
                            ></div>
                            <div
                              v-else-if="rinci?.kesimpulan"
                              class="kesimpulan-radiologi-content"
                              style="white-space: pre-wrap;"
                            >
                              {{ rinci.kesimpulan }}
                            </div>
                            <div v-else class="text-italic text-grey-6 f-12">
                              Belum ada kesimpulan.
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div v-else class="q-pa-sm text-center text-grey-6 f-12 bg-white rounded-borders">
                    <q-icon name="icon-mat-hourglass_empty" size="sm" class="q-mr-xs" />
                    Menunggu proses dan penginputan hasil dari instalasi Radiologi.
                  </div>
                </div>

              </q-expansion-item>
            </template>
          </transition-group>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- dialog cetak -->
    <DialogCetakPermintaanRadiologi :pasien="pasien" :data="isiPrint" v-model="isPrint" />

    <!-- dialog PACS Viewer -->
    <DialogView v-model="isViewPacs" :viewerUrl="pacsUrl" />

    <!-- dialog Preview Gambar Basahan -->
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
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useRadiologiIgd } from 'src/stores/simrs/igd/radiologi'
import { computed, ref, defineAsyncComponent, watch } from 'vue'
import { formatRp } from 'src/modules/formatter'
import { openPacsViewer } from 'src/modules/utils'

const DialogCetakPermintaanRadiologi = defineAsyncComponent(() => import('src/pages/simrs/poli/tindakan/comptindakan/pagemenu/comppenunjang/compradiologi/DialogCetakPermintaanRadiologi.vue'))
const DialogView = defineAsyncComponent(() => import('src/pages/simrs/radiologi/tindakan/comptindakan/pagemenu/permintaan/comp/DialogView.vue'))

const $q = useQuasar()
const router = useRouter()
const store = useRadiologiIgd()
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  bisaEditHapus: {
    type: Boolean,
    default: true
  }
})

const isPrint = ref(false)
const isiPrint = ref(null)

const isViewPacs = ref(false)
const pacsUrl = ref(null)

const PACS_IMAGE_BASE_URL = 'http://192.168.150.134:8001'
const studyImagesMap = ref({})
const loadingImagesMap = ref({})
const dialogPreviewImg = ref(false)
const selectedPreviewImg = ref(null)

function previewImage(img) {
  selectedPreviewImg.value = img
  dialogPreviewImg.value = true
}

function onImageError(rawNota, imgIndex) {
  if (studyImagesMap.value[rawNota]) {
    studyImagesMap.value[rawNota] = studyImagesMap.value[rawNota].filter(img => img.index !== imgIndex)
  }
}

function getStudyImages(item) {
  const rawNota = item?.rs2
  if (!rawNota) return []
  if (studyImagesMap.value[rawNota] === undefined && !loadingImagesMap.value[rawNota]) {
    fetchStudyImagesByNota(rawNota)
  }
  return studyImagesMap.value[rawNota] || []
}

async function fetchStudyImagesByNota(rawNota) {
  if (!rawNota) return
  if (studyImagesMap.value[rawNota] !== undefined) return
  const notaClean = rawNota.replace(/\//g, '_')
  loadingImagesMap.value[rawNota] = true
  try {
    let res = null
    // 1. Coba lewat proxy devServer /pacs-proxy terlebih dahulu (agar terhindar dari CORS)
    try {
      res = await fetch(`/pacs-proxy/api/v1/study/${notaClean}/images`)
    } catch (e) {
      // proxy belum ready / error
    }

    // 2. Jika proxy tidak berhasil, coba fetch langsung ke server PACS
    if (!res || !res.ok) {
      try {
        res = await fetch(`${PACS_IMAGE_BASE_URL}/api/v1/study/${notaClean}/images`)
      } catch (e) {
        // jika terblokir CORS
      }
    }

    if (res && res.ok) {
      const data = await res.json()
      if (data?.status === 'success' && Array.isArray(data?.images) && data.images.length > 0) {
        studyImagesMap.value[rawNota] = data.images
        return
      }
    }

    // 3. Fallback jika fetch metadata JSON terblokir CORS:
    // Buat slot citra default index 0 (karena tag <img> tidak diblokir CORS)
    studyImagesMap.value[rawNota] = [
      {
        index: 0,
        url: `/api/v1/study/${notaClean}/jpeg?index=0&width=800`,
        hd_url: `/api/v1/study/${notaClean}/jpeg?index=0`
      }
    ]
  } catch (err) {
    console.error('Gagal fetch gambar PACS untuk nota:', rawNota, err)
    studyImagesMap.value[rawNota] = [
      {
        index: 0,
        url: `/api/v1/study/${notaClean}/jpeg?index=0&width=800`,
        hd_url: `/api/v1/study/${notaClean}/jpeg?index=0`
      }
    ]
  } finally {
    loadingImagesMap.value[rawNota] = false
  }
}

const filterredTable = computed(() => {
  const val = store?.form?.nota
  const arr = props?.pasien?.radiologi
  return (val === 'SEMUA' || val === null || val === '') ? arr : arr?.filter(x => x?.rs2 === val)
})

watch(
  () => [props.pasien?.radiologi, store.form.nota, filterredTable.value],
  () => {
    const arr = filterredTable.value || props.pasien?.radiologi
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (item?.rs2) {
          fetchStudyImagesByNota(item.rs2)
        }
      })
    }
  },
  { immediate: true, deep: true }
)

function getStatusLabel(status) {
  if (status === '1') return 'Selesai'
  if (status === '2') return 'Diproses'
  if (status === '3') return 'Dibatalkan'
  return 'Permintaan'
}

function getStatusColor(status) {
  if (status === '1') return 'positive'
  if (status === '2') return 'warning'
  if (status === '3') return 'negative'
  return 'primary'
}

function canDelete(item) {
  if (!props.bisaEditHapus) return false
  if (item?.rs9 === '1' || item?.rs9 === '2' || item?.rs9 === '3') return false
  const hasResult = item?.rincians?.some(r => (r?.hasil && r.hasil.length > 0) || (r?.hasilhtml && r.hasilhtml.length > 0))
  if (hasResult) return false
  return true
}

function getPacsUrl(item, rinci = null) {
  if (rinci) {
    if (rinci?.view_url || rinci?.view_url_local) {
      return rinci.view_url || rinci.view_url_local
    }
    if (item?.view_url || item?.pacs?.view_url) {
      return item.view_url || item.pacs.view_url
    }
    if (studyImagesMap.value[item?.rs2]?.length > 0) {
      return item?.view_url || item?.pacs?.view_url || null
    }
    if (!rinci?.relmasterpemeriksaan?.alat && !rinci?.alat) {
      return null
    }
    return rinci?.view_url || rinci?.view_url_local || null
  }
  const r = item?.rincians?.[0] || item?.rinciansementara?.[0]
  const hasAlat = !!(r?.relmasterpemeriksaan?.alat || r?.alat || studyImagesMap.value[item?.rs2]?.length > 0)
  if (!hasAlat) {
    return null
  }
  if (item?.rincians?.length === 1) {
    return item?.rincians[0]?.view_url || item?.rincians[0]?.view_url_local || item?.view_url || item?.pacs?.view_url || null
  }
  return item?.view_url || item?.pacs?.view_url || null
}

function openPacs(url) {
  if (!url) return
  pacsUrl.value = url
  openPacsViewer(url, router)
}

function handlePrint(item) {
  isPrint.value = true
  isiPrint.value = item
}

function hapusItem(id) {
  $q.dialog({
    dark: true,
    title: 'Peringatan',
    message: 'Apakah Data ini akan dihapus?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusRadiologi(props.pasien, id)
  }).onCancel(() => {
    // console.log('Cancel')
  })
}
</script>

<style scoped>
.f-11 {
  font-size: 11px;
}
.f-12 {
  font-size: 12px;
}

.hasil-radiologi-content,
.hasil-radiologi-content :deep(*) {
  font-size: 12px !important;
  line-height: 1.45 !important;
}

.kesimpulan-radiologi-content,
.kesimpulan-radiologi-content :deep(*) {
  font-size: 12px !important;
  line-height: 1.45 !important;
}

.hover-scale {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35) !important;
}
</style>
