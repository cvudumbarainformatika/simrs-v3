<template>
  <div class="q-pa-md">
    <div class="q-pt-lg">
      <span class="text-bold"> 1. Anamnesis dan Pemeriksaan Fisik</span>
      <div class="q-pl-sm">
        A. Anamnesis
        <div class="q-pl-md">
          1. Keluhan utama : <span class="text-weight-bold">{{ props?.pasien?.anamnesis[0]?.rs4 }}</span>
        </div>
        <div class="q-pl-md">
          2. Riwayat Penyakit Sekarang : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.riwayatpenyakitsekarang }}</span>
        </div>
        <div class="q-pl-md">
          3. Riwayat Pengobatan : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.riwayatpengobatan }}</span>
        </div>
        <div class="q-pl-md">
          4. Riwayat Pekerjaan yang Berhubungan Dengan Zat Berbahaya : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya }}</span>
        </div>
        <div class="q-pl-md">
          5. Riwayat Penyakit Keluarga : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.riwayatpenyakitkeluarga }}</span>
        </div>
        <div class="q-pl-md">
          6. Riwayat Alergi : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.riwayatalergi ?? '-' }}</span>
        </div>
        <div class="q-pl-md">
          7. Reaksi Berupa : <span class="text-weight-bold"> {{
            props?.pasien?.anamnesis[0]?.keteranganalergi ?? '-' }}</span>
        </div>
      </div>
      <div class="q-pl-sm q-mt-md">
        B. Pemeriksaan Umum
        <div class="q-pl-md q-mb-md">
          Kesadaran/GCS :
        </div>
        <div class="q-pl-md row q-gutter-md">
          <div class="col-3 q-pl-md">
            TD : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.sistole ?? '-' }} / {{
              props?.pasien?.triage[0]?.diastole ?? '-' }} mmHg</span>
          </div>
          <div class="col-3 q-pl-md">
            Nadi : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.nadi ?? '-' }} x/mnt</span>
          </div>
          <div class="col-3 q-pl-md">
            RR : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.pernapasanx ?? '-' }} x/mnt</span>
          </div>
        </div>
        <div class="q-pl-md row q-gutter-md">
          <div class="col-3 q-pl-md">
            Spo2 : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.spo2 ?? '-' }} %</span>
          </div>
          <div class="col-3 q-pl-md">
            BB : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.bb ?? '-' }} kg</span>
          </div>
          <div class="col-3 q-pl-md">
            TB : <span class="text-weight-bold"> {{ props?.pasien?.triage[0]?.tinggibadan ?? '-' }} cm</span>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pt-lg">
      <span class="text-bold">2. Pemeriksaan Fisik</span>
      <div class="q-pl-sm q-mt-md">
        <div class="q-pl-md">
          1. Kepala : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs5 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          2. Leher : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs6 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          3. Dada : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs7 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          4. Punggung : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs8 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          5. Perut : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs9 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          6. Tangan : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs10 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          7. Kaki : <span class="text-weight-bold"> {{ props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs11 ?? '-'
            }}</span>
        </div>
        <div class="q-pl-md">
          8. Status Neurologis : <span class="text-weight-bold"> {{
            props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs12 ?? '-' }}</span>
        </div>
        <div class="q-pl-md">
          9. Genital : <span class="text-weight-bold"> {{
            props?.pasien?.pemeriksaanfisikpsikologidll[0]?.rs13 ?? '-' }}</span>
        </div>
      </div>
      <div class=" q-mt-md">
        <span class="text-bold">3. Pemeriksaan Penunjang</span>
        <div class="q-pl-md q-mt-md">
          1. Laboratorium :
          <div class="q-pl-lg q-gutter-xs row">
            <div v-for="(lab, l) in props?.pasien?.laboratold" :key="l">
              <q-badge outline color="black">{{ lab?.pemeriksaanlab?.rs2 }} = {{ lab?.rs21 ?? '-' }}</q-badge>
            </div>
          </div>
        </div>

        <div class="q-pl-md q-mt-sm">
          2. Radiologi :
          <div class="q-pl-lg q-gutter-xs row">
            <div v-for="(radiologi, l) in props?.pasien?.hasilradiologi" :key="l">
              <q-badge outline color="black">{{ radiologi?.haradio?.rs3 ?? '-' }}</q-badge>
            </div>
          </div>
        </div>
      </div>
      <div class=" q-mt-md">
        <span class="text-bold">4. Diagnosa Medis</span>
        <div class="q-pl-lg q-gutter-xs row q-mt-sm">
          <div v-for="(diagnosa, l) in props?.pasien?.diagnosa" :key="l">
            {{ diagnosa?.masterdiagnosa?.rs4 ?? '-' }} ({{ diagnosa?.rs3 }}),
          </div>
        </div>
      </div>
      <div class=" q-mt-md">
        <span class="text-bold">5. Rencana Terapi</span>
        <div class="q-pl-lg q-gutter-xs row q-mt-sm">

        </div>
      </div>
      <div class=" q-mt-md">
        <span class="text-bold">6. Konsultasi Dokter</span>
        <div class="q-pl-lg q-gutter-xs row q-mt-sm">
          <div v-for="(konsul, l) in props?.pasien?.konsultasi" :key="l">
            Konsulan : <span class="text-bold"> {{ konsul?.permintaan }}</span><br>
            Jawaban : <span class="text-bold">{{ konsul?.jawaban }}</span><br>
          </div>
        </div>
      </div>
      <div class=" q-mt-md">
        <span class="text-bold">7. Tindak Lanjut</span>
        <div v-if="props?.pasien?.planheder[0]?.rs4 === 'Rawat Inap'" class="q-pl-lg q-gutter-xs row q-mt-sm">
          <div class="col-12">
            Tindak Lanjut : <span class="text-weight-bold"> {{ props?.pasien?.planheder[0]?.rs4 ?? '-' }}</span>
          </div>
          <div class="col-12">
            Dirawat di Ruang : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planranap?.ruangranap?.rs2
              ?? '-' }}</span>
          </div>
          <div class="col">
            Operasi : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planranap?.operasi
              ?? '-' }}</span>
          </div>
          <div class="col">
            Jenis Operasi : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planranap?.jenisoperasi
              ?? '-' }}</span>
          </div>
        </div>
        <div v-else-if="props?.pasien?.planheder[0]?.rs4 === 'Pulang'" class="q-pl-lg q-gutter-xs row q-mt-sm">
          <div v-if="props?.pasien?.planheder[0]?.atas_dasar === 'Sembuh'">
            <div class="col-12">
              Tindak Lanjut : <span class="text-weight-bold"> {{ props?.pasien?.planheder[0]?.rs4 ?? '-' }}</span>
            </div>
            <div class="col-12">
              Kondisi : <span class="text-weight-bold"> {{
                props?.pasien?.planheder[0]?.planpulang?.atas_dasar
                ?? '-' }}</span>
            </div>
          </div>
          <div v-else>
            <div class="col-12">
              Tindak Lanjut : <span class="text-weight-bold"> {{ props?.pasien?.planheder[0]?.rs4 ?? '-' }}</span>
            </div>
            <div class="col-12">
              Kondisi : <span class="text-weight-bold"> {{
                props?.pasien?.planheder[0]?.planpulang?.atas_dasar
                ?? '-' }}</span>
            </div>
            <div class="col-12">
              Penyebab Meninggal : <span class="text-weight-bold"> {{
                props?.pasien?.planheder[0]?.planpulang?.alasan_meninggal
                ?? '-' }}</span>
            </div>
            <div class="col-12">
              Tanggal Meninggal : <span class="text-weight-bold"> {{
                props?.pasien?.planheder[0]?.planpulang?.tgl_meninggal
                ?? '-' }}</span>
            </div>
            <div class="col-12">
              Jam Meninggal : <span class="text-weight-bold"> {{
                props?.pasien?.planheder[0]?.planpulang?.jam_meninggal
                ?? '-' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="q-pl-lg q-gutter-xs row q-mt-sm">
          <div class="col-12">
            Tindak Lanjut : <span class="text-weight-bold"> {{ props?.pasien?.planheder[0]?.rs4 }}</span>
          </div>
          <div class="col-12">
            Alasan Di rujuk : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.atas_dasar }}</span>
          </div>
          <div class="col-12">
            Jenis Pelayanan : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.jenis_pelayanan }}</span>
          </div>
          <div class="col-12">
            Tanggal Rujukan : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.tgl_rujukan }}</span>
          </div>
          <div class="col-12">
            Tanggal Rencana Kunjungan : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.tgl_rencana_kunjungan }}</span>
          </div>
          <div class="col-12">
            Type Faskes : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.type_faskes }}</span>
          </div>
          <div class="col-12">
            Dirujuk Ke : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.di_rujuk_ke }}</span>
          </div>
          <div class="col-12">
            Poli : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.poli_rujukan ?? '-' }}</span>
          </div>
          <div class="col-12">
            Keterangan : <span class="text-weight-bold"> {{
              props?.pasien?.planheder[0]?.planrujukan?.keterangan ?? '-' }}</span>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-md" />
      <div class="row items-center no-wrap q-mt-xl ">
        <div class="col-6 text-center " />
        <div class="col-6 text-weight-bold text-center">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
      </div>
      <div class="row items-center no-wrap">
        <div class="col-6 text-center text-weight-bold">Pasien/Keluarga </div>
        <div class="col-6 text-weight-bold text-center">
          Dokter
        </div>
      </div>
      <div class="row items-center no-wrap">
        <div class="col-6 text-right" />
        <div class="col-6 text-weight-bold text-center">
          <div class="column flex-center">
            <div style="width: 100px;">
              <vue-qrcode :value="qrUrl" tag="svg" :options="{
                errorCorrectionLevel: 'Q',
                color: {
                  dark: '#000000',
                  light: '#ffffff',
                },
                margin: 0
              }" />
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center no-wrap q-mt-lg">
        <div class="col-6 text-center">(..........................)</div>
        <div class="col-6 text-weight-bold text-center">
          {{ pasien.dokter }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { date } from 'quasar'
import { computed } from 'vue'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Reseume-Medis.png'
  const asal = 'IGD'
  const enc = btoa(`${noreg}|${dok}|${asal}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
</script>
