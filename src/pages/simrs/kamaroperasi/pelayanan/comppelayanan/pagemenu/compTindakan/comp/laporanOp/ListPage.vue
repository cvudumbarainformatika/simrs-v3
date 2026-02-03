<template>
  <div class="bg-white full-height column scroll q-pb-xl">

    <div class="col-auto bg-teal text-white">
      <div class="q-pa-sm">
        Laporan Operasi tersimpan
      </div>
    </div>
    <div class="col full-height relative-position">
      <!-- lap: {{ pasien?.laporanop }} -->
      <div v-if="!!pasien?.laporanop" class="cursor-pointer" @click="assignForm(pasien?.laporanop)">
        <div class="row items-center q-my-xs">
          <div class="col-4">Tanggal</div>
          <div class="col-8">{{ dateFullFormat(pasien?.laporanop?.rs3) }}</div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-4">Dokter Operator </div>
          <div class="col-8">{{ surgical?.dr_operator?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Dokter Anastesi </div>
          <div class="col-8">{{ surgical?.dr_anastesi?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Penata Anastesi </div>
          <div class="col-8">{{ surgical?.pen_anastesi?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Perawat Instrumen </div>
          <div class="col-8">{{ surgical?.per_instrumen?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Perawat Sirkuler </div>
          <div class="col-8">{{ surgical?.per_sirkuler?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Asisten 1 </div>
          <div class="col-8">{{ surgical?.ass1?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Asisten 2 </div>
          <div class="col-8">{{ surgical?.ass2?.nama ?? 'Belum diisi di Surgical Safety' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Jenis Anastesi</div>
          <div class="col-8">{{ pasien?.laporanop?.rs4 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Diagnosa Pre-Operatif</div>
          <div class="col-8" v-html="getNewLine(pasien?.laporanop?.rs5)" />
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Diagnosa Post-Operatif</div>
          <div class="col-8" v-html="getNewLine(pasien?.laporanop?.rs6)" />
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Tindakan Operasi</div>
          <div class="col-8">{{ pasien?.tindakanop?.mastertindakanoperasi?.rs2 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Jenis Operasi</div>
          <div class="col-8">{{ pasien?.laporanop?.rs7 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Klasifikasi Operasi</div>
          <div class="col-8">{{ pasien?.laporanop?.rs8 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Dikirim Untuk Pemeriksaan PA</div>
          <div class="col-8">{{ pasien?.laporanop?.rs9 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Tanggal Operasi</div>
          <div class="col-8">{{ dateFullFormat(pasien?.laporanop?.rs10) ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Jam Mulai</div>
          <div class="col-8">{{ pasien?.laporanop?.rs11 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Jam Selesai</div>
          <div class="col-8">{{ pasien?.laporanop?.rs12 ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Lama Operasi</div>
          <div class="col-8">{{ lamaOperasi(pasien?.laporanop) ?? '-' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Nomor Seri Implan</div>
          <div class="col-8">{{ 'belum dibuat' }}</div>
        </div>
        <div class="row items-center q-my-xs">
          <div class="col-4">Catatan Komplikasi</div>
          <div class="col-8" v-html="getNewLine(pasien?.laporanop?.rs13)" />
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-4">Jumlah Kehilangan darah</div>
          <div class="col-8">{{ pasien?.laporanop?.jd_keluar ?? '-' }}</div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-4">Jenis / Jumlah Darah Yang Masuk</div>
          <div class="col-8">{{ (pasien?.laporanop?.jenis_darah_masuk ?? '-') + ' / ' + pasien?.laporanop?.jd_masuk ??
            '-' }}
          </div>
        </div>

        <div class="row items-center q-my-xs">
          <div class="col-4">Laporan Operasi</div>
          <div class="col-8" v-html="getNewLine(pasien?.laporanop?.rs14)" />
        </div>

        <div class="row q-mx-xl justify-end">
          <q-btn icon="delete" flat dense color="negative" :loading="store.loading" :disable="store.loading"
            @click="store.hapusLaporan(pasien?.laporanop)" />
        </div>

      </div>
      <div v-else> <app-no-data-small /></div>
      <!-- {{ pasien?.tindakanop }} -->
    </div>
  </div>
</template>
<script setup>
import { dateFull, dateFullFormat, formatDouble, getNewLine } from 'src/modules/formatter'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})

const surgical = props?.pasien?.surgical?.find(x => x.nota === props.pasien.rs2)
function lamaOperasi (data) {
  const awal = data?.rs11
  const akhir = data?.rs12
  const [jm, mm] = awal.split(':').map(Number)
  const [js, ms] = akhir.split(':').map(Number)
  const mulai = jm * 60 + mm
  let selesai = js * 60 + ms

  if (selesai < mulai) {
    selesai += 24 * 60
  }

  const diffMenit = selesai - mulai

  const jam = Math.floor(diffMenit / 60)
  const menit = diffMenit % 60

  return `${jam} jam ${menit} menit`
}
const store = useLaporanOperasiStore()
function assignForm (data) {
  store.assignForm(data)
}
</script>
