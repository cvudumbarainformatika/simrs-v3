<template>
  <div class="fit column no-wrap bg-grey-2">

    <!-- Header -->
    <div class="row items-center justify-between q-pa-md bg-white border-b shadow-sm col-auto">
      <div class="text-subtitle1 text-bold text-indigo-10 flex items-center">
        <q-icon name="icon-mat-assignment" class="q-mr-sm" size="sm" />
        FORM A — PENGKAJIAN MANAJEMEN PELAYANAN PASIEN (MPP)
      </div>
    </div>

    <!-- Konten -->
    <div class="col q-pa-md mpp-grid-container">
      <div class="row q-col-gutter-md mpp-grid">

        <!-- Kiri: Form Input -->
        <div class="col-xs-12 col-md-7 mpp-col-left column no-wrap">
          <div class="col scroll bg-white border-card">
            <q-list separator>

              <!-- 1. Tanggal Pengkajian -->
              <q-item class="q-py-md">
                <div class="item-no">1.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Tanggal Pengkajian</q-item-label>
                  <div class="q-mt-sm">
                    <q-input
                      v-model="form.tgl_kajian"
                      outlined dense
                      type="date"
                      style="max-width: 220px"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 2. Diagnosis Medis -->
              <q-item class="q-py-md">
                <div class="item-no">2.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Diagnosis Medis / Masalah Kesehatan Utama</q-item-label>
                  <q-input
                    v-model="form.diagnosis"
                    outlined dense type="textarea"
                    rows="2"
                    placeholder="Tulis diagnosis medis utama..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 3. Status Asuransi / Pembiayaan -->
              <q-item class="q-py-md">
                <div class="item-no">3.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Status Pembiayaan</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-md">
                    <q-radio v-model="form.pembiayaan" val="Umum" label="Umum" dense color="indigo-10" />
                    <q-radio v-model="form.pembiayaan" val="BPJS" label="BPJS" dense color="indigo-10" />
                    <q-radio v-model="form.pembiayaan" val="Asuransi Swasta" label="Asuransi Swasta" dense color="indigo-10" />
                    <q-radio v-model="form.pembiayaan" val="Lainnya" label="Lainnya" dense color="indigo-10" />
                  </div>
                  <q-slide-transition>
                    <q-input
                      v-if="form.pembiayaan === 'Lainnya'"
                      v-model="form.pembiayaan_ket"
                      outlined dense
                      placeholder="Sebutkan..."
                      class="q-mt-sm"
                      style="max-width: 300px"
                    />
                  </q-slide-transition>
                </q-item-section>
              </q-item>

              <!-- 4. Kondisi Psikososial -->
              <q-item class="q-py-md">
                <div class="item-no">4.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kondisi Psikososial & Spiritual</q-item-label>
                  <q-item-label caption class="q-mb-sm">Pilih yang sesuai kondisi pasien</q-item-label>
                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="opsi in opsiPsikososial"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.psikososial"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="indigo-10"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 5. Hambatan Komunikasi -->
              <q-item class="q-py-md">
                <div class="item-no">5.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Hambatan Komunikasi / Bahasa</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-md">
                    <q-radio v-model="form.hambatan_komunikasi" val="Tidak Ada" label="Tidak Ada" dense color="indigo-10" />
                    <q-radio v-model="form.hambatan_komunikasi" val="Bahasa" label="Hambatan Bahasa" dense color="indigo-10" />
                    <q-radio v-model="form.hambatan_komunikasi" val="Pendengaran" label="Gangguan Pendengaran" dense color="indigo-10" />
                    <q-radio v-model="form.hambatan_komunikasi" val="Bicara" label="Gangguan Bicara" dense color="indigo-10" />
                  </div>
                  <q-slide-transition>
                    <q-input
                      v-if="form.hambatan_komunikasi && form.hambatan_komunikasi !== 'Tidak Ada'"
                      v-model="form.hambatan_komunikasi_ket"
                      outlined dense
                      placeholder="Keterangan tambahan..."
                      class="q-mt-sm"
                    />
                  </q-slide-transition>
                </q-item-section>
              </q-item>

              <!-- 6. Kebutuhan Edukasi -->
              <q-item class="q-py-md">
                <div class="item-no">6.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kebutuhan Edukasi Pasien & Keluarga</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-xs">
                    <div
                      v-for="opsi in opsiEdukasi"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.kebutuhan_edukasi"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="indigo-10"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 7. Status Fungsional -->
              <q-item class="q-py-md">
                <div class="item-no">7.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Status Fungsional (ADL)</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-md">
                    <q-radio v-model="form.status_fungsional" val="Mandiri" label="Mandiri" dense color="indigo-10" />
                    <q-radio v-model="form.status_fungsional" val="Ketergantungan Sebagian" label="Ketergantungan Sebagian" dense color="indigo-10" />
                    <q-radio v-model="form.status_fungsional" val="Ketergantungan Total" label="Ketergantungan Total" dense color="indigo-10" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 8. Masalah Sosial Ekonomi -->
              <q-item class="q-py-md">
                <div class="item-no">8.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Masalah Sosial Ekonomi</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-xs">
                    <div
                      v-for="opsi in opsiSosialEkonomi"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.masalah_sosial_ekonomi"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="indigo-10"
                        dense
                      />
                    </div>
                  </div>
                  <q-input
                    v-if="form.masalah_sosial_ekonomi?.length"
                    v-model="form.sosial_ekonomi_ket"
                    outlined dense type="textarea"
                    rows="2"
                    placeholder="Keterangan masalah sosial ekonomi..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 9. Rencana Discharge -->
              <q-item class="q-py-md">
                <div class="item-no">9.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Rencana Discharge (Perencanaan Kepulangan Awal)</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-xs">
                    <div
                      v-for="opsi in opsiDischarge"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.rencana_discharge"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="indigo-10"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 10. Tujuan MPP -->
              <q-item class="q-py-md">
                <div class="item-no">10.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Tujuan / Target Manajemen Pelayanan Pasien</q-item-label>
                  <q-input
                    v-model="form.tujuan_mpp"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Tuliskan tujuan dan target MPP untuk pasien ini..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 11. Kebutuhan Khusus -->
              <q-item class="q-py-md">
                <div class="item-no">11.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Kebutuhan Pelayanan Khusus</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-xs">
                    <div
                      v-for="opsi in opsiKebutuhanKhusus"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.kebutuhan_khusus"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="indigo-10"
                        dense
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 12. Catatan -->
              <q-item class="q-py-md">
                <div class="item-no">12.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Catatan Tambahan MPP</q-item-label>
                  <q-input
                    v-model="form.catatan"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Catatan penting lainnya dari MPP..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

            </q-list>
          </div>

          <!-- Action -->
          <div class="row items-center justify-end q-mt-md col-auto">
            <q-btn
              v-if="editingId"
              label="Batal Edit"
              color="grey-7"
              no-caps outline
              class="q-px-md q-mr-sm"
              @click="resetForm"
            />
            <q-btn
              :label="editingId ? 'Update Form A' : 'Simpan Form A'"
              icon="icon-mat-save"
              color="indigo-10"
              no-caps
              class="q-px-lg"
              :loading="loading"
              @click="onSubmit"
            />
          </div>
        </div>

        <!-- Kanan: Riwayat -->
        <div class="col-xs-12 col-md-5 mpp-col-right column no-wrap">
          <div class="bg-indigo-1 text-indigo-10 q-pa-md row items-center justify-between border-top-radius border-card no-border-bottom col-auto">
            <div class="row items-center">
              <q-icon name="icon-mat-history" size="xs" class="q-mr-sm" />
              <div class="text-subtitle2 text-bold">RIWAYAT PENGKAJIAN MPP (FORM A)</div>
            </div>
            <q-badge color="indigo-10" :label="items.length + ' Data'" />
          </div>

          <div class="col scroll q-pa-sm bg-white border-bottom-radius border-card">
            <div v-if="!items.length" class="q-pa-md text-center text-grey-6 text-caption">
              Belum ada data pengkajian Form A.
            </div>
            <div v-else>
              <transition-group name="list">
                <q-card
                  v-for="(item, i) in items"
                  :key="item.id || i"
                  class="q-mb-sm cursor-pointer relative-position border-history-card"
                  @mouseover="hoveredId = item.id"
                  @mouseleave="hoveredId = null"
                >
                  <q-card-section class="q-py-sm q-px-md">
                    <!-- Header card -->
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-caption text-grey-6 text-bold">
                        Pengkajian #{{ items.length - i }}
                      </div>
                      <div class="text-caption text-grey-6">
                        {{ humanDate(item.created_at) }}, {{ jamTnpDetik(item.created_at) }}
                      </div>
                    </div>

                    <!-- Diagnosis -->
                    <div class="text-caption text-weight-bold text-grey-9 ellipsis q-mb-xs">
                      {{ item.data?.diagnosis || '—' }}
                    </div>

                    <!-- Status & Petugas -->
                    <div class="row items-center justify-between q-mt-xs">
                      <q-badge color="indigo-2" text-color="indigo-10" class="text-caption">
                        {{ item.data?.status_fungsional || '—' }}
                      </q-badge>
                      <div class="text-caption text-grey-7">
                        Oleh: <span class="text-bold">{{ item.kdpegsimrs || 'Petugas' }}</span>
                      </div>
                    </div>

                    <!-- Ringkasan psikososial -->
                    <div class="q-mt-sm border-t q-pt-sm">
                      <div class="text-xs text-grey-7 text-wrap">
                        <span class="text-indigo-10 text-weight-bold">Pembiayaan:</span>
                        {{ item.data?.pembiayaan || '—' }}
                        &nbsp;|&nbsp;
                        <span class="text-indigo-10 text-weight-bold">Fungsional:</span>
                        {{ item.data?.status_fungsional || '—' }}
                      </div>
                    </div>
                  </q-card-section>

                  <!-- Overlay aksi -->
                  <div
                    v-if="hoveredId === item.id"
                    class="absolute-top-right bg-white full-height column flex-center q-px-md action-overlay"
                    style="border-left: 1px solid #ddd; right: 0; top: 0; bottom: 0; z-index: 10;"
                  >
                    <div class="flex q-gutter-x-sm">
                      <q-btn flat round size="md" icon="icon-mat-edit" color="primary" @click="onEdit(item)">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn flat round size="md" icon="icon-mat-delete" color="negative" @click="onDelete(item.id)">
                        <q-tooltip>Hapus</q-tooltip>
                      </q-btn>
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
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { humanDate, jamTnpDetik } from 'src/modules/formatter'

const $q = useQuasar()

const props = defineProps({
  pasien: { type: Object, default: null }
})

const loading = ref(false)
const editingId = ref(null)
const hoveredId = ref(null)
const items = ref([])

const formDefault = () => ({
  tgl_kajian: new Date().toISOString().slice(0, 10),
  diagnosis: null,
  pembiayaan: null,
  pembiayaan_ket: null,
  psikososial: [],
  hambatan_komunikasi: null,
  hambatan_komunikasi_ket: null,
  kebutuhan_edukasi: [],
  status_fungsional: null,
  masalah_sosial_ekonomi: [],
  sosial_ekonomi_ket: null,
  rencana_discharge: [],
  tujuan_mpp: null,
  kebutuhan_khusus: [],
  catatan: null
})

const form = reactive(formDefault())

const opsiPsikososial = [
  { label: 'Kecemasan / Stres tinggi', value: 'kecemasan' },
  { label: 'Depresi', value: 'depresi' },
  { label: 'Gangguan jiwa', value: 'gangguan_jiwa' },
  { label: 'Krisis keluarga', value: 'krisis_keluarga' },
  { label: 'Konflik keluarga', value: 'konflik_keluarga' },
  { label: 'Kekerasan dalam rumah tangga', value: 'kdrt' },
  { label: 'Masalah spiritual', value: 'spiritual' },
  { label: 'Tidak ada masalah', value: 'tidak_ada' }
]

const opsiEdukasi = [
  { label: 'Penyakit dan prosedur', value: 'penyakit_prosedur' },
  { label: 'Obat-obatan', value: 'obat' },
  { label: 'Nutrisi & diet', value: 'nutrisi' },
  { label: 'Aktivitas & latihan', value: 'aktivitas' },
  { label: 'Perawatan di rumah', value: 'perawatan_rumah' },
  { label: 'Pencegahan jatuh', value: 'pencegahan_jatuh' },
  { label: 'Kontrol ulang', value: 'kontrol_ulang' },
  { label: 'Lain-lain', value: 'lainnya' }
]

const opsiSosialEkonomi = [
  { label: 'Ketidakmampuan ekonomi', value: 'ekonomi' },
  { label: 'Tidak ada pendamping / keluarga', value: 'tidak_ada_pendamping' },
  { label: 'Tinggal sendiri', value: 'tinggal_sendiri' },
  { label: 'Pasien terlantar', value: 'terlantar' },
  { label: 'Tidak memiliki tempat tinggal', value: 'tidak_ada_tempat_tinggal' },
  { label: 'Masalah pekerjaan', value: 'masalah_pekerjaan' }
]

const opsiDischarge = [
  { label: 'Pulang ke rumah mandiri', value: 'rumah_mandiri' },
  { label: 'Pulang dengan pendampingan keluarga', value: 'rumah_keluarga' },
  { label: 'Dirujuk ke fasilitas lain', value: 'rujuk' },
  { label: 'Membutuhkan home care', value: 'home_care' },
  { label: 'Membutuhkan rehabilitasi', value: 'rehabilitasi' },
  { label: 'Membutuhkan paliatif / hospis', value: 'paliatif' }
]

const opsiKebutuhanKhusus = [
  { label: 'Konsultasi Gizi', value: 'gizi' },
  { label: 'Rehabilitasi Medik', value: 'rehab_medik' },
  { label: 'Konsultasi Psikiatri / Psikologi', value: 'psikiatri' },
  { label: 'Pekerja Sosial', value: 'pekerja_sosial' },
  { label: 'Rohaniawan', value: 'rohaniawan' },
  { label: 'Penerjemah Bahasa', value: 'penerjemah' },
  { label: 'Perawatan Paliatif', value: 'paliatif' },
  { label: 'Alat Bantu Khusus', value: 'alat_bantu' }
]

const resetForm = () => {
  editingId.value = null
  Object.assign(form, formDefault())
}

const onEdit = (item) => {
  editingId.value = item.id
  Object.assign(form, { ...formDefault(), ...item.data })
}

const onDelete = (id) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Yakin ingin menghapus data pengkajian Form A ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    items.value = items.value.filter(x => x.id !== id)
    $q.notify({ type: 'positive', message: 'Data berhasil dihapus' })
  })
}

const onSubmit = () => {
  // TODO: connect ke store/API
  $q.notify({ type: 'info', message: 'Form A siap dikoneksikan ke backend' })
}
</script>

<style lang="scss" scoped>
.item-no {
  width: 24px;
  flex-shrink: 0;
  padding-top: 2px;
  font-size: 14px;
  font-weight: 700;
  color: #1a237e;
  align-self: flex-start;
  margin-right: 12px;
}
.border-b { border-bottom: 1px solid #eee; }
.border-card { border: 1px solid #e0e0e0; }
.border-top-radius { border-radius: 8px 8px 0 0; }
.border-bottom-radius { border-radius: 0 0 8px 8px; }
.no-border-bottom { border-bottom: none !important; }
.text-wrap { white-space: normal; word-break: break-word; }
.border-history-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: none;
  transition: all 0.2s ease;
  &:hover { border-color: var(--q-primary); background-color: #fbfbfe; }
}
.action-overlay {
  animation: slideIn 0.15s ease-out forwards;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0); }
}
@media (min-width: 1024px) {
  .mpp-grid-container { overflow: hidden; height: calc(100vh - 130px); }
  .mpp-grid, .mpp-col-left, .mpp-col-right { height: 100%; }
}
@media (max-width: 1023px) {
  .mpp-grid-container { overflow-y: auto; height: auto; }
  .mpp-grid, .mpp-col-left, .mpp-col-right { height: auto; }
  .mpp-col-right { margin-top: 16px; }
}
</style>
