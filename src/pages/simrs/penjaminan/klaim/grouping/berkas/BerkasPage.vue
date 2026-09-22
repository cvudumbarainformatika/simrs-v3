<template>
  <div ref="main" class="column flex-center full-height  bg-white">
    <div class="container full-height">
      <div class="column full-height ">
        <div class="col-grow">
          <KumpulanSurat :key="doc" :items="pasien?.kodepoli === 'POL014' ? documents : filterDokumenRajal"
            @go-to="(item) => goTo(item)" />
        </div>
      </div>
    </div>
  </div>
  <app-fullscreen-blue v-model="open">
    <template #default>
      <component :is="cekPanel(pasien?.kodepoli)" :key="props.pasien" :pasien="props.pasien" />
    </template>
  </app-fullscreen-blue>
</template>
<script setup>
import KumpulanSurat from './KumpulanSurat.vue'
import { findWithAttr } from 'src/modules/utils'
import { ref, defineAsyncComponent, computed } from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
  loadingaja: {
    type: Boolean,
    default: false
  },
  ruangranap: {
    type: Object,
    default: null
  },
  depo: {
    type: String,
    default: ''
  },
})

const open = ref(false)
const doc = ref('')
const documents = ref([
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'SEP',
    label: 'Sep',
    value: 'Sep'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Res',
    label: 'Resume',
    value: 'Resume'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Bill',
    label: 'Billing',
    value: 'Billing',
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'DetBill',
    label: 'Detail Billing',
    value: 'Detail Billing'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Trg',
    label: 'Triage IGD',
    value: 'Triage_IGD'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Sutian',
    label: 'Surat Kematian',
    value: 'Surat_Kematian'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Farmasi',
    label: 'Farmasi',
    value: 'Farmasi'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Laborat',
    label: 'Laborat',
    value: 'Laborat'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Radiologi',
    label: 'Radiologi',
    value: 'Radiologi'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'KonsulDokt',
    label: 'Konsultasi Dokter',
    value: 'Konsul_Dokter'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'UploadBerk',
    label: 'Berkas Upload',
    value: 'Berkas_Upload'
  },
])

const documentsrajal = ref([
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'SEP',
    label: 'Sep',
    value: 'Sep'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Res',
    label: 'Resume',
    value: 'Resume'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Bill',
    label: 'Billing',
    value: 'Billing'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'SKS',
    label: 'Surat Ket. Sakit',
    value: 'Sakit'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'SKD',
    label: 'Surat Ket. Dokter',
    value: 'Sehat'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'PRB',
    label: 'Pengantar Rujuk Balik',
    value: 'prb'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'PR RS L',
    label: 'Pengantar Rujuk RS Lain',
    value: 'rslain'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'R P',
    label: 'Rencana Pasien',
    value: 'Rencana'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'RM RJ-1a',
    label: 'Asesmen Awal Keperawatan Rawat Jalan',
    value: 'AsesmenAwalKeperawatan'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'RM RJ-1c',
    label: 'Asesmen Awal Medis Rawat Jalan',
    value: 'AsesmenAwalMedis'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'RM IRJA-2',
    label: 'Catatan Rawat Jalan',
    value: 'Catatan'
  },
  {
    icon: 'icon-mat-email',
    color: 'orange',
    jenis: 'PRA-ANES',
    label: 'Asesmen Pra Anestesia',
    value: 'AsesmenPraAnestesia'
  },
  {
    icon: 'icon-mat-email',
    color: 'orange',
    jenis: 'PRA-BEDAH',
    label: 'Asesmen Pra Bedah',
    value: 'AsesmenPraBedah'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Farmasi',
    label: 'Farmasi / E-Resep',
    value: 'Farmasi'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Laborat',
    label: 'Laborat',
    value: 'Laborat'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'Radiologi',
    label: 'Radiologi',
    value: 'Radiologi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'LapOperasi',
    label: 'Laporan Operasi',
    value: 'LapOperasi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'Skr-Rajal',
    label: 'Skrining Rajal',
    value: 'SkrRajal'
  },
  {
    icon: 'icon-mat-email',
    color: 'green',
    jenis: 'PRMRJ',
    label: 'Profil Ringkasan Medis Rawat Jalan',
    value: 'PRMRJ'
  },
  {
    icon: 'icon-mat-email',
    color: 'green',
    jenis: 'ESWL',
    label: 'Laporan Tindakan ESWL',
    value: 'LaporanEswl'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'SuratKonsul',
    label: 'Surat-Konsul',
    value: 'SuratKonsul'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'Edukasi',
    label: 'Edukasi',
    value: 'Edukasi'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'UploadBerk',
    label: 'Berkas Upload',
    value: 'Berkas_Upload'
  },
  {
    icon: 'icon-fa-file-regular',
    color: 'primary',
    jenis: 'INTR',
    label: 'Pemantauan Itradialitik',
    value: 'Intradialitik'
  },
])

const filterDokumenRajal = computed(() => {
  const kodepoli = props.pasien?.kodepoli
  const flagPrmrj = typeof props.pasien?.prmrjflag === 'object'
    ? props.pasien?.prmrjflag?.flaging
    : props.pasien?.prmrjflag
  let filteredDocuments = documentsrajal.value

  if (flagPrmrj == null || String(flagPrmrj) === '0') {
    filteredDocuments = filteredDocuments.filter(item => item.value !== 'PRMRJ')
  }

  if (kodepoli !== 'POL032' && !props.pasien?.laporaneswl?.length) {
    filteredDocuments = filteredDocuments.filter(item => item.value !== 'LaporanEswl')
  }

  if (kodepoli !== 'POL022' && kodepoli !== 'POL010') {
    return filteredDocuments.filter(item => item.jenis !== 'SKD')
  }

  return filteredDocuments
})

// eslint-disable-next-line no-unused-vars
function getLabel(val) {
  const anu = documents.value.filter(a => a.value === val)
  // console.log('anu ', anu)
  return anu?.length ? anu[0].label : '-'
}
const comp = [
  { nama: 'Sep', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Sep/SepPage.vue')) },
  { nama: 'Resume', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Resume/ResumePage.vue')) },
  { nama: 'Billing', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Billing/BillingPage.vue')) },
  { nama: 'DetailBilling', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Billdetail/BillingDetailPage.vue')) },
  { nama: 'Triage_IGD', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/triage/TriasePage.vue')) },
  { nama: 'Surat_Kematian', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/suratkematian/SuratKematianPage.vue')) },
  { nama: 'Farmasi', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Farmasi/FarmasiPage.vue')) },
  { nama: 'Laborat', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Laborat/LaboratPage.vue')) },
  { nama: 'Radiologi', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Radiologi/RadiologiPage.vue')) },
  { nama: 'Konsul_Dokter', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/konsulDokter/KonsulDokterPage.vue')) },
  { nama: 'Berkas_Upload', page: defineAsyncComponent(() => import('./compdokumen/comIgdupload/DokumenUploadPage.vue')) },
]

const comprajal = [
  { nama: 'Sep', page: defineAsyncComponent(() => import('../../../../poli/dokumen/Sep/SepPage.vue')) },
  { nama: 'SEP', page: defineAsyncComponent(() => import('../../../../poli/dokumen/Sep/SepPage.vue')) },
  { nama: 'Resume', page: defineAsyncComponent(() => import('../../../../dokumen/resume/ResumePage.vue')) },
  { nama: 'Billing', page: defineAsyncComponent(() => import('../../../../dokumen/comppoli/BillingPage.vue')) },
  { nama: 'Sakit', page: defineAsyncComponent(() => import('../../../../dokumen/surat/compsurat/SuratSakitPage.vue')) },
  { nama: 'Sehat', page: defineAsyncComponent(() => import('../../../../dokumen/surat/compsurat/SuratSehatPage.vue')) },
  { nama: 'prb', page: defineAsyncComponent(() => import('../../../../dokumen/pengantar/comppengantar/PengantarRujukBalik.vue')) },
  { nama: 'rslain', page: defineAsyncComponent(() => import('../../../../dokumen/pengantar/comppengantar/PengantarRsLain.vue')) },
  { nama: 'Rencana', page: defineAsyncComponent(() => import('../../../../dokumen/surat/compsurat/SuratRencanaPage.vue')) },
  { nama: 'AsesmenAwalKeperawatan', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/AsesmenAwalMedisRj.vue')) },
  { nama: 'AsesmenAwalMedis', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/PengkajianAwalMedisRJPage.vue')) },
  { nama: 'Catatan', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/CatatanRawatJalanPage.vue')) },
  { nama: 'AsesmenPraAnestesia', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/AsesmenPraAnestesia.vue')) },
  { nama: 'AsesmenPraBedah', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/AssesmentPraBedah.vue')) },
  { nama: 'Laborat', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Laborat/LaboratPage.vue')) },
  { nama: 'Radiologi', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Radiologi/RadiologiPage.vue')) },
  { nama: 'Farmasi', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Farmasi/FarmasiPage.vue')) },
  { nama: 'ERESEP', page: defineAsyncComponent(() => import('../../../../igd/layanan/dokumen/dokumenisi/Farmasi/FarmasiPage.vue')) },
  { nama: 'LapOperasi', page: defineAsyncComponent(() => import('../../../../poli/dokumen/lapoperasi/LapOperasiPage.vue')) },
  { nama: 'SkrRajal', page: defineAsyncComponent(() => import('../../../../dokumen/erm/poli/SkriningRajalPage.vue')) },
  { nama: 'PRMRJ', page: defineAsyncComponent(() => import('../../../../poli/dokumen/Prmrj/PrmrjPage.vue')) },
  { nama: 'LaporanEswl', page: defineAsyncComponent(() => import('../../../../poli/dokumen/eswl/LaporanEswlPage.vue')) },
  { nama: 'SuratKonsul', page: defineAsyncComponent(() => import('../../../../poli/dokumen/SuratKonsul/SuratKonsulPage.vue')) },
  { nama: 'Edukasi', page: defineAsyncComponent(() => import('../../../../poli/dokumen/edukasi/EdukasiPage.vue')) },
  { nama: 'Berkas_Upload', page: defineAsyncComponent(() => import('./compdokumen/comIgdupload/DokumenUploadPage.vue')) },
  { nama: 'Intradialitik', page: defineAsyncComponent(() => import('../../../../hemodialisa/layanan/dokumen/compdokumen/IntradialitikPage.vue')) },
]
// eslint-disable-next-line no-unused-vars
const cekPanel = (kodepoli) => {
  const val = doc.value
  // console.log('val', kodepoli)
  const ganti = val.replace(/ /g, '')

  if (kodepoli === 'POL014') {
    const arr = findWithAttr(comp, 'nama', ganti)
    return arr >= 0 ? comp[arr].page : ''
  } else {
    const arr = findWithAttr(comprajal, 'nama', ganti)
    return arr >= 0 ? comprajal[arr].page : ''
  }

}
function goTo(val) {
  // console.log('got', val)
  doc.value = val.value
  open.value = true
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  width: calc(100vw - 250px);
  min-height: 90vh;
  border-radius: 10px;
  backdrop-filter: blur(5px);
  font-size: 10px;
  // backdrop-filter: sepia(.5);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-right: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}
</style>
