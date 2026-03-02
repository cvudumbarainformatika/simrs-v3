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
          <div class="col-4">No Seri Implan</div>
          <div class="col-8">{{ SeriImplant }}</div>
        </div>
        <div v-if="pasien?.implant_seri?.length">
          <q-card v-for="(file, i) in pasien?.implant_seri" :key="i" flat bordered class="q-mb-sm">
            <q-card-section>
              <div style="border: 1px solid grey;" class="q-mb-md">
                <!-- {{ getImg(file?.url) }} -->
                <q-img :src="getImg(file?.url)" :key="file.url" style="height: 170px; max-width: 300px">
                  <div class="absolute-bottom">

                    <div class="row items-center justify-between">
                      <q-btn class="gt-xs" size="md" color="yellow" flat dense round icon="icon-mat-visibility"
                        :href="pathImg + file.url" target="_blank" />

                    </div>
                  </div>
                </q-img>
              </div>
            </q-card-section>
          </q-card>
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
import { pathImg } from 'src/boot/axios'
import { dateFull, dateFullFormat, formatDouble, getNewLine } from 'src/modules/formatter'
import { useLaporanOperasiStore } from 'src/stores/simrs/kamaroperasi/laporanOperasi'
import { computed } from 'vue'


const props = defineProps({
  pasien: {
    type: Object,
    default: null
  },
})
const SeriImplant = computed(() => {
  console.log('implat ', props?.pasien?.implant?.filter(x => !!x.seri), props?.pasien?.implant?.filter(x => !!x.seri)?.map(x => x.seri)?.join(', '))

  return props?.pasien?.implant?.filter(x => !!x.seri)?.length > 0 ? props?.pasien?.implant?.filter(x => !!x.seri)?.map(x => x.seri)?.join(', ') : '-'
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
const getImg = (file) => {
  const spl = file.split('.')
  const ext = spl[spl?.length - 1]
  // console.log(ext)

  if (ext === 'pdf') {
    return new URL('../../../../../../../assets/images/PDF_file_icon.png', import.meta.url).href
  }
  else {
    return pathImg + file
  }
}
</script>
