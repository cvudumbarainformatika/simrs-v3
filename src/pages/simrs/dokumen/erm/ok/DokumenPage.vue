<template>
  <div ref="main" class="column flex-center full-height  bg-white">
    <div class="container full-height">
      <div class="column full-height ">
        <div class="col-grow">
          <KumpulanSurat :key="doc" :items="filterDokumen" @go-to="(item) => goTo(item)" />
        </div>
      </div>
    </div>
  </div>
  <app-fullscreen-blue v-model="open">
    <template #default>
      <component :is="cekPanel()" :key="props.pasien" :pasien="props.pasien" :menu="selectedMenu" :data-header="dataHeader" />
    </template>
  </app-fullscreen-blue>
</template>
<script setup>
// import KumpulanSurat from './KumpulanSurat.vue'
import { findWithAttr } from 'src/modules/utils'
import { ref, defineAsyncComponent, computed, onMounted } from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})
const KumpulanSurat = defineAsyncComponent(() => import('src/pages/simrs/dokumen/comppoli/KumpulanSurat.vue'))
const open = ref(false)
const doc = ref('')
const selectedMenu = ref(null)
const dataHeader = ref([
  'PEMERINTAH KOTA PROBOLINGGO',
  'DINAS KESEHATAN, PENGENDALIAN PENDUDUK DAN KELUARGA BERENCANA',
  'RSUD DOKTER MOHAMMAD SALEH',
  'Jalan Mayjend Panjaitan No.65 Telp : (0335) 433119,421118 Fax. (0335) 432705',
  'e-mail : rsudprob@probolinggokota.go.id',
  'PROBOLINGGO 67219'
])
const documents = ref([
  // {
  //   icon: 'icon-fa-file-regular',
  //   color: 'primary',
  //   jenis: 'Res',
  //   label: 'Resume',
  //   value: 'Resume'
  // },
  // {
  //   icon: 'icon-fa-file-regular',
  //   color: 'primary',
  //   jenis: 'Bill',
  //   label: 'Billing',
  //   value: 'Billing'
  // },
  // {
  //   icon: 'icon-fa-file-regular',
  //   color: 'primary',
  //   jenis: 'SKS',
  //   label: 'Surat Ket. Sakit',
  //   value: 'Sakit'
  // },
  // {
  //   icon: 'icon-fa-file-regular',
  //   color: 'primary',
  //   jenis: 'SKD',
  //   label: 'Surat Ket. Dokter',
  //   value: 'Sehat'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'PRB',
  //   label: 'Pengantar Rujuk Balik',
  //   value: 'prb'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'PR RS L',
  //   label: 'Pengantar Rujuk RS Lain',
  //   value: 'rslain'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'R P',
  //   label: 'Rencana Pasien',
  //   value: 'Rencana'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'RM RJ-1a',
  //   label: 'Asesmen Awal Keperawatan Rawat Jalan',
  //   value: 'AsesmenAwalKeperawatan'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'RM RJ-1c',
  //   label: 'Asesmen Awal Medis Rawat Jalan',
  //   value: 'AsesmenAwalMedis'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'RM IRJA-2',
  //   label: 'Catatan Rawat Jalan',
  //   value: 'Catatan'
  // },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'PRA-ANES',
    label: 'Asesmen Pra Anestesia',
    value: 'AsesmenPraAnestesia'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'PRA-BEDAH',
    label: 'Asesmen Pra Bedah',
    value: 'AsesmenPraBedah'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'PRA-IND',
    label: 'Pra Induksi',
    value: 'Prainduksi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'MON-SEL',
    label: 'Monitoring Selama Anestesi',
    value: 'Monitoringselamaanestesi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'MON-PASCA',
    label: 'Monitoring Pasca Anestesi',
    value: 'Monitoringpascaanestesi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'ALDRETE',
    label: 'Skor Aldrete',
    value: 'Skoraldrete'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'LAP-OP',
    label: 'Laporan Operasi',
    value: 'Laporanoperasi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'SURGICAL',
    label: 'Checklist Surgical Safety',
    value: 'SurgicalSafety'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'ASK-PERI',
    label: 'Asuhan Keperawatan Perioperatif',
    value: 'Askepperioperatif'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'ASK-ANES',
    label: 'Asuhan Penata Anestesi',
    value: 'Askepanestesi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'CPPT',
    label: 'Catatan Perkembangan Pasien Terintegrasi (CPPT)',
    value: 'CPPT',
    title: 'CATATAN PERKEMBANGAN PASIEN TERINTEGRASI',
    desc: 'Catatan Perkembangan Pasien Terintegrasi'
  },
  {
    icon: 'icon-mat-email',
    color: 'primary',
    jenis: 'EDUKASI',
    label: 'Edukasi Pasien KIE',
    value: 'EDUKASI',
    title: 'EDUKASI PASIEN',
    desc: 'Edukasi KIE Pasien'
  },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'SEP',
  //   label: 'Surat Elegibilitas Peserta',
  //   value: 'SEP'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'E-Resep',
  //   label: 'E-Resep',
  //   value: 'ERESEP'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'Laborat',
  //   label: 'Laborat',
  //   value: 'Laborat'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'Radiologi',
  //   label: 'Radiologi',
  //   value: 'Radiologi'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'LapOperasi',
  //   label: 'Laporan Operasi',
  //   value: 'LapOperasi'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'SrtKntrl',
  //   label: 'Surat-Kontrol',
  //   value: 'SuratKontrol'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'SrtKnslAnPol',
  //   label: 'Surat-Konsul-Antar-Poli',
  //   value: 'SrtKnslAnPol'
  // },
  // {
  //   icon: 'icon-mat-email',
  //   color: 'primary',
  //   jenis: 'SrtKnslinternal',
  //   label: 'Surat-Konsul-Internal',
  //   value: 'SrtKnslinternal'
  // }
])
// eslint-disable-next-line no-unused-vars
function getLabel (val) {
  const anu = documents.value.filter(a => a.value === val)
  // console.log('anu ', anu)
  return anu?.length ? anu[0].label : '-'
}

const filterDokumen = computed(() => {
  const kodepoli = props.pasien?.kodepoli
  if (kodepoli !== 'POL022' && kodepoli !== 'POL010') {
    return documents.value.filter(a => a.jenis !== 'SKD')
  } else {
    return documents.value
  }
  // return documents.value
})

const comp = [
  { nama: 'Resume', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/resume/ResumePage.vue')) },
  { nama: 'Billing', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/comppoli/BillingPage.vue')) },
  { nama: 'Sakit', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/surat/compsurat/SuratSakitPage.vue')) },
  { nama: 'Sehat', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/surat/compsurat/SuratSehatPage.vue')) },
  { nama: 'Rencana', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/surat/compsurat/SuratRencanaPage.vue')) },
  { nama: 'prb', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/pengantar/comppengantar/PengantarRujukBalik.vue')) },
  { nama: 'rslain', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/pengantar/comppengantar/PengantarRsLain.vue')) },
  { nama: 'AsesmenAwalMedis', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/PengkajianAwalMedisRJPage.vue')) },
  { nama: 'Catatan', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/CatatanRawatJalanPage.vue')) },
  { nama: 'AsesmenAwalKeperawatan', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/AsesmenAwalMedisRj.vue')) },
  { nama: 'AsesmenPraAnestesia', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/AsesmenPraAnestesia.vue')) },
  { nama: 'AsesmenPraBedah', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/poli/AssesmentPraBedah.vue')) },
  { nama: 'SurgicalSafety', page: defineAsyncComponent(() => import('src/pages/simrs/dokumen/erm/ok/comp/DokumenSurgicalSafety.vue')) },
  { nama: 'Askepperioperatif', page: defineAsyncComponent(() => import('./comp/AsuhanKeperawatanPerioperatif.vue')) },
  { nama: 'Askepanestesi', page: defineAsyncComponent(() => import('./comp/AsuhanPenataAnastesi.vue')) },
  { nama: 'Prainduksi', page: defineAsyncComponent(() => import('./comp/PraInduksiDoc.vue')) },
  { nama: 'Monitoringselamaanestesi', page: defineAsyncComponent(() => import('./comp/MonitoringSelamaAnastesiDoc.vue')) },
  { nama: 'Monitoringpascaanestesi', page: defineAsyncComponent(() => import('./comp/MonitoringPascaAnastesiDoc.vue')) },
  { nama: 'Skoraldrete', page: defineAsyncComponent(() => import('./comp/SkorAldreteDoc.vue')) },
  { nama: 'Laporanoperasi', page: defineAsyncComponent(() => import('./comp/LaporanOperasiDoc.vue')) },
  { nama: 'CPPT', page: defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/dokumen/cppt/IndexPage.vue')) },
  { nama: 'EDUKASI', page: defineAsyncComponent(() => import('src/pages/simrs/ranap/layanan/dokumen/edukasi/IndexPage.vue')) },
  { nama: 'SEP', page: defineAsyncComponent(() => import('src/pages/simrs/poli/dokumen/Sep/SepPage.vue')) },
  { nama: 'ERESEP', page: defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/dokumen/dokumenisi/Farmasi/FarmasiPage.vue')) },
  { nama: 'Laborat', page: defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/dokumen/dokumenisi/Laborat/LaboratPage.vue')) },
  { nama: 'Radiologi', page: defineAsyncComponent(() => import('src/pages/simrs/igd/layanan/dokumen/dokumenisi/Radiologi/RadiologiPage.vue')) },
  // { nama: 'SuratKontrol', page: defineAsyncComponent(() => import('src/pages/simrs/poli/dokumen/SuratKontrol/SuratKontrolPage.vue')) },
  { nama: 'LapOperasi', page: defineAsyncComponent(() => import('src/pages/simrs/poli/dokumen/lapoperasi/LapOperasiPage.vue')) },
  // { nama: 'SrtKnslAnPol', page: defineAsyncComponent(() => import('src/pages/simrs/poli/dokumen/SuratKonsulAntarPoli/SuratKonsulAntarPoli.vue')) },
  // { nama: 'SrtKnslinternal', page: defineAsyncComponent(() => import('src/pages/simrs/poli/dokumen/KonsulInternal/SuratKonsulInternalPage.vue')) },
]
// eslint-disable-next-line no-unused-vars
const cekPanel = () => {
  const val = doc.value
  const ganti = val.replace(/ /g, '')
  const arr = findWithAttr(comp, 'nama', ganti)

  return arr >= 0 ? comp[arr].page : ''
}
function goTo (val) {
  // console.log('got', val)
  doc.value = val.value
  selectedMenu.value = val
  open.value = true
}
const filteredDocuments = computed(() =>
  // console.log('sasasa', )
  documents.value.filter(doc => doc.jenis !== 'SKD')
)
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
