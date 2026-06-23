<template>
  <div class="column full-height bg-grey-1 text-grey-9">
    <!-- Close Button Floating on Left -->
    <div @click="emits('close')" class="close-btn bg-dark text-white cursor-pointer q-pa-xs shadow-2">
      <div class="vertical-xxx">
        TUTUP
      </div>
    </div>

    <!-- Header Section -->
    <div class="col-auto bg-primary text-white shadow-2 q-py-sm q-px-md">
      <div class="row items-center justify-between no-wrap">
        <div class="row items-center q-gutter-sm">
          <q-avatar icon="icon-mat-history_toggle_off" color="teal-6" text-color="white" size="40px" />
          <div>
            <div class="text-subtitle1 text-weight-bold leading-tight">Log Activity (Audit Trail)</div>
            <div class="text-caption text-teal-2 opacity-90">
              Menampilkan log perubahan data dan riwayat interaksi pasien
            </div>
          </div>
        </div>
        <q-btn flat round dense icon="icon-mat-close" size="md" @click="emits('close')" />
      </div>
    </div>

    <!-- Pasien Profile Info Sub-header -->
    <div class="col-auto bg-white border-bottom q-px-md q-py-sm shadow-1">
      <div class="row items-center justify-between q-col-gutter-sm">
        <div class="row items-center q-gutter-md">
          <div>
            <div class="text-caption text-grey-6">Pasien</div>
            <div class="text-subtitle2 text-weight-bold text-primary">{{ pasien?.nama || '-' }}</div>
          </div>
          <q-separator vertical class="gt-xs" />
          <div>
            <div class="text-caption text-grey-6">No. Registrasi</div>
            <div class="text-subtitle2 text-weight-medium text-teal-7">{{ pasien?.noreg || '-' }}</div>
          </div>
          <q-separator vertical class="gt-xs" />
          <div>
            <div class="text-caption text-grey-6">No. RM</div>
            <div class="text-subtitle2 text-weight-medium text-amber-9">{{ pasien?.norm || '-' }}</div>
          </div>
        </div>
        <div class="row items-center no-wrap q-gutter-x-sm">
          <div style="min-width: 250px;">
            <q-input v-model="searchQuery" dense outlined placeholder="Cari aksi atau layanan..." bg-color="grey-2"
              class="q-my-xs" clearable>
              <template v-slot:append>
                <q-icon name="icon-mat-search" size="sm" />
              </template>
            </q-input>
          </div>
          <q-btn flat round dense color="primary" icon="icon-mat-refresh" @click="refreshData" :loading="store.loading">
            <q-tooltip class="bg-dark text-white">
              Refresh Log Terbaru
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="col relative-position scroll">
      <div v-if="store.loading" class="absolute-center column items-center">
        <q-spinner-cube color="primary" size="4em" />
        <div class="text-caption q-mt-sm text-grey-6">Memuat data log aktivitas...</div>
      </div>

      <div v-else-if="!filteredLogs || filteredLogs.length === 0"
        class="absolute-center column items-center text-grey-6">
        <q-icon name="icon-mat-hourglass_empty" size="4em" />
        <div class="text-subtitle2 q-mt-sm">
          {{ store.logs.length > 0
            ? 'Tidak ada data aktivitas yang cocok dengan pencarian.'
            : 'Belum ada data aktivitas untuk pasien ini.' }}
        </div>
      </div>

      <div v-else class="q-pa-md">
        <!-- Log Activity Accordion / Timeline -->
        <q-list bordered class="rounded-borders bg-white shadow-1 overflow-hidden">
          <q-expansion-item v-for="(log, index) in filteredLogs" :key="log.id" group="log-group"
            header-class="q-py-md hover-bg" expand-icon-class="text-grey-7" :default-opened="index === 0">
            <!-- Header Item Custom Template -->
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar :color="getBadgeColor(log.action)" text-color="white" size="38px">
                  <q-icon :name="getIconByAction(log.action)" size="sm" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-subtitle2">
                  {{ log.action }}
                </q-item-label>
                <q-item-label caption class="row items-center q-gutter-x-sm">
                  <span class="text-weight-medium text-grey-8">
                    {{ log.user?.nama || 'System' }}
                  </span>
                  <span>•</span>
                  <span>{{ formatDateTime(log.created_at) }}</span>
                  <span>•</span>
                  <q-badge outline :color="getBadgeColor(log.action)" size="xs">{{ log.layanan || 'N/A' }}</q-badge>
                </q-item-label>
              </q-item-section>

              <q-item-section side class="gt-sm text-right text-caption text-grey-6">
                <div>IP: {{ log.ip_address }}</div>
                <div class="f-10 ellipsis" style="max-width: 200px;">{{ log.user_agent }}</div>
              </q-item-section>
            </template>

            <q-separator />

            <q-card class="bg-grey-1">
              <q-card-section class="q-pa-md">
                <div class="row q-col-gutter-md">
                  <!-- Section Left: Visual Diff / Perubahan Data -->
                  <div class="col-12 col-md-8">
                    <div class="bg-white rounded-borders border-grey q-pa-sm shadow-sm height-fit">
                      <div class="row items-center justify-between border-bottom q-pb-xs q-mb-sm">
                        <div class="text-subtitle2 text-weight-bold text-teal-8 row items-center q-gutter-xs">
                          <q-icon name="icon-mat-difference" size="sm" />
                          <span>Perubahan Dokumen / Data</span>
                        </div>
                        <q-badge color="grey-3" text-color="grey-8">ID Log: #{{ log.id }}</q-badge>
                      </div>

                      <!-- Document-like Diff Table -->
                      <div class="scroll" style="max-height: 400px;">
                        <table class="diff-table full-width">
                          <thead>
                            <tr>
                              <th style="width: 25%;">Kolom / Properti</th>
                              <th style="width: 75%;">Detail Perubahan (Sebelum vs Sesudah)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="diff in parseChanges(log.description)" :key="diff.key">
                              <td class="text-weight-medium text-grey-7 bg-grey-2 q-pa-xs text-caption word-break">
                                {{ diff.key }}
                              </td>
                              <td class="q-pa-xs text-caption word-break">
                                <!-- Mode INSERT (Hanya ada After) -->
                                <template v-if="diff.type === 'insert'">
                                  <div class="diff-added-wrapper">
                                    <q-icon name="icon-mat-add" color="green" size="14px" class="q-mr-xs" />
                                    <span class="diff-added">{{ formatVal(diff.after) }}</span>
                                  </div>
                                </template>

                                <!-- Mode DELETE (Hanya ada Before) -->
                                <template v-else-if="diff.type === 'delete'">
                                  <div class="diff-removed-wrapper">
                                    <q-icon name="icon-mat-remove" color="red" size="14px" class="q-mr-xs" />
                                    <span class="diff-removed">{{ formatVal(diff.before) }}</span>
                                  </div>
                                </template>

                                <!-- Mode EDIT (Ada Before & After) -->
                                <template v-else>
                                  <div v-if="!diff.isChanged" class="text-grey-5">
                                    {{ formatVal(diff.after) }}
                                  </div>
                                  <div v-else class="row items-start no-wrap q-gutter-x-xs">
                                    <div class="flex-wrap items-center">
                                      <!-- Coret lama, highlight baru (Inline diff) -->
                                      <template v-for="(part, pIdx) in diffWords(diff.before, diff.after)" :key="pIdx">
                                        <span v-if="part.type === 'removed'"
                                          class="diff-removed line-through q-mr-xs">{{ part.text }}</span>
                                        <span v-else-if="part.type === 'added'"
                                          class="diff-added text-weight-bold q-mr-xs">{{ part.text }}</span>
                                        <span v-else class="text-grey-9" style="white-space: pre-wrap;">{{ part.text
                                        }}</span>
                                      </template>
                                    </div>
                                  </div>
                                </template>
                              </td>
                            </tr>
                            <tr v-if="parseChanges(log.description).length === 0">
                              <td colspan="2" class="text-center text-grey-5 q-pa-md italic">
                                Tidak ada detail perubahan properti (Deskripsi kosong atau null)
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Section Right: Technical Metadata -->
                  <div class="col-12 col-md-4">
                    <div class="bg-white rounded-borders border-grey q-pa-md shadow-sm full-height">
                      <div
                        class="text-subtitle2 text-weight-bold text-grey-8 border-bottom q-pb-xs q-mb-md row items-center q-gutter-xs">
                        <q-icon name="icon-mat-settings" size="sm" />
                        <span>Detail Teknis</span>
                      </div>

                      <div class="q-gutter-y-sm">
                        <!-- <div>
                          <div class="text-caption text-grey-6">Eksekusi Sumber (Code Source)</div>
                          <div
                            class="text-body2 text-primary font-mono word-break q-pa-xs bg-grey-2 rounded-borders text-caption">
                            {{ log.source || '-' }}
                          </div>
                        </div> -->

                        <!-- <q-separator class="q-my-sm" /> -->

                        <div>
                          <div class="text-caption text-grey-6 font-semibold">User Operator</div>
                          <div class="text-body2">
                            <span class="text-weight-medium">{{ log.user?.nama || 'System' }}</span>
                            <div class="text-caption text-grey-7">NIP: {{ log.user?.nip || '-' }}</div>
                            <div class="text-caption text-grey-7">Group Nakes: {{ log.user?.kdgroupnakes || '-' }}</div>
                          </div>
                        </div>

                        <q-separator class="q-my-sm" />

                        <div class="row q-col-gutter-sm">
                          <div class="col-6">
                            <div class="text-caption text-grey-6">Alamat IP</div>
                            <div class="text-body2 font-mono">{{ log.ip_address || '-' }}</div>
                          </div>
                          <div class="col-6">
                            <div class="text-caption text-grey-6 font-semibold">Waktu</div>
                            <div class="text-body2 text-caption">{{ formatFullTime(log.created_at) }}</div>
                          </div>
                        </div>

                        <q-separator class="q-my-sm" />

                        <div>
                          <div class="text-caption text-grey-6 font-semibold">User Agent</div>
                          <div class="text-body2 text-caption word-break bg-grey-1 q-pa-xs rounded">
                            {{ log.user_agent || '-' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLogActivityRanapStore } from 'src/stores/simrs/ranap/logactivity'
import { date } from 'quasar'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['close'])

const store = useLogActivityRanapStore()
const searchQuery = ref('')

// Load data saat komponen dimount
onMounted(() => {
  if (props.pasien?.noreg) {
    store.getLogActivities(props.pasien.noreg)
  }
})

function refreshData() {
  if (props.pasien?.noreg) {
    store.getLogActivities(props.pasien.noreg)
  }
}

// Filter log secara lokal di client
const filteredLogs = computed(() => {
  if (!store.logs) return []
  const q = searchQuery.value?.trim().toLowerCase()
  if (!q) return store.logs

  return store.logs.filter(log => {
    const action = (log.action || '').toLowerCase()
    const layanan = (log.layanan || '').toLowerCase()
    const userNama = (log.user?.nama || '').toLowerCase()
    const userNip = (log.user?.nip || '').toLowerCase()
    const source = (log.source || '').toLowerCase()

    let descStr = ''
    if (log.description) {
      if (typeof log.description === 'string') {
        descStr = log.description.toLowerCase()
      } else {
        descStr = JSON.stringify(log.description).toLowerCase()
      }
    }

    return action.includes(q) ||
      layanan.includes(q) ||
      userNama.includes(q) ||
      userNip.includes(q) ||
      source.includes(q) ||
      descStr.includes(q)
  })
})

// Format waktu yang ramah
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '-'
  const d = new Date(dateTimeString)
  return date.formatDate(d, 'DD MMM YYYY, HH:mm') + ' WIB'
}

function formatFullTime(dateTimeString) {
  if (!dateTimeString) return '-'
  const d = new Date(dateTimeString)
  return date.formatDate(d, 'DD MMMM YYYY - HH:mm:ss')
}

// Mendapatkan warna badge aksi
function getBadgeColor(action) {
  if (!action) return 'grey-6'
  const act = action.toLowerCase()
  if (act.includes('create') || act.includes('simpan') || act.includes('tambah')) return 'positive'
  if (act.includes('update') || act.includes('edit') || act.includes('ubah')) return 'info'
  if (act.includes('delete') || act.includes('hapus')) return 'negative'
  return 'primary'
}

// Mendapatkan icon berdasarkan aksi
function getIconByAction(action) {
  if (!action) return 'icon-mat-assignment'
  const act = action.toLowerCase()
  if (act.includes('create') || act.includes('simpan') || act.includes('tambah')) return 'icon-mat-add_box'
  if (act.includes('update') || act.includes('edit') || act.includes('ubah')) return 'icon-mat-edit'
  if (act.includes('delete') || act.includes('hapus')) return 'icon-mat-delete_forever'
  return 'icon-mat-event_note'
}

// Format nilai data agar ramah dipandang
function formatVal(val) {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'object') {
    return JSON.stringify(val)
  }
  return String(val)
}

// Parse deskripsi JSON before dan after menjadi flat list untuk diff tabel
function parseChanges(description) {
  if (!description) return []

  let descObj = description
  if (typeof description === 'string') {
    try {
      descObj = JSON.parse(description)
    } catch (e) {
      return []
    }
  }

  const before = descObj.before || null
  const after = descObj.after || null
  const original = descObj.original || null

  // Kasus: INSERT (after ada, before null)
  if (!before && after) {
    return Object.keys(after).map(key => ({
      key,
      type: 'insert',
      before: null,
      after: after[key],
      isChanged: true
    }))
  }

  // Kasus: DELETE (before ada, after null)
  if (before && !after) {
    return Object.keys(before).map(key => ({
      key,
      type: 'delete',
      before: before[key],
      after: null,
      isChanged: true
    }))
  }

  // Kasus: EDIT (kedua data ada)
  if (before && after) {
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]))
    return allKeys.map(key => {
      const bVal = before[key]
      const aVal = after[key]
      const isChanged = JSON.stringify(bVal) !== JSON.stringify(aVal)
      return {
        key,
        type: 'edit',
        before: bVal,
        after: aVal,
        isChanged
      }
    })
  }

  // Kasus: fallback original
  if (original) {
    return Object.keys(original).map(key => ({
      key,
      type: 'original',
      before: null,
      after: original[key],
      isChanged: false
    }))
  }

  return []
}

// Algoritma LCS (Longest Common Subsequence) untuk word-by-word diff
function diffWords(oldStr, newStr) {
  const oStr = oldStr === null || oldStr === undefined ? '' : String(oldStr)
  const nStr = newStr === null || newStr === undefined ? '' : String(newStr)

  // Memecah teks berdasarkan kata dan spasi agar whitespace tetap terjaga
  const oldWords = oStr.split(/(\s+)/).filter(Boolean)
  const newWords = nStr.split(/(\s+)/).filter(Boolean)

  const dp = Array(oldWords.length + 1).fill(0).map(() => Array(newWords.length + 1).fill(0))

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const result = []
  let i = oldWords.length
  let j = newWords.length

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ type: 'equal', text: oldWords[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: newWords[j - 1] })
      j--
    } else {
      result.unshift({ type: 'removed', text: oldWords[i - 1] })
      i--
    }
  }

  return result
}
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.border-grey {
  border: 1px solid #e0e0e0;
}

.height-fit {
  height: fit-content;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}

.word-break {
  word-break: break-all;
  white-space: pre-wrap;
}

// Styling premium untuk tombol tutup drawer samping
.close-btn {
  width: 25px;
  cursor: pointer;
  position: absolute;
  left: -25px;
  z-index: 1;
  top: 50%;
  margin-top: -30px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #f44336 !important;
    transform: scaleX(1.08);
  }

  .vertical-xxx {
    writing-mode: vertical-lr;
    text-orientation: upright;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
  }
}

// Tampilan Hover pada expansion item
.hover-bg:hover {
  background-color: #f5f5f5;
  transition: background-color 0.15s ease-in-out;
}

// Styling tabel perbandingan diff
.diff-table {
  border-collapse: collapse;
  margin-top: 5px;

  th,
  td {
    border: 1px solid #e0e0e0;
    text-align: left;
  }

  th {
    background-color: #f7f7f7;
    font-weight: 600;
    color: #424242;
    padding: 6px 10px;
    font-size: 12px;
  }
}

// Styling khusus git diff style (coret & highlight)
.diff-removed-wrapper {
  background-color: #ffeef0;
  border-left: 3px solid #f44336;
  padding: 4px 8px;
  border-radius: 0 4px 4px 0;
}

.diff-added-wrapper {
  background-color: #e6ffed;
  border-left: 3px solid #4caf50;
  padding: 4px 8px;
  border-radius: 0 4px 4px 0;
}

.diff-removed {
  background-color: #fdb8c0;
  color: #a71d5d;
  text-decoration: line-through;
  padding: 0 2px;
  border-radius: 2px;
}

.diff-added {
  background-color: #acf2bd;
  color: #22863a;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
