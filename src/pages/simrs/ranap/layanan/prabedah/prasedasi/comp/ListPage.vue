<template>
  <div class="fit bg-grey-2 q-pa-sm">
    <!-- BAR HEADER LIST -->
    <div class="q-pa-sm bg-white rounded-borders shadow-1 flex items-center justify-between q-mb-sm">
      <div class="flex items-center">
        <q-icon name="icon-mat-receipt_long" size="22px" color="primary" class="q-mr-xs" />
        <div class="text-subtitle2 text-bold text-primary">Riwayat Asesmen Pra Sedasi</div>
      </div>
      <q-chip dense color="blue-1" text-color="primary" class="text-bold">
        {{ items?.length || 0 }} Dokumen Terdaftar
      </q-chip>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="!items || !items.length" class="bg-white rounded-borders shadow-1 column flex-center q-pa-xl text-grey-6 fit" style="min-height: 300px;">
      <q-icon name="icon-mat-folder_open" size="64px" color="grey-4" />
      <div class="text-subtitle2 text-grey-7 q-mt-sm">Belum Ada Data Asesmen Pra Sedasi</div>
      <div class="text-caption text-grey-5">Silakan isi formulir di sebelah kiri untuk menambah data baru.</div>
    </div>

    <!-- CARDS LIST -->
    <q-scroll-area v-else style="height: calc(100vh - 210px);" class="q-pr-xs">
      <div class="row q-col-gutter-sm">
        <div v-for="(item, idx) in items" :key="item.id || idx" class="col-12">
          <q-card flat bordered class="bg-white rounded-borders shadow-1 hover-shadow transition-all">
            <q-card-section class="q-pa-sm">
              <div class="row items-center justify-between border-bottom-light q-pb-xs q-mb-xs">
                <div class="flex items-center">
                  <q-icon name="icon-mat-event" size="16px" color="primary" class="q-mr-xs" />
                  <span class="text-caption text-bold text-dark">{{ item?.tgl || 'Draft' }}</span>
                </div>
                <div class="flex items-center q-gutter-xs">
                  <q-badge color="teal-7" text-color="white" class="q-px-sm text-bold">
                    {{ item?.asa_classification || 'Tanpa ASA' }}
                  </q-badge>
                  <q-badge v-if="item?.perawatan_pasca_sedasi" color="blue-8" text-color="white" class="q-px-sm">
                    Pasca: {{ item?.perawatan_pasca_sedasi }}
                  </q-badge>
                </div>
              </div>

              <div class="row q-col-gutter-xs items-center">
                <div class="col-12 col-md-7">
                  <div class="text-caption text-grey-8 flex items-center">
                    <q-icon name="icon-mat-person" size="14px" class="q-mr-xs text-grey-6" />
                    Dokter Anestesi: <strong class="text-dark q-ml-xs">{{ item?.dokter || '-' }}</strong>
                  </div>
                  <div class="text-caption text-grey-7 flex items-center q-mt-xs">
                    <q-icon name="icon-mat-medical_information" size="14px" class="q-mr-xs text-grey-6" />
                    Teknik Sedasi: <span class="text-dark q-ml-xs">{{ item?.teknik_sedasi || '-' }}</span>
                  </div>
                </div>

                <div class="col-12 col-md-5 flex justify-end items-center q-gutter-xs">
                  <q-btn
                    unelevated
                    size="sm"
                    color="primary"
                    icon="icon-mat-visibility"
                    label="Lihat Detail"
                    @click="onDetail(item)"
                  >
                    <q-tooltip>Lihat Detail Asesmen</q-tooltip>
                  </q-btn>
                  <q-btn
                    outline
                    size="sm"
                    color="warning"
                    icon="icon-mat-edit"
                    label="Edit"
                    @click="emit('edit', item)"
                  >
                    <q-tooltip>Edit Asesmen ini</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    dense
                    size="sm"
                    color="negative"
                    icon="icon-mat-delete"
                    @click="emit('hapus', item)"
                  >
                    <q-tooltip>Hapus Data</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-scroll-area>

    <!-- DIALOG DETAIL DOKUMEN -->
    <CetakPraSedasiDialog v-model="dialogDetail" :item="selectedItem" :pasien="pasien" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CetakPraSedasiDialog from './CetakPraSedasiDialog.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'hapus'])

const dialogDetail = ref(false)
const selectedItem = ref(null)

function onDetail(item) {
  selectedItem.value = item
  dialogDetail.value = true
}
</script>

<style lang="scss" scoped>
.border-bottom-light {
  border-bottom: 1px solid #f0f0f0;
}
.transition-all {
  transition: all 0.2s ease-in-out;
}
.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}
</style>
