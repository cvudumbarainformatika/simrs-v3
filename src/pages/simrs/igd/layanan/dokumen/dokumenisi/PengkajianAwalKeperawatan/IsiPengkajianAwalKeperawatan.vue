<template>
  <div class="q-pa-md">
    <div class="q-pt-lg">
      <div class="row q-pl-xs items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">1. Diperiksa</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ tanggalPengkajian }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">2. Pemeriksaan Umum </div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ keluhan }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">3. Riwayat Penyakit Lalu</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ riwayatPenyakitLalu }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">4. Riwayat Penyakit Keluarga</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ riwayatPenyakitKeluarga }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">5. Ketergantungan Terhadap zat tertentu</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ ketergantunganZat }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">6. Riwayat Pekerjaan (Zat Berbahaya)</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ riwayatPekerjaan }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">7. Riwayat Alergi</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ riwayatAlergi }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">8. Tanda-tanda Vital</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ tandaVital }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">9. Pemeriksaaan Fisik</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ pemeriksaanFisik }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">10. Nyeri</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ nyeri }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">11. Resiko Pasien Jatuh</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ resikoJatuh }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">12. Data Psikologi Ekonomi dan Spiritual
        </div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ dataPsikologi }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">13. STATUS FUNGSIONAL</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ statusFungsional }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">14. KEBUTUHAN KOMUNIKASI DAN EDUKASI</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ kebutuhanEdukasi }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">15. SKRINING GIZI</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ skriningGizi }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">16. DIAGNOSA KEPERAWATAN</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ diagnosaKeperawatan }}</div>
      </div>
      <q-separator class="q-mt-md" />
      <div class="row items-center no-wrap q-mt-xl q-pt-md">
        <div class="col-6 text-center " />
        <div class="col-6 text-weight-bold text-center">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
      </div>
      <div class="row items-center no-wrap">
        <div class="col-6 text-center text-weight-bold">Pasien/Keluarga </div>
        <div class="col-6 text-weight-bold text-center">
          Perawat
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
      <div class="row items-center no-wrap q-mt-xl q-pt-xl q-pb-xl q-mb-xl">
        <div class="col-6 text-center">(..........................)</div>
        <div class="col-6 text-weight-bold text-center">
          (..........................)
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


const filtered = computed(() => {
  return props?.pasien?.anamnesis?.find(i => i?.datasimpeg?.kdgroupnakes === "2")
})



// ambil data pertama (biar gak ribet di template)
const tanggalPengkajian = computed(() => {
  return filtered.value?.rs3
})

const keluhan = computed(() => {
  return filtered.value?.riwayatpenyakitsekarang
})

const riwayatPenyakitLalu = computed(() => filtered.value?.riwayatpenyakitdahulu || filtered.value?.riwayatpengobatan || '-')
const riwayatPenyakitKeluarga = computed(() => filtered.value?.riwayatpenyakitkeluarga || '-')
const ketergantunganZat = computed(() => filtered.value?.ketergantunganzat || '-')
const riwayatPekerjaan = computed(() => filtered.value?.riwayat_pekerjaan_yang_berhubungan_dengan_zat_berbahaya || '-')
const riwayatAlergi = computed(() => filtered.value?.riwayatalergi ? (filtered.value.riwayatalergi + ' - ' + (filtered.value.keteranganalergi || '')) : '-')
const tandaVital = computed(() => {
  const t = props?.pasien?.triage?.[0]
  if (!t) return '-'
  return `TD: ${t.sistole ?? '-'}/${t.diastole ?? '-'} mmHg, || Nadi: ${t.nadi ?? '-'} x/mnt, || RR: ${t.pernapasanx ?? '-'} x/mnt, || SpO2: ${t.spo2 ?? '-'} %, || Suhu: ${t.suhu ?? '-'} 'C`
})
const pemeriksaanFisik = computed(() => {
  const pf = props?.pasien?.pemeriksaanfisikpsikologidll?.[0] || props?.pasien?.pemeriksaanfisik?.[0]
  if (!pf) return '-'
  return `Kepala: ${pf.rs5 ?? '-'}, Leher: ${pf.rs6 ?? '-'}, Dada: ${pf.rs7 ?? '-'}, Punggung: ${pf.rs8 ?? '-'}, Perut: ${pf.rs9 ?? '-'}, Tangan: ${pf.rs10 ?? '-'}, Kaki: ${pf.rs11 ?? '-'}, Status Neurologis: ${pf.rs12 ?? '-'}, Genital: ${pf.rs13 ?? '-'}`
})
const nyeri = computed(() => '-')
const resikoJatuh = computed(() => '-')
const dataPsikologi = computed(() => {
  const psi = props?.pasien?.pemeriksaanfisikpsikologidll?.[0]?.pemerisaanpsikologidll
  if (!psi) return '-'
  return `Psikologis: ${psi.status_psikologis_lain ?? psi.status_psikologis ?? '-'} || Sosial: ${psi.sosial ?? '-'} || Ekonomi: ${psi.ekonomi ?? '-'} || Spiritual: ${psi.spiritual ?? '-'} || Kepercayaan: ${psi.nilai_kepercayaan ?? '-'} ${psi.ket_nilaikepercayaan ?? '-'}`
})
const statusFungsional = computed(() => '-')
const kebutuhanEdukasi = computed(() => '-')
const skriningGizi = computed(() => '-')
const diagnosaKeperawatan = computed(() => {
  const diagnosa = props?.pasien?.diagnosakeperawatan
  if (!diagnosa || !diagnosa.length) return '-'
  return diagnosa.map(item => `${item.kode ?? ''} - ${item.nama ?? ''}`).join(' || ')
})

// hasilnya tinggal kamu pakai
console.log('filtered', props?.pasien?.anamnesis?.find(i => i?.datasimpeg?.kdgroupnakes === "2"))

const qrUrl = computed(() => {
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Reseume-Medis.png'
  const asal = 'IGD'
  const enc = btoa(`${noreg}| ${dok}| ${asal} `)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})
</script>
