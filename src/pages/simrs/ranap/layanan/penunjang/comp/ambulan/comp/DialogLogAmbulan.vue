<template>
  <q-dialog v-model="isOpen" position="right" full-height>
    <q-card style="width: 750px; max-width: 95vw;" class="fit column bg-grey-1 text-grey-9">
      <!-- HEADER DIALOG -->
      <q-card-section class="bg-primary text-white q-py-sm q-px-md row items-center justify-between no-wrap shadow-2">
        <div class="row items-center q-gutter-x-sm">
          <q-avatar icon="icon-mat-history" color="teal-6" text-color="white" size="36px" />
          <div>
            <div class="text-subtitle1 text-weight-bold leading-tight">Riwayat Log Pemesanan Ambulance</div>
            <div class="text-caption text-teal-1 opacity-90" style="font-size: 11px;">
              Audit trail & riwayat perubahan form pemesanan ambulance
            </div>
          </div>
        </div>
        <q-btn flat round dense icon="icon-mat-close" size="md" color="white" v-close-popup />
      </q-card-section>

      <!-- INFO SUB-HEADER -->
      <q-card-section class="bg-white border-bottom q-px-md q-py-xs shadow-1">
        <div class="row items-center justify-between">
          <div class="row items-center q-gutter-x-md text-caption">
            <div><b>Pasien:</b> <span class="text-primary">{{ pasien?.nama || '-' }}</span></div>
            <q-separator vertical />
            <div><b>No. RM:</b> <span class="text-amber-9">{{ pasien?.norm || '-' }}</span></div>
            <q-separator vertical />
            <div><b>No. Reg:</b> <span class="text-teal-7">{{ pasien?.noreg || '-' }}</span></div>
            <template v-if="selectedItem?.nota">
              <q-separator vertical />
              <div><b>Nota:</b> <q-badge color="primary" class="text-bold">{{ selectedItem?.nota }}</q-badge></div>
            </template>
          </div>
          <q-btn flat round dense color="primary" icon="icon-mat-refresh" @click="fetchLogs" :loading="loading" title="Segarkan Log" />
        </div>
      </q-card-section>

      <!-- CONTENT BODY -->
      <q-card-section class="col scroll q-pa-md relative-position">
        <div v-if="loading" class="absolute-center column items-center">
          <q-spinner-cube color="primary" size="3.5em" />
          <div class="text-caption q-mt-sm text-grey-7">Memuat riwayat log ambulance...</div>
        </div>

        <div v-else-if="!filteredLogs || filteredLogs.length === 0" class="absolute-center column items-center text-grey-6 text-center">
          <q-icon name="icon-mat-hourglass_empty" size="4em" color="grey-4" />
          <div class="text-subtitle2 q-mt-sm text-bold">Belum Ada Riwayat Perubahan</div>
          <div class="text-caption text-grey-6" style="max-width: 320px;">
            Belum terdapat catatan log aktivitas untuk pemesanan ambulance pasien ini.
          </div>
        </div>

        <div v-else class="q-gutter-y-sm">
          <q-card v-for="(log, idx) in filteredLogs" :key="log.id || idx" flat bordered class="rounded-borders bg-white shadow-1 overflow-hidden">
            <div class="q-pa-sm row items-center justify-between bg-grey-2 border-bottom">
              <div class="row items-center q-gutter-x-sm">
                <q-badge :color="getBadgeColor(log.action)" class="text-bold q-px-sm q-py-xs">
                  {{ log.action }}
                </q-badge>
                <span class="text-caption text-weight-bold text-dark">
                  {{ log.user?.nama || 'Petugas' }}
                </span>
              </div>
              <div class="text-caption text-grey-7 font-mono" style="font-size: 11px;">
                {{ formatFullTime(log.created_at) }}
              </div>
            </div>

            <!-- DETAIL PERUBAHAN -->
            <q-card-section class="q-pa-xs">
              <div class="overflow-hidden rounded-borders border-grey">
                <table class="table-log-compact full-width">
                  <thead>
                    <tr class="bg-indigo-1 text-indigo-10 text-weight-bold">
                      <th style="width: 25%;" class="text-left q-pa-xs">Parameter / Kolom</th>
                      <th class="text-left q-pa-xs">Perubahan Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="diff in parseChanges(log.description)" :key="diff.key" class="border-bottom">
                      <td class="text-weight-bold text-grey-8 bg-grey-1 q-pa-xs text-caption">
                        {{ formatKeyName(diff.key) }}
                      </td>
                      <td class="q-pa-xs text-caption word-break">
                        <!-- Mode INSERT -->
                        <template v-if="diff.type === 'insert'">
                          <div class="diff-added-wrapper">
                            <q-icon name="icon-mat-add" color="green-8" size="14px" class="q-mr-xs" />
                            <span class="diff-added">{{ formatVal(diff.after) }}</span>
                          </div>
                        </template>

                        <!-- Mode DELETE -->
                        <template v-else-if="diff.type === 'delete'">
                          <div class="diff-removed-wrapper">
                            <q-icon name="icon-mat-remove" color="red-8" size="14px" class="q-mr-xs" />
                            <span class="diff-removed">{{ formatVal(diff.before) }}</span>
                          </div>
                        </template>

                        <!-- Mode EDIT -->
                        <template v-else>
                          <div v-if="!diff.isChanged" class="text-grey-6">
                            {{ formatVal(diff.after) }}
                          </div>
                          <div v-else class="row items-start no-wrap q-gutter-x-xs">
                            <div class="flex-wrap items-center">
                              <template v-for="(part, pIdx) in diffWords(diff.before, diff.after)" :key="pIdx">
                                <span v-if="part.type === 'removed'" class="diff-removed line-through q-mr-xs">{{ part.text }}</span>
                                <span v-else-if="part.type === 'added'" class="diff-added text-weight-bold q-mr-xs">{{ part.text }}</span>
                                <span v-else class="text-grey-9" style="white-space: pre-wrap;">{{ part.text }}</span>
                              </template>
                            </div>
                          </div>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="parseChanges(log.description).length === 0">
                      <td colspan="2" class="text-center text-grey-5 q-pa-sm italic">
                        Tidak ada detail perubahan properti.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  pasien: {
    type: Object,
    default: null
  },
  selectedItem: {
    type: Object,
    default: null
  }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})

const logs = ref([])
const loading = ref(false)

watch(() => props.modelValue, (val) => {
  if (val && props.pasien?.noreg) {
    fetchLogs()
  }
})

async function fetchLogs() {
  if (!props.pasien?.noreg) return
  loading.value = true
  try {
    const resp = await api.get('v1/simrs/farmasinew/activity/by-noreg', {
      params: { noreg: props.pasien.noreg }
    })
    if (resp.status === 200) {
      logs.value = resp.data || []
    } else {
      logs.value = []
    }
  } catch (e) {
    console.error('Error load ambulance logs:', e)
    logs.value = []
  } finally {
    loading.value = false
  }
}

// Filter khusus model ReqAmbulan / Ambulance
const filteredLogs = computed(() => {
  if (!logs.value?.length) return []
  return logs.value.filter(log => {
    const action = (log.action || '').toLowerCase()
    const layanan = (log.layanan || '').toLowerCase()
    return action.includes('ambulan') || action.includes('reqambulan') || layanan.includes('ambulan') || layanan.includes('reqambulan')
  })
})

function formatFullTime(tgl) {
  if (!tgl) return '-'
  return date.formatDate(tgl, 'DD MMMM YYYY - HH:mm:ss')
}

function getBadgeColor(action) {
  const act = (action || '').toLowerCase()
  if (act.includes('created')) return 'positive'
  if (act.includes('updated')) return 'warning'
  if (act.includes('deleted')) return 'negative'
  return 'primary'
}

const keyMap = {
  rs1: 'No. Registrasi',
  rs2: 'No. RM',
  rs3: 'Tanggal Order',
  rs4: 'Ruangan',
  rs5: 'Kode Poli',
  rs6: 'Sistem Bayar',
  rs9: 'Dokter Pengirim',
  rs10: 'Tujuan Ambulan',
  rs11: 'Keterangan',
  rs12: 'Layanan Supir',
  rs13: 'Perawat 1',
  rs14: 'Perawat 2',
  rs15: 'Layanan Perawat',
  rs16: 'Tarif / Jasa',
  nota: 'Nomor Nota',
  alasan_keperluan: 'Alasan / Keperluan',
  indikasi_rujuk: 'Indikasi Rujuk',
  jenis_ambulan: 'Jenis Ambulan',
  skor_indeks: 'Skor Indeks Risiko',
  kategori_resiko: 'Kategori Risiko',
  kualifikasi_petugas: 'Kualifikasi Petugas',
  penilaian_resiko: 'Penilaian 11 Parameter'
}

function formatKeyName(key) {
  return keyMap[key] || key
}

function formatVal(val) {
  if (val === null || val === undefined || val === '') return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function parseChanges(description) {
  if (!description) return []
  let payload = null
  if (typeof description === 'string') {
    try {
      payload = JSON.parse(description)
    } catch (e) {
      return []
    }
  } else if (typeof description === 'object') {
    payload = description
  }

  if (!payload) return []

  const before = payload.before || null
  const after = payload.after || null
  const original = payload.original || null

  const ignoredKeys = ['updated_at', 'created_at', 'id']

  // INSERT
  if (!before && after) {
    return Object.keys(after)
      .filter(k => !ignoredKeys.includes(k))
      .map(key => ({
        key,
        type: 'insert',
        before: null,
        after: after[key],
        isChanged: true
      }))
  }

  // DELETE
  if (before && !after) {
    return Object.keys(before)
      .filter(k => !ignoredKeys.includes(k))
      .map(key => ({
        key,
        type: 'delete',
        before: before[key],
        after: null,
        isChanged: true
      }))
  }

  // EDIT
  if (before && after) {
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]))
      .filter(k => !ignoredKeys.includes(k))

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
    }).filter(x => x.isChanged)
  }

  if (original) {
    return Object.keys(original)
      .filter(k => !ignoredKeys.includes(k))
      .map(key => ({
        key,
        type: 'original',
        before: null,
        after: original[key],
        isChanged: false
      }))
  }

  return []
}

function diffWords(oldStr, newStr) {
  const oStr = oldStr === null || oldStr === undefined ? '' : String(oldStr)
  const nStr = newStr === null || newStr === undefined ? '' : String(newStr)

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
      result.unshift({ type: 'same', text: oldWords[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: newWords[j - 1] })
      j--
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'removed', text: oldWords[i - 1] })
      i--
    }
  }

  return result
}
</script>

<style scoped>
.table-log-compact {
  border-collapse: collapse;
  font-size: 11px;
}
.table-log-compact th, .table-log-compact td {
  border: 1px solid #e0e0e0;
  padding: 4px 8px;
}
.diff-added {
  background-color: #dcfce7;
  color: #15803d;
  padding: 1px 4px;
  border-radius: 3px;
}
.diff-removed {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1px 4px;
  border-radius: 3px;
}
.word-break {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
