<template>
  <div class="column full-height" style="overflow: hidden;">
    <q-bar dense class="bg-teal text-white col-auto">
      <div class="f-12 text-bold">RIWAYAT LAPORAN ESWL PASIEN</div>
    </q-bar>
    <q-scroll-area class="col q-pa-sm">
      <q-list separator class="bg-white rounded-borders shadow-1">
        <q-item v-for="item in props.lists" :key="item.id" class="q-py-md">
          <q-item-section>
            <!-- Header Info: Tanggal & Sesi -->
            <div class="row justify-between items-center q-mb-xs">
              <div class="text-bold text-subtitle2 text-primary">
                Tindakan Tanggal: {{ date.formatDate(item.tanggal, 'DD MMMM YYYY') }}
              </div>
              <q-badge color="purple" :label="`Sesi ke-${item.sesi || '-'}`" />
            </div>

            <!-- Doctor & Assistant Info -->
            <div class="text-caption text-grey-8">
              <strong>Operator:</strong> {{ getNamaDokter(item.kddokter) }}
            </div>
            <div v-if="item.asisten" class="text-caption text-grey-8">
              <strong>Asisten:</strong> {{ getNamaAsisten(item.asisten) }}
            </div>

            <q-separator class="q-my-sm" />

            <!-- Time & General Info -->
            <div class="row q-col-gutter-x-md text-caption text-grey-7 q-mb-xs">
              <div><strong>Waktu:</strong> {{ item.waktu_mulai || '-' }} - {{ item.waktu_selesai || '-' }} ({{ item.lama_penembakan || 0 }} menit)</div>
              <div><strong>BB / TB:</strong> {{ item.berat_badan || vitalFisik?.beratbadan || '-' }} kg / {{ item.tinggi_badan || vitalFisik?.tinggibadan || '-' }} cm</div>
            </div>
            <div class="row q-col-gutter-x-sm text-caption text-grey-8 q-mb-xs bg-grey-2 q-pa-xs rounded-borders">
              <div class="col-auto"><strong>TD:</strong> {{ item.td_sistol || vitalFisik?.sistole || '-' }}/{{ item.td_diastol || vitalFisik?.diastole || '-' }} mmHg</div>
              <div class="col-auto">| <strong>Nadi:</strong> {{ item.nadi || vitalFisik?.rs4 || vitalFisik?.denyutjantung || '-' }} x/m</div>
              <div class="col-auto">| <strong>RR:</strong> {{ vitalFisik?.pernapasan || '-' }} x/m</div>
              <div class="col-auto">| <strong>Suhu:</strong> {{ vitalFisik?.suhutubuh || '-' }} &deg;C</div>
            </div>

            <!-- Stones details -->
            <div v-if="item.batu_detail && item.batu_detail.length" class="text-caption text-grey-8 bg-grey-1 q-pa-sm rounded-borders q-mt-xs">
              <div class="text-bold">Spesifikasi Batu:</div>
              <div v-for="(batu, idx) in item.batu_detail" :key="idx">
                <span v-if="batu.posisi || batu.ukuran_x">
                  Batu {{ idx + 1 }}: {{ batu.posisi || '-' }} ({{ batu.ukuran_x || '-' }} x {{ batu.ukuran_y || '-' }} mm)
                </span>
              </div>
            </div>

            <!-- Shockwave details -->
            <div v-if="item.penembakan_detail && item.penembakan_detail.length" class="text-caption text-grey-8 bg-indigo-5 q-pa-sm rounded-borders q-mt-xs text-white">
              <div class="text-bold">Parameter Penembakan ({{ item.sinkronisasi }}):</div>
              <div v-for="(sh, idx) in item.penembakan_detail" :key="idx">
                <span v-if="sh.tembakan || sh.power">
                  Batu {{ idx + 1 }}: {{ sh.tembakan || 0 }} tembakan | Power: {{ sh.power || '-' }} kV | Energi: {{ sh.energi || '-' }} Hz
                </span>
              </div>
            </div>

            <!-- USG / Rontgen Monitors -->
            <div class="row q-col-gutter-x-sm q-mt-xs text-caption text-grey-8">
              <div class="col-6"><strong>Monitor USG:</strong> {{ item.monitor_usg || '-' }}</div>
              <div class="col-6"><strong>Monitor Rontgen:</strong> {{ item.monitor_rontgen || '-' }}</div>
            </div>

            <!-- Drugs info -->
            <div class="row q-col-gutter-x-sm q-mt-xs text-caption text-grey-8">
              <div class="col-4"><strong>Pre-med:</strong> {{ item.obat_pre || '-' }}</div>
              <div class="col-4"><strong>Durante:</strong> {{ item.obat_durante || '-' }}</div>
              <div class="col-4"><strong>Post-med:</strong> {{ item.obat_post || '-' }}</div>
            </div>

            <!-- Canvas/Drawing Preview -->
            <div v-if="item.alternatif" class="q-mt-sm flex flex-center bg-grey-2 q-pa-sm rounded-borders">
              <div class="relative-position bg-white shadow-1" style="width: 100%; max-width: 250px; overflow: hidden;">
                <!-- Background Image (Urinary tract diagram) -->
                <img :src="bodyMarkerImg" style="display: block; width: 100%; height: auto; pointer-events: none;" />
                <!-- Canvas Drawing Overlay -->
                <img :src="item.alternatif" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;" />
              </div>
            </div>

            <!-- Evaluation Notes -->
            <div v-if="item.keterangan" class="text-caption text-grey-8 q-mt-sm">
              <strong>Keterangan/Evaluasi:</strong> {{ item.keterangan }}
            </div>
          </q-item-section>

          <!-- Edit & Delete Buttons -->
          <q-item-section side top class="q-pl-md">
            <div class="column q-gutter-y-sm">
              <q-btn
                round
                dense
                color="orange"
                icon="icon-mat-edit"
                size="sm"
                @click="store.editData(item)"
              >
                <q-tooltip>Edit Laporan</q-tooltip>
              </q-btn>
              <q-btn
                round
                dense
                color="negative"
                icon="icon-mat-delete"
                size="sm"
                :loading="store.loadingDelete"
                @click="confirmDelete(item.id)"
              >
                <q-tooltip>Hapus Laporan</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { date, useQuasar } from 'quasar'
import { useLaporanEswlPoliStore } from 'src/stores/simrs/pelayanan/poli/laporanEswl'
import bodyMarkerImg from 'src/assets/human/anatomys/body-marker-eswl.webp'

const $q = useQuasar()
const store = useLaporanEswlPoliStore()

const props = defineProps({
  lists: {
    type: Array,
    default: () => []
  },
  listdokter: {
    type: Array,
    default: () => []
  },
  listperawat: {
    type: Array,
    default: () => []
  },
  pasien: {
    type: Object,
    default: null
  }
})

const vitalFisik = computed(() => {
  const list = props.pasien?.pemeriksaanfisik
  if (Array.isArray(list) && list.length > 0) {
    return list[list.length - 1] || list[0]
  }
  return list || {}
})

function getNamaDokter(kddokter) {
  const found = props.listdokter.find(x => x.kode === kddokter)
  return found ? found.nama : kddokter
}

function getNamaAsisten(asisten) {
  const found = props.listperawat.find(x => x.kode === asisten)
  return found ? found.nama : asisten
}

function confirmDelete(id) {
  $q.dialog({
    dark: true,
    title: 'Konfirmasi',
    message: 'Apakah Anda yakin ingin menghapus Laporan ESWL ini?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.hapusData(props.pasien, id)
  })
}
</script>
