<template>
  <div class="fit column no-wrap bg-grey-2">
    <!-- Header Pendek Form -->
    <div class="row items-center justify-between q-pa-md bg-white border-b shadow-sm col-auto">
      <div class="text-subtitle1 text-bold text-indigo-10 flex items-center">
        <q-icon name="icon-mat-assignment_turned_in" class="q-mr-sm" size="sm" />
        FORMULIR SKRINING MANAJEMEN PELAYANAN PASIEN (MPP)
      </div>
    </div>

    <!-- Konten Form Utama -->
    <div class="col q-pa-md mpp-grid-container">
      <div class="row q-col-gutter-md mpp-grid">
        
        <!-- Kolom Kiri: Input Formulir Skrining (Scroll Mandiri di Desktop) -->
        <div class="col-xs-12 col-md-7 mpp-col-left column no-wrap">
          <div class="col scroll bg-white border-card">
            <q-list separator>
              
              <!-- 1. Usia -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">1.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Usia</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-lg">
                    <q-radio v-model="form.usia" val="Anak-anak" label="Anak-anak" dense color="indigo-10" />
                    <q-radio v-model="form.usia" val="Dewasa" label="Dewasa" dense color="indigo-10" />
                    <q-radio v-model="form.usia" val="Lansia" label="Lansia (Geriatri)" dense color="indigo-10" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 2. Kognitif Rendah -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">2.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Pasien dengan Kognitif yang Rendah</q-item-label>
                  <q-item-label caption>Memiliki kendala pemahaman, demensia, atau gangguan kognitif lainnya</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.kognitif_rendah" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 3. Resiko Tinggi -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">3.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Pasien dengan Resiko Tinggi</q-item-label>
                  <q-item-label caption>Kondisi klinis kritis, risiko jatuh tinggi, risiko infeksi tinggi, dll.</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.resiko_tinggi" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 4. Potensi Komplain Tinggi -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">4.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Potensi Komplain Tinggi</q-item-label>
                  <q-item-label caption>Adanya riwayat ketidakpuasan terhadap pelayanan atau keluarga yang sangat kritis</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.potensi_komplain" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 5. Kasus Penyakit -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">5.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kasus Penyakit</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-lg">
                    <q-radio v-model="form.kasus_penyakit" val="Akut" label="Akut" dense color="indigo-10" />
                    <q-radio v-model="form.kasus_penyakit" val="Kronis" label="Kronis" dense color="indigo-10" />
                    <q-radio v-model="form.kasus_penyakit" val="Komplek" label="Komplek" dense color="indigo-10" />
                    <q-radio v-model="form.kasus_penyakit" val="Terminal" label="Terminal" dense color="indigo-10" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 6. Status Fungsional ADL -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">6.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Status Fungsional Rendah, Kebutuhan Bantuan ADL (Activity Daily Living) yang Tinggi dan Membutuhkan Pendampingan</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.keterbatasan_adl" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 7. Riwayat Peralatan Medis -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">7.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Riwayat Penggunaan Peralatan Medis</q-item-label>
                  <div class="q-mt-sm">
                    <q-checkbox v-model="form.pakai_alat_medis" label="Ya, menggunakan peralatan medis khusus" color="indigo-10" dense />
                  </div>
                  <q-slide-transition>
                    <div v-show="form.pakai_alat_medis" class="q-mt-sm">
                      <q-input
                        v-model="form.riwayatalat_medis"
                        outlined
                        dense
                        placeholder="Sebutkan jenis peralatan medis khusus yang digunakan..."
                        class="text-caption"
                      />
                    </div>
                  </q-slide-transition>
                </q-item-section>
              </q-item>

              <!-- 8. Riwayat Psikologis -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">8.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Riwayat Psikologis</q-item-label>
                  <div class="q-mt-sm row q-col-gutter-sm">
                    <div v-for="opsi in opsiPsikologis" :key="opsi.value" class="col-xs-12 col-sm-6">
                      <q-checkbox v-model="form.riwayat_psikologis" :val="opsi.value" :label="opsi.label" color="indigo-10" dense />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 9. Readmisi -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">9.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Readmisi &lt; dari 30 Hari dengan Diagnosa yang Sama</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.readmisi" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 10. Biaya Tinggi -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">10.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Perkiraan Asuhan dengan Biaya Tinggi</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.biaya_tinggi" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 11. Pembiayaan Kompleks -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">11.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kemungkinan Sistem Pembiayaan yang Komplek</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.pembiayaan_komplek" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 12. LOS -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">12.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kasus yang Melebihi Lama Rata-rata Dirawat</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.melebihi_los" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 13. Rujukan / Transfer -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">13.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Transfer Pasien antar RS / Rujukan</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.transfer_rujukan" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 14. Lintas Sektor -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">14.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Dibutuhkan Kerjasama Lintas Sektor</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.kerjasama_sektor" color="indigo-10" />
                </q-item-section>
              </q-item>

              <!-- 15. Kontinuitas Pelayanan -->
              <q-item class="q-py-md">
                <div class="text-subtitle2 text-weight-bold text-indigo-10 self-start q-mr-md" style="width: 24px; flex-shrink: 0; padding-top: 2px;">15.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kasus yang Diidentifikasi Rencana Membutuhkan Kontinuitas Pelayanan</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="form.kontinuitas_pelayanan" color="indigo-10" />
                </q-item-section>
              </q-item>

            </q-list>
          </div>

          <!-- Action Buttons & Skor Real-time -->
          <div class="row items-center justify-between q-mt-md col-auto q-gutter-y-sm">
            <div class="row items-center q-gutter-x-sm">
              <span class="text-caption text-grey-8 text-bold">Skor Skrining Aktif:</span>
              <q-badge
                v-if="activeScore >= 3"
                color="positive"
                text-color="white"
                class="q-py-xs q-px-sm text-bold"
              >
                PASIEN MPP (Skor: {{ activeScore }})
              </q-badge>
              <q-badge
                v-else
                color="grey-6"
                text-color="white"
                class="q-py-xs q-px-sm text-bold"
              >
                Bukan MPP (Skor: {{ activeScore }})
              </q-badge>
            </div>

            <div class="row">
              <q-btn
                v-if="store.editingId"
                label="Batal Edit"
                color="grey-7"
                no-caps
                outline
                class="q-px-md q-mr-sm"
                @click="store.initReset(props.pasien)"
              />
              <q-btn
                :label="store.editingId ? 'Update Skrining MPP' : 'Simpan Skrining MPP'"
                type="button"
                @click="onSubmit"
                color="indigo-10"
                no-caps
                class="q-px-lg"
                :loading="store.loading"
                icon="icon-mat-save"
              />
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Riwayat Skrining (Tampilan Kartu Sebelahan & Scroll Mandiri) -->
        <div class="col-xs-12 col-md-5 mpp-col-right column no-wrap">
          <div class="bg-indigo-1 text-indigo-10 q-pa-md row items-center justify-between border-top-radius border-card no-border-bottom col-auto">
            <div class="row items-center">
              <q-icon name="icon-mat-history" size="xs" class="q-mr-sm" />
              <div class="text-subtitle2 text-bold">RIWAYAT SKRINING MPP PASIEN</div>
            </div>
            <q-badge color="indigo-10" :label="store.items.length + ' Data'" />
          </div>

          <div class="col scroll q-pa-sm bg-white border-bottom-radius border-card">
            <div v-if="store.loading && !store.items.length" class="q-pa-md text-center text-grey-6">
              <q-spinner-dots size="sm" color="indigo-10" />
              <div class="text-caption q-mt-xs">Memuat riwayat...</div>
            </div>
            <div v-else-if="!store.items.length" class="q-pa-md text-center text-grey-6 text-caption">
              Belum ada riwayat skrining MPP untuk pasien ini.
            </div>
            <div v-else>
              <transition-group name="list">
                <q-card
                  v-for="(item, i) in store.items"
                  :key="item.id || i"
                  class="q-mb-sm cursor-pointer relative-position border-history-card"
                  @mouseover="hoverredId = item.id"
                  @mouseleave="hoverredId = null"
                >
                  <div class="full-width">
                    <q-card-section class="q-py-sm q-px-md">
                      <!-- Baris 1: Index & Tanggal Pembuatan -->
                      <div class="row items-center justify-between q-mb-xs">
                        <div class="text-caption text-grey-6 text-bold">
                          Skrining #{{ store.items.length - i }}
                        </div>
                        <div class="text-caption text-grey-6">
                          {{ humanDate(item.created_at) }}, {{ jamTnpDetik(item.created_at) }}
                        </div>
                      </div>
                      
                      <!-- Baris 2: Status Badge & Petugas -->
                      <div class="row items-center justify-between q-mt-sm">
                        <div>
                          <q-badge
                            v-if="calculateMppScore(item.skrining) >= 3"
                            color="positive"
                            text-color="white"
                            class="q-py-xs q-px-sm text-bold text-caption"
                          >
                            PASIEN MPP (Skor: {{ calculateMppScore(item.skrining) }})
                          </q-badge>
                          <q-badge
                            v-else
                            color="grey-6"
                            text-color="white"
                            class="q-py-xs q-px-sm text-caption"
                          >
                            Bukan MPP (Skor: {{ calculateMppScore(item.skrining) }})
                          </q-badge>
                        </div>
                        
                        <div class="text-caption text-grey-8">
                          Oleh: <span class="text-bold">{{ item.kdpegsimrs || 'Petugas' }}</span>
                        </div>
                      </div>

                      <!-- Baris 3: Ringkasan Kriteria Terpenuhi -->
                      <div class="q-mt-sm border-t q-pt-sm">
                        <div class="text-xs text-indigo-10 text-weight-bold q-mb-xs">Kriteria Terpenuhi:</div>
                        <div class="text-xs text-grey-7 text-wrap leading-relaxed">
                          {{ formatKriteriaSummary(item.skrining) }}
                        </div>
                      </div>
                    </q-card-section>
                    
                    <!-- Overlay Tombol Aksi saat Hover (Tiru Konsul) -->
                    <div
                      v-if="hoverredId === item.id"
                      class="absolute-top-right bg-white full-height column flex-center q-px-md action-overlay"
                      style="border-left: 1px solid #ddd; right: 0; top: 0; bottom: 0; z-index: 10;"
                    >
                      <div class="flex q-gutter-x-sm">
                        <q-btn
                          flat
                          round
                          size="md"
                          icon="icon-mat-edit"
                          color="primary"
                          @click="store.editData(item)"
                        >
                          <q-tooltip>Edit Skrining</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          size="md"
                          icon="icon-mat-delete"
                          color="negative"
                          :loading="store.loadingHapus"
                          @click="onDelete(item.id)"
                        >
                          <q-tooltip>Hapus Skrining</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </q-card>
              </transition-group>
              <div style="margin-bottom: 50px;" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useMppRanapStore } from 'src/stores/simrs/ranap/mpp'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'

const $q = useQuasar()
const store = useMppRanapStore()
const form = store.form

const hoverredId = ref(null)

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

// Sinkronisasi data pasien secara reaktif & pemuatan riwayat data
watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    store.initReset(newPasien)
    store.getData(newPasien)
  }
}, { immediate: true })

// Opsi checklist psikologis untuk butir nomor 8
const opsiPsikologis = [
  { label: 'Riwayat gangguan mental', value: 'gangguan_mental' },
  { label: 'Upaya bunuh diri', value: 'bunuh_diri' },
  { label: 'Krisis keluarga', value: 'krisis_keluarga' },
  { label: 'Isu sosial', value: 'isu_sosial' },
  { label: 'Pasien terlantar', value: 'pasien_terlantar' },
  { label: 'Pasien tinggal sendiri', value: 'tinggal_sendiri' },
  { label: 'Penggunaan narkoba & miras', value: 'narkoba_miras' },
  { label: 'Status Narapidana', value: 'narapidana' }
]

// Penghitung Skor Skrining MPP Aktif (Real-time di Frontend)
const activeScore = computed(() => {
  let count = 0
  if (form.usia) count++
  if (form.kognitif_rendah) count++
  if (form.resiko_tinggi) count++
  if (form.potensi_komplain) count++
  if (form.kasus_penyakit) count++
  if (form.keterbatasan_adl) count++
  if (form.pakai_alat_medis) count++
  if (Array.isArray(form.riwayat_psikologis) && form.riwayat_psikologis.length > 0) count++
  if (form.readmisi) count++
  if (form.biaya_tinggi) count++
  if (form.pembiayaan_komplek) count++
  if (form.melebihi_los) count++
  if (form.transfer_rujukan) count++
  if (form.kerjasama_sektor) count++
  if (form.kontinuitas_pelayanan) count++
  return count
})

// Fungsi Penghitung Skor Skrining MPP untuk data di Tabel Riwayat
const calculateMppScore = (skriningData) => {
  const data = typeof skriningData === 'string' ? JSON.parse(skriningData) : skriningData
  if (!data) return 0
  
  let count = 0
  if (data.usia) count++
  if (data.kognitif_rendah) count++
  if (data.resiko_tinggi) count++
  if (data.potensi_komplain) count++
  if (data.kasus_penyakit) count++
  if (data.keterbatasan_adl) count++
  if (data.pakai_alat_medis) count++
  if (Array.isArray(data.riwayat_psikologis) && data.riwayat_psikologis.length > 0) count++
  if (data.readmisi) count++
  if (data.biaya_tinggi) count++
  if (data.pembiayaan_komplek) count++
  if (data.melebihi_los) count++
  if (data.transfer_rujukan) count++
  if (data.kerjasama_sektor) count++
  if (data.kontinuitas_pelayanan) count++
  return count
}

// Penerjemah JSON skrining ke Ringkasan Teks
const formatKriteriaSummary = (skriningData) => {
  const data = typeof skriningData === 'string' ? JSON.parse(skriningData) : skriningData
  if (!data) return '-'
  
  const activeKriteria = []
  if (data.usia) activeKriteria.push(`Usia: ${data.usia}`)
  if (data.kasus_penyakit) activeKriteria.push(`Kasus: ${data.kasus_penyakit}`)
  
  const flags = [
    { key: 'kognitif_rendah', label: 'Kognitif Rendah' },
    { key: 'resiko_tinggi', label: 'Risiko Tinggi' },
    { key: 'potensi_komplain', label: 'Potensi Komplain' },
    { key: 'keterbatasan_adl', label: 'Keterbatasan ADL' },
    { key: 'pakai_alat_medis', label: 'Alat Medis' },
    { key: 'readmisi', label: 'Readmisi <30 Hari' },
    { key: 'biaya_tinggi', label: 'Biaya Tinggi' },
    { key: 'pembiayaan_komplek', label: 'Pembiayaan Kompleks' },
    { key: 'melebihi_los', label: 'Melebihi LOS' },
    { key: 'transfer_rujukan', label: 'Transfer/Rujukan' },
    { key: 'kerjasama_sektor', label: 'Lintas Sektor' },
    { key: 'kontinuitas_pelayanan', label: 'Kontinuitas Pelayanan' }
  ]
  
  flags.forEach(f => {
    if (data[f.key]) activeKriteria.push(f.label)
  })
  
  return activeKriteria.join(', ') || 'Tidak ada kriteria'
}

const onSubmit = () => {
  store.simpanData(props.pasien)
}

const onDelete = (id) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Apakah Anda yakin ingin menghapus data skrining MPP ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(props.pasien, id)
  })
}
</script>

<style lang="scss" scoped>
.border-b {
  border-bottom: 1px solid #eeeeee;
}
.self-start {
  align-self: flex-start;
}
.py-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.text-wrap {
  white-space: normal;
  word-break: break-word;
}
.border-card {
  border: 1px solid #e0e0e0;
}
.border-top-radius {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.border-bottom-radius {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.no-border-bottom {
  border-bottom: none !important;
}

.border-history-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: none;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--q-primary);
    background-color: #fbfbfe;
  }
}

.action-overlay {
  animation: slideIn 0.15s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scroll Mandiri di Desktop (min-width 1024px) */
@media (min-width: 1024px) {
  .mpp-grid-container {
    overflow: hidden; /* Matikan scroll utama halaman */
    height: calc(100vh - 80px); /* Batasi tinggi sesuai viewport */
  }
  .mpp-grid {
    height: 100%;
  }
  .mpp-col-left {
    height: 100%;
  }
  .mpp-col-right {
    height: 100%;
  }
}

/* Tumpuk Vertikal dan Scroll Normal di Mobile (max-width 1023px) */
@media (max-width: 1023px) {
  .mpp-grid-container {
    overflow-y: auto; /* Aktifkan scroll utama */
    height: auto;
  }
  .mpp-grid {
    height: auto;
  }
  .mpp-col-left {
    height: auto;
  }
  .mpp-col-right {
    height: auto;
    margin-top: 16px;
  }
}
</style>
