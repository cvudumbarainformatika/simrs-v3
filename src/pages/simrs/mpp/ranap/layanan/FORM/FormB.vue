<template>
  <div class="fit column no-wrap bg-grey-2">

    <!-- Header -->
    <div class="row items-center justify-between q-pa-md bg-white border-b shadow-sm col-auto">
      <div class="text-subtitle1 text-bold text-teal-10 flex items-center">
        <q-icon name="icon-mat-edit_note" class="q-mr-sm" size="sm" />
        FORM B — IMPLEMENTASI & MONITORING MANAJEMEN PELAYANAN PASIEN (MPP)
      </div>
    </div>

    <!-- Konten -->
    <div class="col q-pa-md mpp-grid-container">
      <div class="row q-col-gutter-md mpp-grid">

        <!-- Kiri: Form Input -->
        <div class="col-xs-12 col-md-7 mpp-col-left column no-wrap">
          <div class="col scroll bg-white border-card">
            <q-list separator>

              <!-- 1. Tanggal & Waktu -->
              <q-item class="q-py-md">
                <div class="item-no">1.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Tanggal & Waktu Kunjungan / Intervensi</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-xs-12 col-sm-auto">
                      <q-input
                        v-model="form.tgl"
                        outlined dense type="date"
                        label="Tanggal"
                        style="min-width: 170px"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-auto">
                      <q-input
                        v-model="form.jam"
                        outlined dense type="time"
                        label="Jam"
                        style="min-width: 130px"
                      />
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <!-- 2. Subjektif -->
              <q-item class="q-py-md">
                <div class="item-no">2.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">
                    Subjektif (S)
                    <q-chip dense size="xs" color="teal-1" text-color="teal-10" class="q-ml-xs">Keluhan & Pernyataan Pasien</q-chip>
                  </q-item-label>
                  <q-input
                    v-model="form.subjektif"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Tuliskan keluhan atau pernyataan pasien/keluarga..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 3. Objektif -->
              <q-item class="q-py-md">
                <div class="item-no">3.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">
                    Objektif (O)
                    <q-chip dense size="xs" color="teal-1" text-color="teal-10" class="q-ml-xs">Temuan & Observasi MPP</q-chip>
                  </q-item-label>
                  <q-input
                    v-model="form.objektif"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Tuliskan temuan, observasi, atau hasil koordinasi dengan PPA lain..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 4. Asesmen MPP -->
              <q-item class="q-py-md">
                <div class="item-no">4.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">
                    Asesmen (A)
                    <q-chip dense size="xs" color="teal-1" text-color="teal-10" class="q-ml-xs">Penilaian MPP</q-chip>
                  </q-item-label>
                  <q-input
                    v-model="form.asesmen"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Penilaian MPP terhadap perkembangan kondisi pasien dan kendala yang ada..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 5. Intervensi / Plan -->
              <q-item class="q-py-md">
                <div class="item-no">5.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">
                    Plan / Intervensi (P)
                    <q-chip dense size="xs" color="teal-1" text-color="teal-10" class="q-ml-xs">Rencana Tindakan MPP</q-chip>
                  </q-item-label>
                  <q-input
                    v-model="form.plan"
                    outlined dense type="textarea"
                    rows="3"
                    placeholder="Tuliskan rencana intervensi, tindak lanjut, dan koordinasi yang akan dilakukan..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 6. Koordinasi dengan PPA -->
              <q-item class="q-py-md">
                <div class="item-no">6.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Koordinasi dengan PPA / Pihak Lain</q-item-label>
                  <q-item-label caption class="q-mb-sm">Pilih pihak yang dilibatkan dalam koordinasi</q-item-label>
                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="opsi in opsiPPA"
                      :key="opsi.value"
                      class="col-xs-12 col-sm-6"
                    >
                      <q-checkbox
                        v-model="form.koordinasi_ppa"
                        :val="opsi.value"
                        :label="opsi.label"
                        color="teal-10"
                        dense
                      />
                    </div>
                  </div>
                  <q-input
                    v-if="form.koordinasi_ppa?.length"
                    v-model="form.koordinasi_ppa_ket"
                    outlined dense
                    placeholder="Keterangan koordinasi..."
                    class="q-mt-sm"
                  />
                </q-item-section>
              </q-item>

              <!-- 7. Hambatan / Kendala -->
              <q-item class="q-py-md">
                <div class="item-no">7.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Hambatan / Kendala yang Ditemui</q-item-label>
                  <div class="q-mt-sm">
                    <q-checkbox
                      v-model="form.ada_hambatan"
                      label="Terdapat hambatan/kendala"
                      color="teal-10"
                      dense
                    />
                  </div>
                  <q-slide-transition>
                    <q-input
                      v-if="form.ada_hambatan"
                      v-model="form.hambatan_ket"
                      outlined dense type="textarea"
                      rows="2"
                      placeholder="Jelaskan hambatan yang ditemui..."
                      class="q-mt-sm"
                    />
                  </q-slide-transition>
                </q-item-section>
              </q-item>

              <!-- 8. Status Discharge Planning -->
              <q-item class="q-py-md">
                <div class="item-no">8.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Status Discharge Planning saat ini</q-item-label>
                  <div class="q-mt-sm row q-gutter-x-md">
                    <q-radio v-model="form.status_discharge" val="Dalam proses" label="Dalam Proses" dense color="teal-10" />
                    <q-radio v-model="form.status_discharge" val="Siap pulang" label="Siap Pulang" dense color="teal-10" />
                    <q-radio v-model="form.status_discharge" val="Dirujuk" label="Dirujuk" dense color="teal-10" />
                    <q-radio v-model="form.status_discharge" val="Meninggal" label="Meninggal" dense color="teal-10" />
                  </div>
                </q-item-section>
              </q-item>

              <!-- 9. Tindak Lanjut Berikutnya -->
              <q-item class="q-py-md">
                <div class="item-no">9.</div>
                <q-item-section>
                  <q-item-label class="text-subtitle2 text-weight-bold">Rencana Tindak Lanjut MPP Berikutnya</q-item-label>
                  <div class="row q-col-gutter-sm q-mt-sm">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        v-model="form.tgl_tindak_lanjut"
                        outlined dense type="date"
                        label="Tanggal Rencana"
                      />
                    </div>
                  </div>
                  <q-input
                    v-model="form.rencana_tindak_lanjut"
                    outlined dense type="textarea"
                    rows="2"
                    placeholder="Rencana kegiatan MPP berikutnya..."
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
              :label="editingId ? 'Update Form B' : 'Simpan Form B'"
              icon="icon-mat-save"
              color="teal-10"
              no-caps
              class="q-px-lg"
              :loading="loading"
              @click="onSubmit"
            />
          </div>
        </div>

        <!-- Kanan: Riwayat -->
        <div class="col-xs-12 col-md-5 mpp-col-right column no-wrap">
          <div class="bg-teal-1 text-teal-10 q-pa-md row items-center justify-between border-top-radius border-card no-border-bottom col-auto">
            <div class="row items-center">
              <q-icon name="icon-mat-history" size="xs" class="q-mr-sm" />
              <div class="text-subtitle2 text-bold">RIWAYAT IMPLEMENTASI MPP (FORM B)</div>
            </div>
            <q-badge color="teal-10" :label="items.length + ' Data'" />
          </div>

          <div class="col scroll q-pa-sm bg-white border-bottom-radius border-card">
            <div v-if="!items.length" class="q-pa-md text-center text-grey-6 text-caption">
              Belum ada data implementasi Form B.
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
                    <!-- Header -->
                    <div class="row items-center justify-between q-mb-xs">
                      <div class="text-caption text-grey-6 text-bold">
                        Kunjungan #{{ items.length - i }}
                      </div>
                      <div class="text-caption text-grey-6">
                        {{ humanDate(item.tgl) }} {{ item.jam }}
                      </div>
                    </div>

                    <!-- Status discharge -->
                    <div class="row items-center justify-between q-mt-xs">
                      <q-badge
                        :color="statusColor(item.data?.status_discharge)"
                        class="text-caption"
                      >
                        {{ item.data?.status_discharge || '—' }}
                      </q-badge>
                      <div class="text-caption text-grey-7">
                        Oleh: <span class="text-bold">{{ item.kdpegsimrs || 'Petugas' }}</span>
                      </div>
                    </div>

                    <!-- Ringkasan Plan -->
                    <div class="q-mt-sm border-t q-pt-sm">
                      <div class="text-xs text-indigo-10 text-weight-bold q-mb-xs">Plan:</div>
                      <div class="text-xs text-grey-7 text-wrap multiline-ellipsis">
                        {{ item.data?.plan || '—' }}
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
                      <q-btn flat round size="md" icon="icon-mat-edit" color="teal-10" @click="onEdit(item)">
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
import { humanDate } from 'src/modules/formatter'

const $q = useQuasar()

const props = defineProps({
  pasien: { type: Object, default: null }
})

const loading = ref(false)
const editingId = ref(null)
const hoveredId = ref(null)
const items = ref([])

const formDefault = () => ({
  tgl: new Date().toISOString().slice(0, 10),
  jam: new Date().toTimeString().slice(0, 5),
  subjektif: null,
  objektif: null,
  asesmen: null,
  plan: null,
  koordinasi_ppa: [],
  koordinasi_ppa_ket: null,
  ada_hambatan: false,
  hambatan_ket: null,
  status_discharge: null,
  tgl_tindak_lanjut: null,
  rencana_tindak_lanjut: null
})

const form = reactive(formDefault())

const opsiPPA = [
  { label: 'Dokter Penanggung Jawab (DPJP)', value: 'dpjp' },
  { label: 'Dokter Spesialis / Konsultan', value: 'spesialis' },
  { label: 'Perawat / Bidan', value: 'perawat' },
  { label: 'Apoteker', value: 'apoteker' },
  { label: 'Ahli Gizi', value: 'gizi' },
  { label: 'Fisioterapis', value: 'fisioterapi' },
  { label: 'Pekerja Sosial', value: 'pekerja_sosial' },
  { label: 'Keluarga Pasien', value: 'keluarga' },
  { label: 'Asuransi / BPJS', value: 'asuransi' },
  { label: 'Pihak Eksternal / RS Lain', value: 'eksternal' }
]

const statusColor = (status) => {
  if (!status) return 'grey-5'
  if (status === 'Siap pulang') return 'positive'
  if (status === 'Dalam proses') return 'teal-8'
  if (status === 'Dirujuk') return 'warning'
  if (status === 'Meninggal') return 'negative'
  return 'grey-6'
}

const resetForm = () => {
  editingId.value = null
  Object.assign(form, formDefault())
}

const onEdit = (item) => {
  editingId.value = item.id
  Object.assign(form, { ...formDefault(), ...item.data, tgl: item.tgl, jam: item.jam })
}

const onDelete = (id) => {
  $q.dialog({
    title: 'Konfirmasi Hapus',
    message: 'Yakin ingin menghapus data implementasi Form B ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    items.value = items.value.filter(x => x.id !== id)
    $q.notify({ type: 'positive', message: 'Data berhasil dihapus' })
  })
}

const onSubmit = () => {
  // TODO: connect ke store/API
  $q.notify({ type: 'info', message: 'Form B siap dikoneksikan ke backend' })
}
</script>

<style lang="scss" scoped>
.item-no {
  width: 24px;
  flex-shrink: 0;
  padding-top: 2px;
  font-size: 14px;
  font-weight: 700;
  color: #004d40;
  align-self: flex-start;
  margin-right: 12px;
}
.border-b { border-bottom: 1px solid #eee; }
.border-card { border: 1px solid #e0e0e0; }
.border-top-radius { border-radius: 8px 8px 0 0; }
.border-bottom-radius { border-radius: 0 0 8px 8px; }
.no-border-bottom { border-bottom: none !important; }
.text-wrap { white-space: normal; word-break: break-word; }
.multiline-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.border-history-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: none;
  transition: all 0.2s ease;
  &:hover { border-color: #009688; background-color: #f0faf9; }
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
