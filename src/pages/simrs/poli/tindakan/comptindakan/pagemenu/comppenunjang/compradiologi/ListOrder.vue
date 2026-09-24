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
    <div class="col full-height bg-grey-5">
      <div v-if="pasien?.radiologi?.length === 0" class="column full-height flex-center text-white">
        Belum Ada Permintaan Order
      </div>
      <q-scroll-area style="height: calc(100% - 1px);" v-else class="q-pa-sm">
        <transition-group name="list">
          <template v-for="(item, i) in filterredTable" :key="i">
            <q-list separator class="q-mb-sm list-move">
              <q-expansion-item
                class="q-pa-xs bg-white rounded-borders shadow-1"
                style="margin-bottom:.4em"
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
                        <div v-if="getPacsUrl(item, rinci)" class="q-my-sm">
                          <q-btn
                            color="indigo-9"
                            unelevated
                            icon="icon-mat-image"
                            label="Lihat Gambar Radiologi (Buka PACS)"
                            class="full-width text-weight-bold"
                            size="sm"
                            @click.stop="openPacs(getPacsUrl(item, rinci))"
                          />
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
            </q-list>
          </template>
        </transition-group>
        <div style="padding-bottom: 300px;"></div>
      </q-scroll-area>
    </div>

    <!-- dialog cetak -->
    <DialogCetakPermintaanRadiologi :pasien="pasien" :data="isiPrint" v-model="isPrint" />

    <!-- dialog PACS Viewer -->
    <DialogView v-model="isViewPacs" :viewerUrl="pacsUrl" />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRadiologiPoli } from 'src/stores/simrs/pelayanan/poli/radiologi'
import { computed, ref, defineAsyncComponent } from 'vue'
import { formatRp } from 'src/modules/formatter'

const DialogCetakPermintaanRadiologi = defineAsyncComponent(() => import('./DialogCetakPermintaanRadiologi.vue'))
const DialogView = defineAsyncComponent(() => import('src/pages/simrs/radiologi/tindakan/comptindakan/pagemenu/permintaan/comp/DialogView.vue'))

const $q = useQuasar()
const store = useRadiologiPoli()
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

const filterredTable = computed(() => {
  const val = store?.form?.nota
  const arr = props?.pasien?.radiologi
  return (val === 'SEMUA' || val === null || val === '') ? arr : arr?.filter(x => x?.rs2 === val)
})

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
  // Jika status sudah selesai (1), diproses (2), atau dibatalkan (3), jangan bisa hapus
  if (item?.rs9 === '1' || item?.rs9 === '2' || item?.rs9 === '3') return false
  // Jika rincian sudah memiliki hasil pemeriksaan
  const hasResult = item?.rincians?.some(r => (r?.hasil && r.hasil.length > 0) || (r?.hasilhtml && r.hasilhtml.length > 0))
  if (hasResult) return false
  return true
}

function getPacsUrl(item, rinci = null) {
  return rinci?.view_url || rinci?.view_url_local || item?.view_url || item?.pacs?.view_url || null
}

function openPacs(url) {
  if (!url) return
  pacsUrl.value = url
  isViewPacs.value = true
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
</style>
