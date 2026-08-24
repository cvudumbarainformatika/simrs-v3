<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN MONITORING PASIEN SETELAH JATUH</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="storeUlang.itemsPascaJatuh?.length">
            {{ storeUlang.itemsPascaJatuh.length }} Riwayat Terdaftar
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="storeUlang.itemsPascaJatuh?.length">
          <q-btn
            v-print="printObj"
            color="indigo-10"
            icon="icon-mat-print"
            label="Cetak Dokumen"
            no-caps
            dense
            class="q-px-md"
          />
        </div>
      </div>
    </div>

    <!-- Container Preview Dokumen -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="storeUlang.loading" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1" style="min-width: 300px;">
        <q-spinner-dots color="indigo-10" size="40px" />
        <div class="q-mt-sm">Memuat data riwayat...</div>
      </div>

      <div v-else-if="!storeUlang.itemsPascaJatuh?.length" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1 full-width" style="max-width: 900px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <q-icon name="icon-my-file_sign" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Belum Ada Riwayat Monitoring Pasca Jatuh</div>
        <div class="text-caption text-grey-5">Belum ada riwayat dokumen pemantauan pasien setelah jatuh yang dicatat untuk pasien ini.</div>
      </div>

      <div v-else id="print-pasca-jatuh-document" class="column items-center q-gutter-y-md full-width">
        <div v-for="(item, idx) in formattedItems" :key="item.id || idx" class="document-container print-page q-pa-md bg-white shadow-1 q-mb-md">
          
          <!-- Kop Surat Standard RSUD Dokter Mohamad Saleh -->
          <div class="col-auto">
            <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="documentHeader" />
          </div>

          <!-- Informasi Tanggal & Jam Kejadian Jatuh -->
          <div class="patient-info q-pa-sm q-mt-sm">
            <div class="row items-center justify-between text-caption-custom">
              <div class="col-6">Tanggal Kejadian Jatuh: <strong>{{ dateFullFormat(item.tgl_jatuh) }}</strong></div>
              <div class="col-6 text-right">Jam Kejadian Jatuh: <strong>{{ item.jam_jatuh || '-' }}</strong></div>
            </div>
          </div>

          <!-- Tabel Monitoring Pasien Setelah Jatuh -->
          <div class="q-mt-md table-responsive">
            <table class="pasca-jatuh-table full-width">
              <thead>
                <tr class="bg-grey-2">
                  <th class="text-center text-bold border-cell text-xs" width="16%">Rentang Waktu</th>
                  <th class="text-left text-bold border-cell text-xs">Tindakan</th>
                  <th class="text-center text-bold border-cell text-xs" width="8%">Jam</th>
                  <th class="text-center text-bold border-cell text-xs" width="6%">Ya</th>
                  <th class="text-center text-bold border-cell text-xs" width="6%">Tidak</th>
                  <th class="text-left text-bold border-cell text-xs" width="22%">Keterangan</th>
                  <th class="text-center text-bold border-cell text-xs" width="14%">TTD dan Nama</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(group, gIdx) in item.groups" :key="gIdx">
                  <tr v-for="(tdk, tIdx) in group.list" :key="tIdx">
                    <!-- Rentang Waktu (Rowspan) -->
                    <td v-if="tIdx === 0" :rowspan="group.list.length" class="text-center text-bold border-cell text-xs align-middle bg-grey-1">
                      {{ group.label }}
                    </td>
                    <!-- Tindakan / Observasi -->
                    <td class="text-left border-cell text-xxs">
                      <span v-if="tdk.code" class="text-bold q-mr-xs">{{ tdk.code }}.</span>
                      <span :class="{'text-bold': !tdk.code}">{{ tdk.label }}</span>
                    </td>
                    <!-- Jam -->
                    <td class="text-center border-cell text-xxs font-mono">
                      {{ tdk.jam || '-' }}
                    </td>
                    <!-- Ya -->
                    <td class="text-center border-cell text-xs font-mono">
                      {{ tdk.ya ? '✓' : '' }}
                    </td>
                    <!-- Tidak -->
                    <td class="text-center border-cell text-xs font-mono">
                      {{ tdk.tidak ? '✓' : '' }}
                    </td>
                    <!-- Keterangan -->
                    <td class="text-left border-cell text-xxs">
                      {{ tdk.keterangan || '-' }}
                    </td>
                    <!-- TTD dan Nama PPA (Rowspan per Rentang Waktu / Kelompok Observasi) -->
                    <td v-if="tIdx === 0" :rowspan="group.list.length" class="text-center border-cell text-xxs align-middle">
                      <div class="q-pa-xs column items-center justify-center">
                        <app-qr-petugas
                          :noreg="item.noreg"
                          :jnssurat="'MONITORING-PASCA-JATUH.png'"
                          :asal="'RANAP'"
                          :kdpegsimrs="group.kdpegsimrs || item.kdpegsimrs"
                          width="50px"
                          height="50px"
                        />
                        <div class="text-bold q-mt-xs">{{ group.petugas || item.petugas }}</div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri.js'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'
import { dateFullFormat } from 'src/modules/formatter'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  }
})

const storeUlang = useAsesmenJatuhNyeriStore()

const documentHeader = ref(['MONITORING PASIEN SETELAH JATUH'])

const dataHeader = ref([
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'RSUD DOKTER MOHAMMAD SALEH',
  'Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705',
  'e-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
])

const printObj = {
  id: 'print-pasca-jatuh-document',
  popTitle: 'Dokumen Monitoring Pasien Setelah Jatuh'
}

watch(() => props.pasien, (newPasien) => {
  if (newPasien) {
    storeUlang.getData(newPasien)
  }
}, { immediate: true })

onMounted(() => {
  if (props.pasien) {
    storeUlang.getData(props.pasien)
  }
})

// Format Data untuk Render Tabel Dokumen Rekam Medis
const formattedItems = computed(() => {
  if (!storeUlang.itemsPascaJatuh) return []
  
  return storeUlang.itemsPascaJatuh.map(raw => {
    const details = typeof raw.details === 'string' ? JSON.parse(raw.details || '{}') : (raw.details || {})
    
    // Grouping per rentang waktu
    const groups = [
      { key: 'segera', label: 'Tindakan segera', list: [] },
      { key: 'jam6', label: '6 jam setelah jatuh', list: [] },
      { key: 'jam612', label: '6-12 jam setelah jatuh', list: [] },
      { key: 'jam1248', label: '12-48 jam setelah jatuh', list: [] },
      { key: 'jam4872', label: '48-72 jam setelah jatuh', list: [] }
    ]

    Object.keys(details).forEach(k => {
      const itemDetail = details[k]
      const cat = itemDetail.category || 'segera'
      const grp = groups.find(g => g.key === cat)
      if (grp) {
        grp.list.push(itemDetail)
        if (itemDetail.petugas && !grp.petugas) {
          grp.petugas = itemDetail.petugas
          grp.kdpegsimrs = itemDetail.kdpegsimrs
        }
      }
    })

    return {
      ...raw,
      petugas: raw.pegawai?.nama || 'Petugas',
      groups: groups.filter(g => g.list.length > 0)
    }
  })
})
</script>

<style lang="scss" scoped>
.patient-info {
  border: 1px solid #000;
  border-radius: 4px;
  box-sizing: border-box;
}

.text-caption-custom {
  font-size: 11px;
  line-height: 1.3;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.pasca-jatuh-table {
  border-collapse: collapse;
  margin-top: 5px;
  width: 100%;
  
  th, td {
    padding: 5px 6px;
    border: 1px solid #000;
  }
}

.border-cell {
  border: 1px solid #000 !important;
}

.align-middle {
  vertical-align: middle;
}

.text-xxs {
  font-size: 9.5px;
  line-height: 1.2;
}

.text-bold {
  font-weight: bold;
}

.document-container {
  width: 100%;
  max-width: 950px;
}

.print-page {
  box-sizing: border-box;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
</style>

<style lang="scss">
@media print {
  .no-print {
    display: none !important;
  }

  @page {
    size: A4 portrait !important;
    margin: 8mm 10mm !important;
  }

  body {
    background: #fff !important;
  }

  .fit {
    height: auto !important;
    min-height: 0 !important;
  }

  .scroll {
    overflow: visible !important;
  }

  .bg-grey-4 {
    background-color: #fff !important;
  }

  .document-container {
    width: 190mm !important;
    max-width: 190mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-shadow: none !important;
    page-break-after: always !important;
  }

  .print-page {
    width: 190mm !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 3mm 4mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
    border: none !important;
  }

  .patient-info {
    margin-top: 4px !important;
    padding: 4px 6px !important;
  }

  .text-caption-custom {
    font-size: 10px !important;
  }

  .pasca-jatuh-table {
    width: 100% !important;
    
    th, td {
      border: 1px solid #000 !important;
      color: #000 !important;
      padding: 4px 5px !important;
      line-height: 1.15 !important;
    }
  }
  
  .border-cell {
    border: 1px solid #000 !important;
  }

  * {
    color: #000000 !important;
  }
}
</style>
