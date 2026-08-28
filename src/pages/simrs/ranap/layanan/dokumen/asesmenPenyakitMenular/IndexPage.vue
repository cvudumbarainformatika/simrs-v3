<template>
  <div class="fit column relative-position bg-grey-4">
    <!-- Header / Toolbar di layar (tidak ikut dicetak) -->
    <div class="col-auto bg-white q-pa-sm shadow-1 no-print">
      <div class="row justify-between items-center q-px-md">
        <div class="row items-center q-gutter-sm">
          <div class="text-subtitle2 text-bold text-indigo-10">DOKUMEN ASESMEN PENYAKIT MENULAR & IMUNOSUPRESED</div>
          <q-badge color="indigo-10" outline class="q-ml-sm" v-if="storeUlang.itemsPenyakitMenular?.length">
            {{ storeUlang.itemsPenyakitMenular.length }} Riwayat Terdaftar
          </q-badge>
        </div>
        <div class="row q-gutter-sm" v-if="storeUlang.itemsPenyakitMenular?.length">
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
        <div class="q-mt-sm">Memuat data riwayat...</div>
      </div>

      <div v-else-if="!storeUlang.itemsPenyakitMenular?.length" class="text-center text-grey-6 q-pa-xl bg-white rounded-borders shadow-1 full-width" style="max-width: 900px; min-height: 300px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <q-icon name="icon-mat-coronavirus" size="64px" class="q-mb-sm text-grey-4" />
        <div class="text-bold text-h6 text-grey-5">Tidak Ada Riwayat Asesmen</div>
        <div class="text-caption text-grey-5">Belum ada riwayat pengkajian khusus penyakit menular & imunosupresed untuk pasien ini.</div>
      </div>

      <div v-else id="print-penyakit-menular-document" class="column items-center q-gutter-y-md full-width">
        <div v-for="(item, idx) in storeUlang.itemsPenyakitMenular" :key="item.id || idx" class="document-container q-mb-md">
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
                <div class="col-6 text-right">Tanggal / Jam Pengkajian: <strong>{{ dateFullFormat(item.tanggal || item.created_at) }} Pukul {{ jamTnpDetik(item.tanggal || item.created_at) }}</strong></div>
              </div>
            </div>

            <!-- Body Lembar Fisik Asesmen -->
            <div class="q-mt-md body-content">
              <!-- Section A -->
              <div class="section-box q-mb-sm">
                <div class="section-title">A. Penyakit Menular</div>
                <div class="section-body text-caption-custom q-gutter-y-xs">
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span>Diagnosis: <strong class="text-uppercase q-mr-sm">{{ item.diagnosis || '-' }}</strong>, ditegakkan : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.status_diag === 'baru' ? '☑' : '☐' }}</span> <span class="q-ml-xs">baru</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.status_diag === 'lama' ? '☑' : '☐' }}</span> <span class="q-ml-xs">lama, sejak:</span></span>
                      <span class="dots-underline font-bold text-uppercase">{{ item.status_diag === 'lama' ? (item.lama_sejak || '-') : '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Pasien mengetahui penyakit saat ini : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.tahu_penyakit === 'tahu' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tahu</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.tahu_penyakit === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Sumber informasi diperoleh dari : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.sumber_info === 'dokter' ? '☑' : '☐' }}</span> <span class="q-ml-xs">dokter</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.sumber_info === 'perawat' ? '☑' : '☐' }}</span> <span class="q-ml-xs">perawat</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.sumber_info === 'keluarga' ? '☑' : '☐' }}</span> <span class="q-ml-xs">keluarga</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.sumber_info === 'lain-lain' ? '☑' : '☐' }}</span> <span class="q-ml-xs">lain-lain</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Menerima informasi jangka waktu pengobatan : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.info_jangka === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.info_jangka === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, </span></span>
                      <span class="dots-underline font-bold">{{ item.info_jangka === 'ya' ? (item.durasi_pengobatan || '-') : '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Melakukan pemeriksaan rutin : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.pemeriksaan_rutin === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.pemeriksaan_rutin === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, di</span></span>
                      <span class="dots-underline font-bold">{{ item.pemeriksaan_rutin === 'ya' ? (item.tempat_rutin || '-') : '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Cara penularan : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.cara_penularan, 'airborne') ? '☑' : '☐' }}</span> <span class="q-ml-xs">airborne</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.cara_penularan, 'droplet') ? '☑' : '☐' }}</span> <span class="q-ml-xs">droplet</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.cara_penularan, 'kontak langsung') ? '☑' : '☐' }}</span> <span class="q-ml-xs">kontak langsung</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.cara_penularan, 'cairan tubuh') ? '☑' : '☐' }}</span> <span class="q-ml-xs">cairan tubuh</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Dirawat diruang isolasi bertekanan negative : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.ruang_isolasi === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.ruang_isolasi === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.ruang_isolasi === 'kohorting' ? '☑' : '☐' }}</span> <span class="q-ml-xs">kohorting</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.ruang_isolasi === 'ruang tersendiri' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ruang tersendiri</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.ruang_isolasi === 'lain-lain' ? '☑' : '☐' }}</span> <span class="q-ml-xs">lain-lain (</span></span>
                      <span class="dots-underline font-bold">{{ item.ruang_isolasi === 'lain-lain' ? (item.ruang_isolasi_ket || '-') : '' }}</span><span>), jika penuh dirujuk ke:</span>
                      <span class="dots-underline font-bold">{{ item.rujuk_ke || '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Penggunaan alat pelindung : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.pakai_apd === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.pakai_apd === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya : </span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'masker') ? '☑' : '☐' }}</span> <span class="q-ml-xs">masker</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'sarung tangan') ? '☑' : '☐' }}</span> <span class="q-ml-xs">sarung tangan</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'baju scort') ? '☑' : '☐' }}</span> <span class="q-ml-xs">baju scort</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'sepatu boot') ? '☑' : '☐' }}</span> <span class="q-ml-xs">sepatu boot</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'kaca mata gogle') ? '☑' : '☐' }}</span> <span class="q-ml-xs">kaca mata gogle</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ isChecked(item.apd, 'lain-lain') ? '☑' : '☐' }}</span> <span class="q-ml-xs">lain-lain</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Penyakit penyerta : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.penyakit_penyerta === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.penyakit_penyerta === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, </span></span>
                      <span class="dots-underline font-bold">{{ item.penyakit_penyerta === 'ya' ? (item.ket_penyakit_penyerta || '-') : '' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section B -->
              <div class="section-box q-mb-sm">
                <div class="section-title">B. Penyakit penurunan daya tahan tubuh (imunosupresed)</div>
                <div class="section-body text-caption-custom q-gutter-y-xs">
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Pasien mengetahui penyakit saat ini : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_tahu_penyakit === 'tahu' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tahu</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_tahu_penyakit === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Sumber informasi tentang penyakit diperoleh dari : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_sumber_info === 'dokter' ? '☑' : '☐' }}</span> <span class="q-ml-xs">dokter</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_sumber_info === 'perawat' ? '☑' : '☐' }}</span> <span class="q-ml-xs">perawat</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_sumber_info === 'keluarga' ? '☑' : '☐' }}</span> <span class="q-ml-xs">keluarga</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_sumber_info === 'lain-lain' ? '☑' : '☐' }}</span> <span class="q-ml-xs">lain-lain</span></span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Menerima informasi jangka waktu pengobatan : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_info_jangka === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_info_jangka === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, </span></span>
                      <span class="dots-underline font-bold">{{ item.b_info_jangka === 'ya' ? (item.b_durasi_pengobatan || '-') : '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Melakukan pemeriksaan rutin : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_pemeriksaan_rutin === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_pemeriksaan_rutin === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, di</span></span>
                      <span class="dots-underline font-bold">{{ item.b_pemeriksaan_rutin === 'ya' ? (item.b_tempat_rutin || '-') : '' }}</span>
                    </div>
                  </div>
                  <div class="row items-center">
                    <div class="col-12 flex items-center wrap">
                      <span class="q-mr-xs">Dirawat terpisah/sendiri : </span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_dirawat_terpisah === 'tidak' ? '☑' : '☐' }}</span> <span class="q-ml-xs">tidak</span></span>
                      <span class="q-mx-xs flex items-center"><span class="check-box">{{ item.b_dirawat_terpisah === 'ya' ? '☑' : '☐' }}</span> <span class="q-ml-xs">ya, di</span></span>
                      <span class="dots-underline font-bold">{{ item.b_dirawat_terpisah === 'ya' ? (item.b_tempat_terpisah || '-') : '' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section C -->
              <div class="section-box q-mb-sm">
                <div class="section-title">C. Analisa masalah</div>
                <div class="section-body text-caption-custom min-h-box" style="white-space: pre-line;">
                  {{ item.analisa_masalah || '-' }}
                </div>
              </div>

              <!-- Section D -->
              <div class="section-box q-mb-md">
                <div class="section-title">D. Tindakan</div>
                <div class="section-body text-caption-custom min-h-box" style="white-space: pre-line;">
                  {{ item.tindakan || '-' }}
                </div>
              </div>

              <!-- Tanda Tangan / Pengkaji -->
              <div class="row justify-end q-mt-lg">
                <div class="col-5 text-center text-caption-custom">
                  <div>Yang melakukan pengkajian</div>
                  <div style="height: 60px;"></div>
                  <div class="text-bold"><u>({{ item.petugas || '..........................................................' }})</u></div>
                  <div>(Nama dan tanda tangan)</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useAsesmenJatuhNyeriStore } from 'src/stores/simrs/ranap/asesmenJatuhNyeri'
import { dateFullFormat, jamTnpDetik } from 'src/modules/formatter'

const AppKopSuratStandard = defineAsyncComponent(() => import('src/components/~global/AppKopSuratStandard.vue'))

const props = defineProps({
  pasien: { type: Object, default: () => null },
  menu: { type: Object, default: () => null },
  kasus: { type: Object, default: () => null },
  dataHeader: { type: Array, default: () => [] }
})

const storeUlang = useAsesmenJatuhNyeriStore()

const documentHeader = computed(() => {
  return [
    'ASSESSMENT KHUSUS',
    'PENYAKIT MENULAR DAN',
    'IMUNOSUPRESED'
  ]
})

const printObj = {
  id: 'print-penyakit-menular-document',
  popTitle: 'Dokumen Asesmen Penyakit Menular'
}

onMounted(() => {
  if (props.pasien) {
    storeUlang.getData(props.pasien)
  }
})

function isChecked(listArr, val) {
  if (Array.isArray(listArr)) {
    return listArr.includes(val)
  }
  return false
}
</script>

<style lang="scss" scoped>
.document-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
}

.print-page {
  border: 1px solid #000;
}

.patient-info {
  border: 1px solid #000;
}

.text-caption-custom {
  font-size: 11px;
  line-height: 1.6;
}

.section-box {
  border: 1px solid #000;
}

.section-title {
  background-color: #f0f0f0;
  border-bottom: 1px solid #000;
  font-weight: bold;
  padding: 4px 8px;
  font-size: 12px;
}

.section-body {
  padding: 8px;
}

.min-h-box {
  min-height: 40px;
}

.check-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  font-weight: bold;
}

.dots-underline {
  border-bottom: 1px dotted #000;
  min-width: 100px;
  display: inline-block;
  padding: 0 4px;
  margin: 0 4px;
  text-align: center;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-page {
    border: none !important;
    padding: 0 !important;
  }
  .document-container {
    width: 100% !important;
    margin: 0 !important;
  }
}
</style>
