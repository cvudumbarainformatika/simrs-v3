<template>
  <q-dialog v-model="isOpen" persistent full-width max-width="950px">
    <q-card style="width: 900px; max-width: 95vw;" class="bg-white text-black font-sans">
      <!-- HEADER DIALOG -->
      <q-card-section class="row items-center justify-between bg-dark text-white q-py-xs">
        <div class="text-subtitle1 text-bold flex items-center">
          <q-icon name="icon-mat-visibility" size="20px" class="q-mr-xs" />
          Detail Asesmen Pra Sedasi
        </div>
        <div>
          <q-btn flat round dense icon="icon-mat-close" v-close-popup color="white" />
        </div>
      </q-card-section>

      <!-- CONTENT BODY (DOCUMENT DETAIL) -->
      <q-card-section class="q-pa-md overflow-auto" style="max-height: 82vh;">
        <div class="pra-sedasi-doc text-black">
          <!-- KOP SURAT STANDAR RS -->
          <AppKopSuratStandard :pasien="pasien" :header="['ASESMEN PRA SEDASI', 'LEMBAR ASESMEN PRA SEDASI']" />

          <!-- HEADER INFORMASI PASIEN -->
          <div class="doc-header q-my-xs">
            <div class="row border-bottom-dark q-pb-xs">
              <div class="col-4"><strong>NO. RM</strong> : {{ pasien?.norm || '....................' }}</div>
              <div class="col-5"><strong>NAMA PASIEN</strong> : {{ pasien?.nama || '................................ me........' }}</div>
              <div class="col-3 text-right"><strong>TGL LAHIR</strong> : {{ pasien?.tgllahir || '....................' }}</div>
            </div>
            <div class="row q-pt-xs">
              <div class="col-3"><strong>J. Kelamin</strong> : {{ pasien?.kelamin || 'L / P' }}</div>
              <div class="col-5"><strong>Alamat</strong> : {{ pasien?.alamat || '........................................' }}</div>
              <div class="col-4 text-right"><strong>Dokter Anestesi</strong> : {{ item?.dokter || '................................' }}</div>
            </div>
          </div>

          <div class="text-bold text-italic q-my-xs">Diisi oleh Dokter</div>

          <!-- 1. KAJIAN SISTEM -->
          <div class="section-title">KAJIAN SISTEM</div>
          <table class="full-width table-tight">
            <tbody>
              <tr>
                <td width="30%">Hilangnya Gigi</td>
                <td width="20%">
                  <q-checkbox :model-value="kajianObj?.hilangnyaGigi === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.hilangnyaGigi === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td width="30%">Muntah</td>
                <td width="20%">
                  <q-checkbox :model-value="kajianObj?.muntah === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.muntah === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Masalah mobilisasi leher</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.masalahMobilisasiLeher === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.masalahMobilisasiLeher === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Pingsan</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.pingsan === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.pingsan === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Leher Pendek</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.leherPendek === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.leherPendek === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Stroke</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.stroke === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.stroke === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Batuk</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.batuk === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.batuk === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Kejang</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.kejang === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.kejang === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Sesak Nafas</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.sesakNafas === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.sesakNafas === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Sedang Hamil</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.sedangHamil === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.sedangHamil === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Baru saja menderita infeksi</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.baruSajaInfeksi === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.baruSajaInfeksi === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Kelainan tulang belakang</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.kelainanTulangBelakang === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.kelainanTulangBelakang === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Saluran nafas atas sakit dada</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.saluranNafasSakitDada === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.saluranNafasSakitDada === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td>Obesitas</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.obesitas === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.obesitas === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
              </tr>
              <tr>
                <td>Denyut Jantung tidak normal</td>
                <td>
                  <q-checkbox :model-value="kajianObj?.denyutJantungTidakNormal === 'Ya'" size="xs" label="Ya" dense disable color="black" class="q-mr-xs" />
                  <q-checkbox :model-value="kajianObj?.denyutJantungTidakNormal === 'Tidak'" size="xs" label="Tidak" dense disable color="black" />
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="4" class="py-tight">
                  <strong>Keterangan</strong> : <span class="dotted-text">{{ item?.keterangan_kajian_sistem || '................................................................................................................................................................' }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 2. PEMERIKSAAN FISIK -->
          <div class="section-title q-mt-xs">PEMERIKSAAN FISIK</div>
          <div class="row py-tight">
            <div class="col-12">
              Tinggi : <span class="dotted-val">{{ item?.tinggi || '........' }}</span> cm &nbsp;&nbsp;&nbsp;&nbsp;
              Berat : <span class="dotted-val">{{ item?.berat || '........' }}</span> kg &nbsp;&nbsp;&nbsp;&nbsp;
              Tekanan darah : <span class="dotted-val">{{ item?.tekanan_darah || '........' }}</span> mmHg &nbsp;&nbsp;&nbsp;&nbsp;
              Nadi : <span class="dotted-val">{{ item?.nadi || '........' }}</span> x/mnt &nbsp;&nbsp;&nbsp;&nbsp;
              Suhu : <span class="dotted-val">{{ item?.suhu || '........' }}</span> °C
            </div>
          </div>

          <!-- 3. KEADAAN UMUM -->
          <div class="section-title q-mt-xs">KEADAAN UMUM</div>
          <div class="row py-tight">
            <div class="col-7">Skor Mallampati : <span class="dotted-val">{{ item?.skor_mallampati || '................................................' }}</span></div>
            <div class="col-5">Gigi Palsu : <span class="dotted-val">{{ item?.gigi_palsu || '................................................' }}</span></div>
            <div class="col-12">Jantung : <span class="dotted-val">{{ item?.jantung || '................................................................................................................................' }}</span></div>
            <div class="col-12">Paru-paru : <span class="dotted-val">{{ item?.paru_paru || '................................................................................................................................' }}</span></div>
            <div class="col-12">Abdomen : <span class="dotted-val">{{ item?.abdomen || '................................................................................................................................' }}</span></div>
            <div class="col-12">Tulang Belakang : <span class="dotted-val">{{ item?.tulang_belakang || '................................................................................................................................' }}</span></div>
            <div class="col-12">Ekstremitas : <span class="dotted-val">{{ item?.ekstremitas || '................................................................................................................................' }}</span></div>
            <div class="col-12">Neurologi (bila dapat diperiksa) : <span class="dotted-val">{{ item?.neurologi || '................................................................................................................................' }}</span></div>
            <div class="col-12">Keterangan : <span class="dotted-val">{{ item?.keterangan_keadaan_umum || '................................................................................................................................' }}</span></div>
          </div>

          <!-- 4. LABORATORIUM -->
          <div class="section-title q-mt-xs">LABORATORIUM (bila tersedia)</div>
          <table class="full-width table-tight">
            <tbody>
              <tr>
                <td width="50%">
                  <q-checkbox :model-value="Boolean(labObj?.hbHtCheck)" size="xs" label="Hb/Ht :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.hbHt || '................................................' }}</span>
                </td>
                <td width="50%">
                  <q-checkbox :model-value="Boolean(labObj?.leukositCheck)" size="xs" label="Leukosit :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.leukosit || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.ptCheck)" size="xs" label="PT :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.pt || '................................................' }}</span>
                </td>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.trombositCheck)" size="xs" label="Trombosit :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.trombosit || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.glukosaDarahCheck)" size="xs" label="Glukosa darah :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.glukosaDarah || '................................................' }}</span>
                </td>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.rontgenDadaCheck)" size="xs" label="Rontgen dada :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.rontgenDada || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.tesKehamilanCheck)" size="xs" label="Tes Kehamilan :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.tesKehamilan || '................................................' }}</span>
                </td>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.ekgCheck)" size="xs" label="EKG (40 tahun keatas) :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.ekg || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.kaliumCheck)" size="xs" label="Kalium :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.kalium || '................................................' }}</span>
                </td>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.naClCheck)" size="xs" label="Na/Cl :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.naCl || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.ureumCheck)" size="xs" label="Ureum :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.ureum || '................................................' }}</span>
                </td>
                <td>
                  <q-checkbox :model-value="Boolean(labObj?.kreatininCheck)" size="xs" label="Kreatinin :" dense disable color="black" class="q-mr-xs" />
                  <span class="dotted-val">{{ labObj?.kreatinin || '................................................' }}</span>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="py-tight">
                  Keterangan : <span class="dotted-val">{{ item?.keterangan_laboratorium || '................................................................................................................................' }}</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 5. DIAGNOSIS & 6. ASA CLASSIFICATION -->
          <div class="row q-col-gutter-x-md q-col-gutter-y-none q-mt-xs">
            <div class="col-6">
              <div class="section-title">DIAGNOSIS (ICD X)</div>
              <div class="py-tight">1. <span class="dotted-val">{{ diagArr?.[0] || '................................................................' }}</span></div>
              <div class="py-tight">2. <span class="dotted-val">{{ diagArr?.[1] || '................................................................' }}</span></div>
            </div>
            <div class="col-6">
              <div class="section-title">ASA CLASSIFICATION</div>
              <div class="py-tight">
                <q-checkbox :model-value="item?.asa_classification === 'ASA 1'" size="xs" label="ASA 1 Pasien normal yang sehat" dense disable color="black" />
              </div>
              <div class="py-tight">
                <q-checkbox :model-value="item?.asa_classification === 'ASA 2'" size="xs" label="ASA 2 Pasien dengan penyakit sistemik ringan" dense disable color="black" />
              </div>
              <div class="py-tight">
                <q-checkbox :model-value="item?.asa_classification === 'ASA 3'" size="xs" label="ASA 3 Pasien dengan penyakit sistemik berat" dense disable color="black" />
              </div>
              <div class="py-tight">
                <q-checkbox :model-value="item?.asa_classification === 'ASA 4'" size="xs" label="ASA 4 Pasien dengan penyakit sistemik berat yang mengancam nyawa." dense disable color="black" />
              </div>
            </div>
          </div>

          <!-- 7. PENYULIT SEDASI LAIN & 8. CATATAN TINDAK LANJUT -->
          <div class="row q-col-gutter-x-md q-col-gutter-y-none q-mt-xs">
            <div class="col-6">
              <div class="section-title">PENYULIT SEDASI LAIN :</div>
              <div class="py-tight">1. <span class="dotted-val">{{ penyulitArr?.[0] || '................................................................' }}</span></div>
              <div class="py-tight">2. <span class="dotted-val">{{ penyulitArr?.[1] || '................................................................' }}</span></div>
            </div>
            <div class="col-6">
              <div class="section-title">CATATAN TINDAK LANJUT :</div>
              <div class="py-tight"><span class="dotted-val">{{ item?.catatan_tindak_lanjut || '................................................................................................' }}</span></div>
            </div>
          </div>

          <!-- 9. PERENCANAAN SEDASI -->
          <div class="section-title q-mt-xs">PERENCANAAN SEDASI</div>
          <div class="py-tight">Teknik Sedasi : <span class="dotted-val">{{ item?.teknik_sedasi || '................................................' }}</span></div>
          <div class="py-tight">
            Teknik Khusus :
            <span class="q-ml-sm">
              <q-checkbox :model-value="isTeknikKhusus('Hipotensi')" size="xs" label="Hipotensi" dense disable color="black" class="q-mr-sm" />
              <q-checkbox :model-value="isTeknikKhusus('Ventilasi satu paru')" size="xs" label="Ventilasi satu paru" dense disable color="black" class="q-mr-sm" />
              <q-checkbox :model-value="isTeknikKhusus('TCI')" size="xs" label="TCI" dense disable color="black" class="q-mr-sm" />
              <q-checkbox :model-value="isTeknikKhusus('Lain-lain')" size="xs" label="Lain-lain" dense disable color="black" />
            </span>
          </div>
          <div class="py-tight q-ml-lg">
            <q-checkbox :model-value="isTeknikKhusus('Gildescope')" size="xs" label="Gildescope" dense disable color="black" class="q-mr-sm" /><br>
            <q-checkbox :model-value="isTeknikKhusus('USG')" size="xs" label="USG" dense disable color="black" class="q-mr-sm" /><br>
            <q-checkbox :model-value="isTeknikKhusus('Lain-lain')" size="xs" label="Lain-lain :" dense disable color="black" />
            <span class="dotted-val">{{ item?.teknik_khusus_lain || '................................................................................' }}</span>
          </div>

          <div class="py-tight q-mt-xs">Perawatan pasca Sedasi :</div>
          <div class="py-tight q-ml-lg">
            <q-checkbox :model-value="item?.perawatan_pasca_sedasi === 'Rawat Inap'" size="xs" label="Rawat Inap" dense disable color="black" /><br>
            <q-checkbox :model-value="item?.perawatan_pasca_sedasi === 'Rawat Jalan'" size="xs" label="Rawat Jalan" dense disable color="black" /><br>
            <q-checkbox :model-value="item?.perawatan_pasca_sedasi === 'Rawat Khusus'" size="xs" label="Rawat Khusus :" dense disable color="black" />
            <q-radio :model-value="item?.rawat_khusus_opt" val="ICU" size="xs" label="ICU" dense disable color="black" class="q-ml-xs" />
            <q-radio :model-value="item?.rawat_khusus_opt" val="ICCU" size="xs" label="ICCU" dense disable color="black" class="q-ml-xs" />
            <q-radio :model-value="item?.rawat_khusus_opt" val="PACU" size="xs" label="PACU" dense disable color="black" class="q-ml-xs" />
            <q-radio :model-value="item?.rawat_khusus_opt" val="Lain-lain" size="xs" label="Lain-lain :" dense disable color="black" class="q-ml-xs" />
            <span class="dotted-val">{{ item?.rawat_khusus_lain || '.........' }}</span><br>
            <q-checkbox :model-value="item?.perawatan_pasca_sedasi === 'APS'" size="xs" label="APS :" dense disable color="black" />
            <span class="dotted-val">{{ item?.aps_ket || '................................................................................' }}</span>
          </div>

          <!-- 10. PERSIAPAN PRA SEDASI -->
          <div class="section-title q-mt-xs">PERSIAPAN PRA SEDASI</div>
          <div class="row py-tight">
            <div class="col-6">Puasa mulai : Jam <span class="dotted-val">{{ item?.puasa_mulai_jam || '................' }}</span> &nbsp;&nbsp;&nbsp;&nbsp; Tanggal : <span class="dotted-val">{{ item?.puasa_mulai_tgl || '................' }}</span></div>
            <div class="col-6">Pre medikasi : Jam <span class="dotted-val">{{ item?.pre_medikasi_jam || '................' }}</span> &nbsp;&nbsp;&nbsp;&nbsp; Tanggal : <span class="dotted-val">{{ item?.pre_medikasi_tgl || '................' }}</span></div>
            <div class="col-6">Mulai sedasi : Jam <span class="dotted-val">{{ item?.mulai_sedasi_jam || '................' }}</span> &nbsp;&nbsp;&nbsp;&nbsp; Tanggal : <span class="dotted-val">{{ item?.mulai_sedasi_tgl || '................' }}</span></div>
          </div>

          <div class="section-title q-mt-xs">CATATAN PERSIAPAN PRA SEDASI :</div>
          <div class="py-tight dotted-text">
            {{ item?.catatan_persiapan_pra_sedasi || '................................................................................................................................................................' }}
          </div>

          <!-- DOKTER ANESTESI SIGNATURE WITH QR CODE (BOTTOM RIGHT) -->
          <div class="row justify-end q-mt-sm">
            <div class="col-5 text-center">
              <div class="text-bold">Dokter Anestesi</div>
              <div class="flex flex-center q-my-xs">
                <div style="width: 48px; height: 48px;">
                  <vue-qrcode
                    v-if="item?.kddokter || item?.kdpegsimrs"
                    :value="qrUrl(item?.kddokter || item?.kdpegsimrs)"
                    tag="svg"
                    :options="{ errorCorrectionLevel: 'Q', color: { dark: '#000000', light: '#ffffff' }, margin: 0 }"
                  />
                  <div v-else class="text-caption text-grey-5">(Belum TTD)</div>
                </div>
              </div>
              <div class="text-bold" style="border-bottom: 1px dotted #000; display: inline-block;">
                ( {{ item?.dokter || '................................' }} )
              </div>
            </div>
          </div>

        </div>
      </q-card-section>

      <!-- FOOTER BUTTONS -->
      <q-card-section class="bg-grey-2 flex justify-end q-py-xs">
        <q-btn label="Tutup" color="dark" flat v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import AppKopSuratStandard from 'src/components/~global/AppKopSuratStandard.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const kajianObj = computed(() => {
  if (typeof props.item?.kajian_sistem === 'string') {
    try { return JSON.parse(props.item.kajian_sistem) } catch (e) { return {} }
  }
  return props.item?.kajian_sistem || {}
})

const labObj = computed(() => {
  if (typeof props.item?.laboratorium === 'string') {
    try { return JSON.parse(props.item.laboratorium) } catch (e) { return {} }
  }
  return props.item?.laboratorium || {}
})

const diagArr = computed(() => {
  if (typeof props.item?.diagnosis === 'string') {
    try { return JSON.parse(props.item.diagnosis) } catch (e) { return [] }
  }
  return props.item?.diagnosis || []
})

const penyulitArr = computed(() => {
  if (typeof props.item?.penyulit_sedasi_lain === 'string') {
    try { return JSON.parse(props.item.penyulit_sedasi_lain) } catch (e) { return [] }
  }
  return props.item?.penyulit_sedasi_lain || []
})

const teknikKhususArr = computed(() => {
  if (typeof props.item?.teknik_khusus === 'string') {
    try { return JSON.parse(props.item.teknik_khusus) } catch (e) { return [] }
  }
  return props.item?.teknik_khusus || []
})

function isTeknikKhusus(val) {
  return Array.isArray(teknikKhususArr.value) && teknikKhususArr.value.includes(val)
}

const qrUrl = (kdpeg) => {
  if (!kdpeg) return ''
  const noreg = props.pasien?.noreg || ''
  const dok = 'ASESMEN PRA SEDASI.png'
  const asal = 'RAWAT INAP'
  const petugas = kdpeg
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
}
</script>

<style lang="scss" scoped>
.pra-sedasi-doc {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10px;
  line-height: 1.25;
  color: #000;

  .table-tight {
    border-collapse: collapse;
    td {
      padding: 1px 0;
      vertical-align: middle;
    }
  }

  .doc-header {
    font-size: 10.5px;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
  }

  .section-title {
    font-weight: bold;
    text-decoration: underline;
    font-size: 10.5px;
    margin-top: 3px;
    margin-bottom: 1px;
  }

  .py-tight {
    padding-top: 1px;
    padding-bottom: 1px;
  }

  .border-bottom-dark {
    border-bottom: 1px solid #000;
  }

  .dotted-val {
    border-bottom: 1px dotted #000;
    padding-left: 2px;
    padding-right: 2px;
  }

  .dotted-text {
    display: inline-block;
    width: 100%;
    border-bottom: 1px dotted #000;
    min-height: 14px;
  }
}
</style>
