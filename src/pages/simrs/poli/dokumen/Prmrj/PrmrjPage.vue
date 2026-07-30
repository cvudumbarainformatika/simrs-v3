<template>
  <div class="prmrj-page column full-height">
    <div class="page-toolbar row items-center q-px-md q-py-sm">
      <div class="col">
        <div class="text-subtitle1 text-weight-bold">
          {{ props.judul || 'Riwayat Medis Pasien' }}
        </div>
        <div class="text-caption text-blue-grey-2">
          Patient Medical Record Journey
        </div>
      </div>
      <div class="row q-gutter-xs">
        <q-btn flat round icon="icon-mat-download" :disable="!store.itemsprmrj.length" @click="exportPdf">
          <q-tooltip>Unduh PDF</q-tooltip>
        </q-btn>
        <q-btn v-print="printObj" flat round icon="icon-mat-print" :disable="!store.itemsprmrj.length">
          <q-tooltip>Cetak</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div v-if="store.loadingprmrjdokumen" class="col flex flex-center bg-grey-2">
      <div class="column items-center q-gutter-md">
        <q-spinner-tail color="teal" size="48px" />
        <div class="text-subtitle2 text-blue-grey-7">
          Menyiapkan riwayat medis pasien...
        </div>
      </div>
    </div>

    <div v-else-if="!store.itemsprmrj.length" class="col flex flex-center bg-grey-2">
      <div class="empty-state column items-center text-center">
        <q-icon name="icon-mat-folder_off" color="blue-grey-3" size="64px" />
        <div class="text-h6 text-weight-bold text-blue-grey-8 q-mt-md">
          Riwayat belum tersedia
        </div>
        <div class="text-body2 text-blue-grey-5 q-mt-xs">
          Tidak ditemukan data PRMRJ untuk pasien ini.
        </div>
      </div>
    </div>

    <q-scroll-area v-else class="col bg-grey-2">
      <div id="printPrmrj" class="document-wrap">
        <IsiPrmrjPage :pasien="props.pasien" :items="store.itemsprmrj" />
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import html2pdf from 'html2pdf.js'
import { watch } from 'vue'
import { usePengunjungPoliStore } from 'src/stores/simrs/pelayanan/poli/pengunjung'
import IsiPrmrjPage from './IsiPrmrjPage.vue'

const store = usePengunjungPoliStore()
const props = defineProps({
  judul: {
    type: String,
    default: null
  },
  pasien: {
    type: Object,
    default: null
  }
})

const printObj = {
  id: 'prmrjDocument',
  popTitle: 'Riwayat Medis Pasien'
}

async function exportPdf() {
  const content = document.getElementById('prmrjDocument')
  if (!content) return

  const nama = props.pasien?.nama ?? props.pasien?.pasien ?? 'Pasien'
  const config = {
    margin: [14, 4, 10, 4],
    filename: `PRMRJ_${props.pasien?.norm ?? '-'}_${nama}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: false,
      useCORS: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      avoid: ['tr', '.visit-table-group']
    }
  }

  content.classList.add('pdf-export')

  try {
    const worker = html2pdf().set(config).from(content).toPdf()
    const pdf = await worker.get('pdf')
    const totalPages = pdf.internal.getNumberOfPages()

    for (let page = 1; page <= totalPages; page++) {
      pdf.setPage(page)
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const frameTop = page === 1 ? 14 : 4

      pdf.setDrawColor(0, 0, 0)
      pdf.setLineWidth(0.53)
      pdf.rect(4, frameTop, pageWidth - 8, pageHeight - frameTop - 4)

      if (page > 1) {
        pdf.setLineWidth(0.26)
        pdf.line(8, 14, pageWidth - 8, 14)
      }
    }

    await worker.save()
  } finally {
    content.classList.remove('pdf-export')
  }
}

watch(
  () => props.pasien?.norm,
  norm => {
    if (norm) store.dokumenprmrj(props.pasien)
    else store.itemsprmrj = []
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.prmrj-page {
  min-height: 560px;
  background: #eef3f7;
}

.page-toolbar {
  color: white;
  background: linear-gradient(135deg, #075985 0%, #0f766e 100%);
  box-shadow: 0 4px 18px rgba(15, 118, 110, 0.2);
  z-index: 2;
}

.document-wrap {
  width: min(1120px, calc(100% - 32px));
  margin: 24px auto 40px;
}

.empty-state {
  max-width: 360px;
  padding: 40px;
}

@media print {
  .document-wrap {
    width: 100%;
    margin: 0;
  }
}
</style>
