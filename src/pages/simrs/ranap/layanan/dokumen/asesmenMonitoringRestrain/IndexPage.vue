<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN MONITORING PENGIKATAN RESTRAIN</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="storeUlang.itemsMonitoringRestrain?.length">
            {{ storeUlang.itemsMonitoringRestrain.length }} Observasi Terdaftar
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="storeUlang.itemsMonitoringRestrain?.length">
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

    <!-- Container Preview Dokumen Cetak -->
    <div class="col full-height scroll q-py-lg q-px-md flex flex-center bg-grey-4">
      <div v-if="storeUlang.loading" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1" style="min-width: 300px;">
        <q-spinner-dots color="indigo-10" size="40px" />
        <div class="q-mt-sm">Memuat data monitoring...</div>
      </div>

      <div v-else-if="!storeUlang.itemsMonitoringRestrain?.length" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1 full-width" style="max-width: 950px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <q-icon name="icon-mat-lock_clock" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Tidak Ada Riwayat Monitoring Restrain</div>
        <div class="text-caption text-grey-5">Belum ada catatan lembar observasi dan monitoring pengikatan fisik (restrain) untuk pasien ini.</div>
      </div>

      <div v-else id="print-monitoring-restrain-document" class="column items-center q-gutter-y-md full-width">
        <div class="document-container q-mb-md">
          <div class="print-page q-pa-md bg-white shadow-1 border-print">
            
            <!-- Kop Surat Standard SIMRS -->
            <div class="col-auto">
              <AppKopSuratStandard :dataHeader="dataHeader" :pasien="pasien" :header="documentHeader" />
            </div>

            <!-- Identitas Ringkas Pasien -->
            <div class="patient-info q-pa-sm q-mt-sm">
              <div class="row items-center justify-between text-caption-custom">
                <div class="col-4">Nama Pasien: <strong>{{ pasien?.nama || '-' }}</strong></div>
                <div class="col-4 text-center">No. RM: <strong>{{ pasien?.norm || '-' }}</strong></div>
                <div class="col-4 text-right">Noreg: <strong>{{ pasien?.noreg || '-' }}</strong></div>
              </div>
              <div class="row items-center justify-between q-mt-xs text-caption-custom">
                <div class="col-6">Tgl. Lahir / Usia: <strong>{{ pasien?.tgllahir || '-' }} / {{ pasien?.usia || '-' }}</strong></div>
                <div class="col-6 text-right">Ruangan: <strong>{{ pasien?.ruangan || '-' }}</strong></div>
              </div>
            </div>

            <!-- TABEL MONITORING PENGIKATAN RESTRAIN -->
            <div class="q-mt-md body-content">
              <table class="table-restrain">
                <thead>
                  <tr>
                    <th style="width: 80px;">Tgl/Jam</th>
                    <th style="width: 90px;">TTV</th>
                    <th style="width: 130px;">Tanda Cidera Akibat Fixasi</th>
                    <th style="width: 130px;">Nutrisi</th>
                    <th style="width: 130px;">Mobilisasi Tempat Fixasi</th>
                    <th style="width: 130px;">Higiene</th>
                    <th style="width: 80px;">Eliminasi</th>
                    <th style="width: 100px;">Kesadaran</th>
                    <th style="width: 80px;">Nama/Paraf</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in storeUlang.itemsMonitoringRestrain" :key="item.id || idx">
                    <!-- Tgl / Jam -->
                    <td class="text-center align-top">
                      <div class="font-bold">{{ item.tanggal ? item.tanggal.slice(0, 10) : (item.created_at ? item.created_at.slice(0, 10) : '-') }}</div>
                      <div class="text-caption-custom">{{ jamTnpDetik(item.tanggal || item.created_at) }}</div>
                    </td>

                    <!-- TTV -->
                    <td class="align-top">
                      <div class="cell-line">T : {{ item.ttv_t || '-' }}</div>
                      <div class="cell-line">N : {{ item.ttv_n || '-' }}</div>
                      <div class="cell-line">S : {{ item.ttv_s || '-' }}</div>
                      <div class="cell-line">RR : {{ item.ttv_rr || '-' }}</div>
                      <div class="cell-line">CRT : {{ item.ttv_crt || '-' }}</div>
                      <div class="cell-line">Akral : {{ item.ttv_akral || '-' }}</div>
                    </td>

                    <!-- Tanda Cidera Akibat Fixasi -->
                    <td class="align-top">
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Merah') ? '☑' : '☐' }}</span> Merah</div>
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Oedema') ? '☑' : '☐' }}</span> Oedema</div>
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Lecet') ? '☑' : '☐' }}</span> Lecet</div>
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Bula') ? '☑' : '☐' }}</span> Bula</div>
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Luxasi/Dislokasi') ? '☑' : '☐' }}</span> Luxasi/Dislokasi</div>
                      <div class="cell-item"><span class="check-box">{{ hasCedera(item, 'Tidak ada cidera') ? '☑' : '☐' }}</span> Tidak ada cidera</div>
                    </td>

                    <!-- Nutrisi -->
                    <td class="align-top">
                      <div class="cell-item"><span class="check-box">{{ item.nutrisi_makan === '1 porsi habis' ? '☑' : '☐' }}</span> 1 porsi habis</div>
                      <div class="cell-item"><span class="check-box">{{ item.nutrisi_makan === '1/2 porsi habis' ? '☑' : '☐' }}</span> 1/2 porsi habis</div>
                      <div class="cell-item"><span class="check-box">{{ item.nutrisi_makan === '3/4 porsi habis' ? '☑' : '☐' }}</span> 3/4 porsi habis</div>
                      <div class="cell-item"><span class="check-box">{{ item.nutrisi_makan === 'Tidak mau makan / minum' ? '☑' : '☐' }}</span> Tidak mau makan / minum</div>
                      <div class="cell-item">
                        <span class="check-box">{{ item.nutrisi_minum_gelas || item.nutrisi_minum_cc ? '☑' : '☐' }}</span>
                        Minum <span class="dots-underline">{{ item.nutrisi_minum_gelas || '.....' }}</span> gelas / <span class="dots-underline">{{ item.nutrisi_minum_cc || '.....' }}</span> cc/24 jam
                      </div>
                    </td>

                    <!-- Mobilisasi Tempat Fixasi -->
                    <td class="align-top">
                      <div class="cell-item">
                        <span class="check-box">{{ item.mobilisasi === 'mobilisasi' ? '☑' : '☐' }}</span>
                        Mobilisasi ekstremitas tiap <span class="dots-underline font-bold">{{ item.mobilisasi === 'mobilisasi' ? (item.mobilisasi_tiap_jam || '....') : '....' }}</span> jam
                      </div>
                      <div class="cell-item q-mt-xs">
                        <span class="check-box">{{ item.mobilisasi === 'tidak' ? '☑' : '☐' }}</span>
                        Tidak dilakukan mobilisasi.
                      </div>
                    </td>

                    <!-- Higiene -->
                    <td class="align-top">
                      <div class="cell-item">
                        <span class="check-box">{{ hasHigiene(item, 'Mandi / Seka') ? '☑' : '☐' }}</span>
                        mandi/seka <span class="dots-underline font-bold">{{ hasHigiene(item, 'Mandi / Seka') ? (item.higiene_mandi_x || '.....') : '.....' }}</span> x/hari
                      </div>
                      <div class="cell-item">
                        <span class="check-box">{{ hasHigiene(item, 'Tidak dilakukan seka') ? '☑' : '☐' }}</span>
                        Tidak dilakukan seka
                      </div>
                      <div class="cell-item">
                        <span class="check-box">{{ hasHigiene(item, 'Ganti pakaian') ? '☑' : '☐' }}</span>
                        Ganti pakaian
                      </div>
                      <div class="cell-item">
                        <span class="check-box">{{ hasHigiene(item, 'Oral Higeine') ? '☑' : '☐' }}</span>
                        Oral higeine <span class="dots-underline font-bold">{{ hasHigiene(item, 'Oral Higeine') ? (item.higiene_oral_x || '.....') : '.....' }}</span> x/hari
                      </div>
                      <div class="cell-item">
                        <span class="check-box">{{ hasHigiene(item, 'Tidak oral higeine') ? '☑' : '☐' }}</span>
                        Tidak oral higeine
                      </div>
                    </td>

                    <!-- Eliminasi -->
                    <td class="align-top">
                      <div class="cell-item">
                        <span class="check-box">{{ item.eliminasi_bab_x ? '☑' : '☐' }}</span>
                        BAB <span class="dots-underline font-bold">{{ item.eliminasi_bab_x || '.....' }}</span> x/hari
                      </div>
                      <div class="cell-item q-mt-xs">
                        <span class="check-box">{{ item.eliminasi_bak_x ? '☑' : '☐' }}</span>
                        BAK <span class="dots-underline font-bold">{{ item.eliminasi_bak_x || '.....' }}</span> x/hari
                      </div>
                    </td>

                    <!-- Kesadaran -->
                    <td class="align-top">
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Composmentis' ? '☑' : '☐' }}</span> Composmentis</div>
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Apatis' ? '☑' : '☐' }}</span> Apatis</div>
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Dellirium' ? '☑' : '☐' }}</span> Dellirium</div>
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Somnolen' ? '☑' : '☐' }}</span> Somnolen</div>
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Sopor' ? '☑' : '☐' }}</span> Sopor</div>
                      <div class="cell-item"><span class="check-box">{{ item.kesadaran === 'Coma' ? '☑' : '☐' }}</span> Coma</div>
                    </td>

                    <!-- Nama/Paraf -->
                    <td class="align-top text-center">
                      <div class="ttd-box">
                        <div class="ttd-petugas font-bold">{{ item.petugas || 'Perawat' }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { jamTnpDetik } from 'src/modules/formatter'

const AppKopSuratStandard = defineAsyncComponent(() => import('src/components/~global/AppKopSuratStandard.vue'))

const storeUlang = useAsesmenJatuhNyeriStore()

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  menu: {
    type: Object,
    default: null
  },
  kasus: {
    type: Object,
    default: null
  },
  dataHeader: {
    type: Array,
    default: () => []
  }
})

onMounted(() => {
  if (props.pasien?.noreg) {
    storeUlang.getData(props.pasien)
  }
})

watch(() => props.pasien, (newPasien) => {
  if (newPasien?.noreg) {
    storeUlang.getData(newPasien)
  }
}, { immediate: true })

const documentHeader = ['LEMBAR OBSERVASI / MONITORING', 'PENGIKATAN (RESTRAIN)', 'PASIEN RAWAT INAP']

const printObj = {
  id: 'print-monitoring-restrain-document',
  popTitle: 'Dokumen Monitoring Restrain Pasien'
}

function hasCedera(item, val) {
  if (!item?.tanda_cedera) return false
  return Array.isArray(item.tanda_cedera) && item.tanda_cedera.includes(val)
}

function hasHigiene(item, val) {
  if (!item?.higiene) return false
  return Array.isArray(item.higiene) && item.higiene.includes(val)
}
</script>

<style lang="scss" scoped>
.document-container {
  width: 100%;
  max-width: 1050px;
}

.print-page {
  background: white;
  width: 100%;
  box-sizing: border-box;
  color: #111;
  font-family: 'Times New Roman', Times, serif;
}

.border-print {
  border: 1px solid #999;
}

.patient-info {
  border: 1px solid #111;
  background-color: #fafafa;
}

.text-caption-custom {
  font-size: 11px;
}

.table-restrain {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;

  th, td {
    border: 1px solid #111;
    padding: 4px;
  }

  thead th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: center;
    font-size: 10.5px;
  }
}

.cell-line {
  line-height: 1.3;
}

.cell-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  line-height: 1.25;
  margin-bottom: 2px;
}

.check-box {
  font-family: monospace;
  font-size: 12px;
  line-height: 1;
}

.dots-underline {
  border-bottom: 1px dotted #111;
  padding: 0 2px;
}

.font-bold {
  font-weight: bold;
}

.ttd-box {
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.ttd-petugas {
  font-size: 9.5px;
  border-top: 1px solid #555;
  padding-top: 2px;
  width: 100%;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .table-restrain {
    font-size: 9.5px;
  }
}
</style>
