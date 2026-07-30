<template>
  <div class="fit column relative-position bg-slate-100 font-sans">
    <!-- LIST ITEM CARDS AREA -->
    <div class="col full-height scroll q-pa-md">
      <div v-if="loading" class="text-center text-slate-500 q-pa-xl">
        <q-spinner-dots color="primary" size="44px" />
        <div class="q-mt-sm text-weight-medium">Memuat data riwayat status sedasi...</div>
      </div>

      <div v-else-if="!items.length" class="text-center text-slate-500 q-pa-xl">
        <div class="q-pa-md rounded-full bg-indigo-50 inline-block q-mb-sm">
          <q-icon name="icon-my-file_sign" size="48px" class="text-indigo-6" />
        </div>
        <div class="text-bold text-subtitle1 text-slate-800">Belum Ada Riwayat Status Sedasi</div>
        <div class="text-caption text-slate-500">Silakan klik tombol <strong>+ Tambah Status Sedasi</strong> di atas untuk membuat asesmen baru.</div>
      </div>

      <div v-else class="column q-gutter-y-md full-width" style="max-width: 1080px; margin: 0 auto;">
        <div
          v-for="(item, i) in items"
          :key="item.id || i"
          class="futuristic-card bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 overflow-hidden"
          :class="[getSkorAldrete(item) >= 8 ? 'accent-green' : 'accent-amber']"
        >
          <!-- CARD HEADER BAR WITH INDIGO GRADIENT ACCENT -->
          <div class="q-pa-md border-b border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-slate-50/60 to-white">
            <div class="row justify-between items-center q-col-gutter-sm">
              
              <!-- LEFT TITLE & BADGES (PERFECTLY ALIGNED STRAIGHT AT X=0) -->
              <div class="col-12 col-md-7">
                <div class="column q-gutter-y-xs">
                  <!-- ROW 1: NAMA PROSEDUR & CHIPS -->
                  <div class="row items-center q-gutter-x-xs">
                    <span class="text-subtitle1 text-bold text-indigo-9">
                      {{ item?.prosedur || item?.nama_prosedur || 'Prosedur Sedasi' }}
                    </span>
                    <q-chip size="xs" color="indigo-7" text-color="white" class="text-bold shadow-1 q-ml-xs">
                      ASA {{ item?.asa || item?.asa_class || '1' }}
                    </q-chip>
                    <q-chip size="xs" color="purple-7" text-color="white" class="text-bold shadow-1">
                      Mallampati {{ item?.mallampati || item?.skor_mallampati || '1' }}
                    </q-chip>
                  </div>

                  <!-- ROW 2: TGL & JAM PROSEDUR (ALIGNED WITH TITLE ABOVE) -->
                  <div class="row items-center text-caption text-slate-600 q-gutter-x-md">
                    <div class="row items-center">
                      <q-icon name="icon-mat-event" size="15px" class="q-mr-xs text-indigo-5" />
                      <span>Tgl Prosedur: <strong>{{ item?.tgl_prosedur || item?.tgl }}</strong></span>
                    </div>
                    <div class="row items-center">
                      <q-icon name="icon-mat-schedule" size="15px" class="q-mr-xs text-indigo-5" />
                      <span>Jam: <strong>{{ item?.jam_mulai || item?.jam_mulai_sedasi || '-' }} - {{ item?.jam_selesai || item?.jam_selesai_sedasi || '-' }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT AVATARS & ALDRETE SCORE BADGE -->
              <div class="col-12 col-md-5 row justify-end items-center q-gutter-x-md">
                <!-- STACKED OVERLAY AVATAR GROUP WITH SOLID COLOR INITIALS & SIMPEG PHOTO -->
                <div class="avatar-group row items-center">
                  <!-- Dokter Anestesi Avatar -->
                  <div class="avatar-item" style="z-index: 3;" v-if="getDokterAnestesi(item)">
                    <q-avatar size="42px" class="avatar-border bg-teal-8 text-white shadow-2">
                      <div class="fit flex flex-center text-weight-bold font-sans text-subtitle2 text-white">
                        {{ getInitials(getDokterAnestesi(item)?.nama) }}
                      </div>
                      <img
                        v-if="getFotoUrl(getDokterAnestesi(item))"
                        :src="getFotoUrl(getDokterAnestesi(item))"
                        @error="(e) => e.target.style.display = 'none'"
                        class="absolute-full fit object-cover"
                      />
                      <q-tooltip anchor="top middle" self="bottom middle" class="bg-slate-900 text-white text-caption shadow-4">
                        <div class="text-weight-bold text-teal-3">Dokter Anestesi (Pelaku Sedasi)</div>
                        <div>{{ getDokterAnestesi(item)?.nama }}</div>
                      </q-tooltip>
                    </q-avatar>
                  </div>

                  <!-- Dokter Operator Avatar -->
                  <div class="avatar-item avatar-overlap" style="z-index: 2;" v-if="getDokterOperator(item)">
                    <q-avatar size="42px" class="avatar-border bg-indigo-8 text-white shadow-2">
                      <div class="fit flex flex-center text-weight-bold font-sans text-subtitle2 text-white">
                        {{ getInitials(getDokterOperator(item)?.nama) }}
                      </div>
                      <img
                        v-if="getFotoUrl(getDokterOperator(item))"
                        :src="getFotoUrl(getDokterOperator(item))"
                        @error="(e) => e.target.style.display = 'none'"
                        class="absolute-full fit object-cover"
                      />
                      <q-tooltip anchor="top middle" self="bottom middle" class="bg-slate-900 text-white text-caption shadow-4">
                        <div class="text-weight-bold text-indigo-3">Dokter Operator (Pelaku Prosedur)</div>
                        <div>{{ getDokterOperator(item)?.nama }}</div>
                      </q-tooltip>
                    </q-avatar>
                  </div>

                  <!-- Asisten Sedasi Avatar -->
                  <div class="avatar-item avatar-overlap" style="z-index: 1;" v-if="getAsisten(item)">
                    <q-avatar size="42px" class="avatar-border bg-purple-8 text-white shadow-2">
                      <div class="fit flex flex-center text-weight-bold font-sans text-subtitle2 text-white">
                        {{ getInitials(getAsisten(item)?.nama) }}
                      </div>
                      <img
                        v-if="getFotoUrl(getAsisten(item))"
                        :src="getFotoUrl(getAsisten(item))"
                        @error="(e) => e.target.style.display = 'none'"
                        class="absolute-full fit object-cover"
                      />
                      <q-tooltip anchor="top middle" self="bottom middle" class="bg-slate-900 text-white text-caption shadow-4">
                        <div class="text-weight-bold text-purple-3">Asisten Sedasi (Perawat / Petugas)</div>
                        <div>{{ getAsisten(item)?.nama }}</div>
                      </q-tooltip>
                    </q-avatar>
                  </div>
                </div>

                <!-- ALDRETE SCORE BADGE WITH GRADIENT ACCENT -->
                <q-badge
                  :color="getSkorAldrete(item) >= 8 ? 'positive' : 'warning'"
                  class="text-bold text-subtitle2 q-px-md q-py-sm rounded-full shadow-md text-white"
                >
                  Skor Aldrete: {{ getSkorAldrete(item) }} / 10
                </q-badge>
              </div>

            </div>
          </div>

          <!-- MIDDLE SECTION: TINTED ACCENT METRIC BOXES (PERFECTLY ALIGNED) -->
          <div class="q-pa-md bg-white">
            <div class="row q-col-gutter-sm">
              <!-- METRIC 1: RENCANA SEDASI -->
              <div class="col-12 col-sm-3">
                <div class="metric-box bg-blue-50/60 p-3 rounded-lg border-l-4 border-blue-500 border border-blue-100 flex items-center shadow-2xs">
                  <div class="q-pa-xs rounded-full bg-blue-100 text-blue-7 q-mr-sm">
                    <q-icon name="icon-mat-opacity" size="18px" />
                  </div>
                  <div>
                    <div class="text-caption text-blue-8 font-medium" style="font-size: 11px;">Rencana Sedasi</div>
                    <div class="text-weight-bold text-slate-900 text-subtitle2">{{ item?.rencana_sedasi || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- METRIC 2: JAM MASUK RUANG PULIH -->
              <div class="col-12 col-sm-3">
                <div class="metric-box bg-amber-50/60 p-3 rounded-lg border-l-4 border-amber-500 border border-amber-100 flex items-center shadow-2xs">
                  <div class="q-pa-xs rounded-full bg-amber-100 text-amber-8 q-mr-sm">
                    <q-icon name="icon-mat-login" size="18px" />
                  </div>
                  <div>
                    <div class="text-caption text-amber-9 font-medium" style="font-size: 11px;">Masuk Ruang Pulih</div>
                    <div class="text-weight-bold text-slate-900 text-subtitle2">{{ item?.jam_pulih || item?.jam_masuk_ruang_pulih || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- METRIC 3: JAM KELUAR RUANG PULIH -->
              <div class="col-12 col-sm-3">
                <div class="metric-box bg-teal-50/60 p-3 rounded-lg border-l-4 border-teal-500 border border-teal-100 flex items-center shadow-2xs">
                  <div class="q-pa-xs rounded-full bg-teal-100 text-teal-7 q-mr-sm">
                    <q-icon name="icon-mat-logout" size="18px" />
                  </div>
                  <div>
                    <div class="text-caption text-teal-9 font-medium" style="font-size: 11px;">Keluar Ruang Pulih</div>
                    <div class="text-weight-bold text-slate-900 text-subtitle2">{{ item?.jam_keluar || item?.jam_keluar_ruang_pulih || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- METRIC 4: KEPUTUSAN DISCHARGE -->
              <div class="col-12 col-sm-3">
                <div class="metric-box bg-purple-50/60 p-3 rounded-lg border-l-4 border-purple-500 border border-purple-100 flex items-center shadow-2xs">
                  <div class="q-pa-xs rounded-full bg-purple-100 text-purple-7 q-mr-sm">
                    <q-icon name="icon-mat-local_hospital" size="18px" />
                  </div>
                  <div>
                    <div class="text-caption text-purple-9 font-medium" style="font-size: 11px;">Keputusan Discharge</div>
                    <div class="text-weight-bold text-subtitle2" :class="[getKeputusanColor(item?.keputusan || item?.keputusan_discharge)]">
                      {{ item?.keputusan || item?.keputusan_discharge || '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BOTTOM FOOTER PANEL: SPACIOUS WITH ACCENTED BACKGROUND & PERFECT VERTICAL ALIGNMENT -->
          <div class="q-pa-md bg-slate-100/90 border-t border-slate-200 row items-center justify-between full-width">
            
            <!-- LEFT: TIM MEDIS NAMES IN ELEGANT PILL BADGES (ALIGNED STRAIGHT WITH UPPER LEFT) -->
            <div class="row items-center q-gutter-sm text-caption text-slate-700">
              <div v-if="getDokterAnestesi(item)" class="bg-white rounded-full q-px-md q-py-xs border border-teal-2 shadow-2xs row items-center">
                <q-avatar size="24px" class="q-mr-xs bg-teal-8 text-white font-sans text-weight-bold shadow-xs" style="font-size: 11px;">
                  <span>{{ getInitials(getDokterAnestesi(item)?.nama) }}</span>
                  <img
                    v-if="getFotoUrl(getDokterAnestesi(item))"
                    :src="getFotoUrl(getDokterAnestesi(item))"
                    @error="(e) => e.target.style.display = 'none'"
                    class="absolute-full fit object-cover"
                  />
                </q-avatar>
                <span class="text-slate-500">Anestesi:</span>&nbsp;<strong class="text-slate-900">{{ getDokterAnestesi(item)?.nama }}</strong>
              </div>

              <div v-if="getDokterOperator(item)" class="bg-white rounded-full q-px-md q-py-xs border border-indigo-2 shadow-2xs row items-center">
                <q-avatar size="24px" class="q-mr-xs bg-indigo-8 text-white font-sans text-weight-bold shadow-xs" style="font-size: 11px;">
                  <span>{{ getInitials(getDokterOperator(item)?.nama) }}</span>
                  <img
                    v-if="getFotoUrl(getDokterOperator(item))"
                    :src="getFotoUrl(getDokterOperator(item))"
                    @error="(e) => e.target.style.display = 'none'"
                    class="absolute-full fit object-cover"
                  />
                </q-avatar>
                <span class="text-slate-500">Operator:</span>&nbsp;<strong class="text-slate-900">{{ getDokterOperator(item)?.nama }}</strong>
              </div>

              <div v-if="getAsisten(item)" class="bg-white rounded-full q-px-md q-py-xs border border-purple-2 shadow-2xs row items-center">
                <q-avatar size="24px" class="q-mr-xs bg-purple-8 text-white font-sans text-weight-bold shadow-xs" style="font-size: 11px;">
                  <span>{{ getInitials(getAsisten(item)?.nama) }}</span>
                  <img
                    v-if="getFotoUrl(getAsisten(item))"
                    :src="getFotoUrl(getAsisten(item))"
                    @error="(e) => e.target.style.display = 'none'"
                    class="absolute-full fit object-cover"
                  />
                </q-avatar>
                <span class="text-slate-500">Asisten:</span>&nbsp;<strong class="text-slate-900">{{ getAsisten(item)?.nama }}</strong>
              </div>
            </div>

            <!-- RIGHT (POJOK KANAN BAWAH AKURAT): ACTION BUTTONS (DETAIL, EDIT, HAPUS) WITH GENEROUS BREATHING ROOM -->
            <div class="row items-center justify-end q-gutter-x-sm q-ml-auto">
              <q-btn
                label="Detail"
                icon="icon-mat-visibility"
                color="primary"
                unelevated
                no-caps
                dense
                rounded
                class="q-px-md q-py-xs text-weight-bold shadow-1"
                @click="openDetail(item)"
              />
              <q-btn
                label="Edit"
                icon="icon-mat-edit"
                color="amber-8"
                text-color="white"
                unelevated
                no-caps
                dense
                rounded
                class="q-px-md text-weight-bold shadow-1"
                @click="editItem(item)"
              >
                <q-tooltip class="bg-slate-900 text-white text-caption">Edit Data / Pemantauan</q-tooltip>
              </q-btn>
              <q-btn
                label="Hapus"
                icon="icon-mat-delete"
                color="negative"
                unelevated
                no-caps
                dense
                rounded
                class="q-px-md q-py-xs text-weight-bold shadow-1"
                @click="confirmDelete(item)"
              />
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL DIALOG -->
    <CetakPascaSedasiDialog v-model="showDetail" :item="selectedItem" :pasien="pasien" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePascaSedasiRanapStore } from 'src/stores/simrs/ranap/pascasedasi'
import { Dialog } from 'quasar'
import CetakPascaSedasiDialog from './CetakPascaSedasiDialog.vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['open-form'])

const store = usePascaSedasiRanapStore()
const loading = computed(() => store.loading)
const items = computed(() => store.items || [])

const showDetail = ref(false)
const selectedItem = ref(null)

onMounted(() => {
  store.getData(props.pasien)
})

function editItem(item) {
  store.editData(item)
  emit('open-form')
}

function getFotoUrl(person) {
  if (!person || !person.foto) return null
  const foto = String(person.foto).trim()
  if (foto === '' || foto === 'null' || foto === 'undefined') return null

  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto
  }

  const nip = person.nip || person.nik
  if (nip) {
    return `http://192.168.100.100/simpeg/foto/${nip}/${foto}`
  }

  return `http://192.168.100.100/simpeg/foto/${foto}`
}

function getInitials(name) {
  if (!name) return 'DR'
  const cleaned = name.replace(/^(dr\.|drg\.|sp\.[a-z]+|m\.kes|s\.kep|ns\.|hj\.|h\.)\s*/gi, '').trim()
  const parts = cleaned.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return 'DR'
}

function getDokterAnestesi(item) {
  const nama = item?.dokter_sedasi || item?.dokter || item?.pelaku_sedasi
  if (!nama) return null
  const found = item?.dokter_anestesi || (store.nakes || []).find(n => n.kdpegsimrs === item?.kddokter || n.nama === nama)
  return {
    nama,
    nip: found?.nip || found?.nik || null,
    foto: found?.foto || null
  }
}

function getDokterOperator(item) {
  const nama = item?.operator || item?.pelaku_prosedur
  if (!nama) return null
  const found = item?.operator_rel || (store.nakes || []).find(n => n.kdpegsimrs === item?.kd_operator || n.nama === nama)
  return {
    nama,
    nip: found?.nip || found?.nik || null,
    foto: found?.foto || null
  }
}

function getAsisten(item) {
  const nama = item?.asisten || item?.asisten_sedasi
  if (!nama) return null
  const found = item?.asisten_rel || (store.nakes || []).find(n => n.kdpegsimrs === item?.kd_asisten || n.nama === nama)
  return {
    nama,
    foto: found?.foto || null
  }
}

function getSkorAldrete(item) {
  return Number(item?.skor_discharge ?? item?.total_aldrete ?? item?.aldrete_total ?? 10)
}

function getKeputusanColor(keputusan) {
  if (keputusan === 'Dipulangkan') return 'text-emerald-600'
  if (keputusan === 'MRS') return 'text-amber-600'
  if (keputusan === 'Rawat Khusus') return 'text-rose-600'
  return 'text-slate-800'
}

function openDetail(item) {
  selectedItem.value = item
  showDetail.value = true
}

function confirmDelete(item) {
  Dialog.create({
    title: 'Hapus Data Pasca Sedasi',
    message: 'Apakah Anda yakin ingin menghapus data pasca sedasi ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.deleteData(item.id, props.pasien)
  })
}
</script>

<style lang="scss" scoped>
.futuristic-card {
  position: relative;
  border-left-width: 5px !important;
}

.accent-green {
  border-left-color: #10b981 !important;
}

.accent-amber {
  border-left-color: #f59e0b !important;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-item {
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-overlap {
  margin-left: -14px !important;
}

.avatar-item:hover {
  transform: translateY(-4px) scale(1.18);
  z-index: 30 !important;
}

.avatar-border {
  border: 3px solid #ffffff !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22) !important;
}
</style>
