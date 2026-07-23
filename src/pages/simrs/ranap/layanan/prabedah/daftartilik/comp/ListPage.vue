<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useDaftarTilikStore } from 'src/stores/simrs/ranap/daftartilik'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const CetakDaftarTilikDialog = defineAsyncComponent(() => import('./CetakDaftarTilikDialog.vue'))

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
const store = useDaftarTilikStore()
const route = useRoute()

// Banner notifikasi konfirmasi penerimaan hanya muncul saat diakses di modul Ruang Rawat (Ranap)
const isRuanganPage = computed(() => {
  const path = route?.path || ''
  return !path.includes('kamaroperasi')
})

const dialogCetak = ref(false)
const selectedItemCetak = ref(null)

const openCetak = (item) => {
  selectedItemCetak.value = item
  dialogCetak.value = true
}

// Menghitung statistik checklist untuk tampilan yang informatif (Smart UI)
const getStats = (item) => {
  const checklist = item.checklist || {}
  const total = store.checklistMasters.length
  let ya = 0
  let tidak = 0
  let empty = 0
  
  store.checklistMasters.forEach(master => {
    const status = checklist[master.kode]?.status
    if (status === 'Ya') ya++
    else if (status === 'Tidak') tidak++
    else empty++
  })
  
  const percentage = total > 0 ? (ya / total) : 0
  return { ya, tidak, empty, percentage }
}

// Mendapatkan list item checklist yang tercentang "Ya" atau "Tidak"
const getCheckedItems = (item, status) => {
  const checklist = item.checklist || {}
  const result = []
  store.checklistMasters.forEach(master => {
    const val = checklist[master.kode]
    if (val && val.status === status) {
      result.push({
        kode: master.kode,
        label: master.label,
        keterangan: val.keterangan
      })
    }
  })
  return result
}
</script>

<template>
  <div class="fit column relative-position bg-grey-1">
    <!-- List Area -->
    <div class="col q-pa-md scroll relative-position">
      <!-- Empty State Premium -->
      <div v-if="!items.length" class="fit flex flex-center bg-white border-panel" style="border-radius: 12px; min-height: 380px;">
        <div class="text-center text-grey-5 q-pa-lg">
          <div class="empty-icon-wrapper q-mx-auto q-mb-md flex flex-center">
            <q-icon name="icon-mat-fact_check" size="48px" class="text-indigo-10" />
          </div>
          <div class="text-bold text-h6 text-indigo-10">Belum Ada Riwayat</div>
          <div class="text-caption text-grey-6 q-mt-xs">Formulir Daftar Tilik Pre-Operasi pasien akan terdaftar di bawah ini setelah disimpan.</div>
        </div>
      </div>

      <!-- List Cards (Flat & Premium like MPP Form) -->
      <div v-else class="q-gutter-y-md">
        <q-card v-for="(item, idx) in items" :key="item.id || idx" flat bordered class="tilik-card overflow-hidden bg-white">
          
          <!-- Indikator Persentase Kelengkapan -->
          <q-linear-progress 
            :value="getStats(item).percentage" 
            color="indigo-10" 
            track-color="indigo-1" 
            class="full-width" 
            style="height: 4px;" 
          />

          <q-card-section class="q-pa-md">
            <!-- Header: Title, Icon & Ward -->
            <div class="row items-center justify-between q-mb-sm">
              <div class="row items-center q-gutter-x-sm">
                <q-avatar class="bg-indigo-gradient text-white shadow-2" size="36px">
                  <q-icon name="icon-mat-fact_check" size="18px" />
                </q-avatar>
                <div>
                  <div class="text-weight-bold text-indigo-10 text-subtitle2" style="font-size: 14px;">Daftar Tilik Pre-Operasi</div>
                  <div class="text-grey-7 text-caption" style="font-size: 11px;">Ruang Rawat: <span class="text-weight-bold text-dark">{{ item.ruang_rawat || '-' }}</span></div>
                </div>
              </div>
              
              <!-- Completion Badge -->
              <q-badge color="indigo-1" text-color="indigo-10" class="text-weight-bold q-px-sm q-py-xs" style="font-size: 10px;">
                {{ getStats(item).ya }} dari 24 Lengkap (Ya)
              </q-badge>
            </div>

            <q-separator class="q-my-sm text-grey-3" />

            <!-- Summary List (Directly visible list of checked items like MPP) -->
            <div class="q-gutter-y-sm q-my-sm">
              <!-- Kelompok YA -->
              <div v-if="getCheckedItems(item, 'Ya').length" class="q-pa-sm rounded-borders bg-green-0 text-green-9 text-caption">
                <div class="text-weight-bold q-mb-xs flex items-center text-uppercase" style="font-size: 10px; letter-spacing: 0.5px;">
                  <q-icon name="icon-mat-check_circle" size="14px" class="q-mr-xs text-green-9" />
                  <span>Kelengkapan (YA):</span>
                </div>
                <div class="row q-col-gutter-xs">
                  <div v-for="chk in getCheckedItems(item, 'Ya')" :key="chk.kode" class="col-12 col-sm-6 text-xxs flex items-start text-grey-9">
                    <span class="q-mr-xs text-green-9 text-weight-bold">•</span>
                    <span>
                      {{ chk.label }} 
                      <span v-if="chk.keterangan" class="text-grey-6 italic font-mono text-xxs">({{ chk.keterangan }})</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Kelompok TIDAK -->
              <div v-if="getCheckedItems(item, 'Tidak').length" class="q-pa-sm rounded-borders bg-red-0 text-red-9 text-caption">
                <div class="text-weight-bold q-mb-xs flex items-center text-uppercase" style="font-size: 10px; letter-spacing: 0.5px;">
                  <q-icon name="icon-mat-cancel" size="14px" class="q-mr-xs text-red-9" />
                  <span>Belum Lengkap (TIDAK):</span>
                </div>
                <div class="row q-col-gutter-xs">
                  <div v-for="chk in getCheckedItems(item, 'Tidak')" :key="chk.kode" class="col-12 col-sm-6 text-xxs flex items-start text-red-10">
                    <span class="q-mr-xs text-red-9 text-weight-bold">•</span>
                    <span class="text-weight-medium">
                      {{ chk.label }} 
                      <span v-if="chk.keterangan" class="text-grey-7 italic font-mono text-xxs">({{ chk.keterangan }})</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Catatan Pre-Op -->
            <div v-if="item.catatan" class="bg-grey-2 q-pa-sm rounded-borders text-caption text-grey-8 font-mono q-mb-sm" style="font-size: 11px; white-space: pre-wrap;">
              <strong>Catatan:</strong> {{ item.catatan }}
            </div>

            <!-- Informasi Seluruh Petugas (Pre & Paska Operasi) -->
            <div class="bg-indigo-0 q-pa-sm rounded-borders text-caption text-grey-9 q-mb-sm border-indigo-light">
              <div class="text-weight-bold text-indigo-10 q-mb-xs flex items-center" style="font-size: 11px;">
                <q-icon name="icon-mat-group" size="16px" class="q-mr-xs" />
                <span>DAFTAR PETUGAS SERAH TERIMA:</span>
              </div>
              <div class="row q-col-gutter-xs" style="font-size: 11px;">
                <!-- Pre-Op -->
                <div class="col-12 col-sm-6">
                  <div class="text-weight-bold text-grey-7" style="font-size: 10px;">PRE-OPERASI:</div>
                  <div class="q-pl-xs">
                    • Pengantar (Ruangan): <strong class="text-indigo-10 font-mono">{{ item.petugas_pengantar_nama || '-' }}</strong>
                  </div>
                  <div class="q-pl-xs">
                    • Penerima (Kamar OK): <strong class="text-indigo-10 font-mono">{{ item.petugas_penerima_nama || '-' }}</strong>
                  </div>
                </div>
                <!-- Paska-Op -->
                <div class="col-12 col-sm-6">
                  <div class="text-weight-bold text-grey-7" style="font-size: 10px;">PASKA-OPERASI:</div>
                  <div class="q-pl-xs">
                    • Pengantar (Kamar OK): <strong class="text-indigo-10 font-mono">{{ item.paska_petugas_pengantar_nama || '-' }}</strong>
                  </div>
                  <div class="q-pl-xs">
                    • Penerima (Ruangan): <strong class="text-indigo-10 font-mono">{{ item.paska_petugas_penerima_nama || '-' }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <q-separator class="q-my-sm text-grey-3" />

            <!-- Bottom: Date / Time & Action Buttons (Edit, Hapus) -->
            <div class="row items-center justify-between q-pt-xs">
              <!-- Date and Time of record -->
              <div class="row items-center text-grey-6 text-caption q-gutter-x-sm" style="font-size: 11px;">
                <q-icon name="icon-mat-event" size="14px" class="text-indigo-10" />
                <span class="text-weight-medium">{{ dateFullFormat(item.created_at) }}</span>
                <span class="text-grey-4">|</span>
                <q-icon name="icon-mat-access_time" size="14px" class="text-indigo-10" />
                <span class="font-mono text-weight-medium">Pukul {{ jamTnpDetik(item.created_at) }}</span>
              </div>

              <!-- Outlined Action Buttons -->
              <div class="row q-gutter-x-xs">
                <!-- Tombol cetak disembunyikan karena pencetakan utama berada di menu Dokumen -->
                <!-- <q-btn
                  outline
                  dense
                  color="teal-7"
                  icon="icon-mat-print"
                  label="Cetak"
                  size="sm"
                  class="q-px-sm action-btn"
                  @click="openCetak(item)"
                >
                  <q-tooltip>Cetak Lembar Tilik Pre & Paska Operasi</q-tooltip>
                </q-btn> -->
                <q-btn
                  outline
                  dense
                  color="indigo-7"
                  icon="icon-mat-edit"
                  label="Edit"
                  size="sm"
                  class="q-px-sm action-btn"
                  @click="emit('edit', item)"
                >
                  <q-tooltip>Edit Data</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  dense
                  color="red-7"
                  icon="icon-mat-delete"
                  label="Hapus"
                  size="sm"
                  class="q-px-sm action-btn"
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

    <!-- Dialog Cetak -->
    <CetakDaftarTilikDialog
      v-model="dialogCetak"
      :pasien="props.pasien"
      :item="selectedItemCetak"
    />

    <!-- Inner loading -->
    <q-inner-loading :showing="store.loading" class="bg-white-5">
      <q-spinner-dots size="48px" color="indigo-10" />
    </q-inner-loading>
  </div>
</template>

<style scoped>
.border-panel {
  border: 1px solid #e0e0e0;
}
.bg-indigo-gradient {
  background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
}
.bg-green-0 {
  background-color: #f1fbf3;
  border: 1px dashed #a5d6a7;
}
.bg-red-0 {
  background-color: #fdf2f2;
  border: 1px dashed #ef9a9a;
}
.empty-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #f0f4ff;
  border: 2px dashed #3f51b5;
}

/* Tilik Card Hover & Premium Transitions */
.tilik-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.tilik-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 35, 126, 0.12) !important;
}

.action-btn {
  border-radius: 6px;
  font-weight: bold;
  font-size: 11px;
}
.text-xxs {
  font-size: 10px;
  line-height: 1.4;
}
.text-uppercase {
  text-transform: uppercase;
}
</style>
