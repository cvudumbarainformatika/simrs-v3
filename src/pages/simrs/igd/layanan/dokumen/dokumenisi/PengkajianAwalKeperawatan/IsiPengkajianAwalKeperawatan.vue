<template>
  <div class="b q-pa-md">
    <div class="q-pt-lg">
      <div class="row q-pl-xs items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">1. Diperiksa</div>
        <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
        <div class="col"> {{ tanggalPengkajian }}</div>
      </div>
      <div class="row q-pl-xs q-mt-md items-start">
        <div class="text-weight-bold text-uppercase" style="width: 300px;">2. Keluhan Utama </div>
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
        <div class="text-weight-bold text-uppercase" style="width: 300px;">
          10. Nyeri
        </div>

        <div class="text-weight-bold text-uppercase" style="width: 10px;">
          :
        </div>

        <div class="col">

          <!-- HEADER (icon + skor) -->
          <div class="row items-center q-gutter-xs q-mb-sm">
            <q-icon v-if="nyeri.skor !== null" size="xs" color="teal" :name="iconNyeri(nyeri.skor)" />
            <span class="text-weight-medium">{{ nyeri.text }}</span>
            <em v-if="nyeri.ket" class="text-primary">
              ({{ nyeri.ket }})
            </em>
          </div>

          <!-- GRID 2 KOLOM -->
          <div class="row q-col-gutter-md">

            <div class="col-6">
              <div><b>Lokasi</b> : {{ nyeri.lokasi }}</div>
              <div><b>Durasi</b> : {{ nyeri.durasi }}</div>
              <div><b>Frekuensi</b> : {{ nyeri.frekuensi }}</div>
            </div>

            <div class="col-6">
              <div><b>Nyeri Hilang</b> : {{ nyeri.hilang }}</div>
              <div><b>Penyebab</b> : {{ nyeri.penyebab }}</div>
            </div>

          </div>

        </div>
      </div>
    </div>
    <div class="row q-pl-xs q-mt-md items-start">
      <div class="text-weight-bold text-uppercase" style="width: 300px;">
        11. Resiko Pasien Jatuh
      </div>

      <div class="text-weight-bold text-uppercase" style="width: 10px;">:</div>

      <div class="col" v-if="resikoJatuh">
        <div class="row items-center q-pb-xs full-width">
          <div class="col">i. Perhatikan cara berjalan pasien saat akan duduk di kursi. Apakah pasien tampak tidak
            seimbang (sempoyongan)?
            <span> {{ resikoJatuh?.sempoyongan === '' ? '-' : resikoJatuh?.sempoyongan }}</span>
          </div>
        </div>
        <div class="row items-center q-pb-xs full-width">
          <div class="col">ii. Apakah pasien memegang pinggiran kursi atau meja atau benda lain sebagai penopang saat
            akan duduk?
            <span> {{ resikoJatuh?.penopangx === '' ? '-' : resikoJatuh?.penopangx }}</span>
          </div>
        </div>
        <div class="row items-center q-pb-xs full-width">
          <div class="col">iii. Gelisah :
            <span> {{ resikoJatuh?.gelisah === '' ? '-' : resikoJatuh?.gelisah }}</span>
          </div>
        </div>
        <div class="row items-center q-pb-xs full-width">
          <div class="col">Hasil :
            <span> {{ resikoJatuh?.hasil_resiko_pasien_jatuh === '' ? '-' : resikoJatuh?.hasil_resiko_pasien_jatuh
              }}</span>
          </div>
        </div>
        <div class="row items-center q-pb-xs full-width">
          <div class="col">Diberikan ke dokter : {{ resikoJatuh?.diberitaukankedokterjikaya === '' ? '-' :
            resikoJatuh?.diberitaukankedokterjikaya }}
            <span v-if="resikoJatuh?.diberitaukankedokterjikaya === 'Ya'"> {{
              resikoJatuh?.keterangan === '' ? '-' : resikoJatuh?.keterangan }}</span>
          </div>
        </div>
        <!-- MORSE -->
        <!-- <div v-if="resikoJatuh?.morse_fall">
          <div class="text-weight-bold q-mt-md">MORSE FALL</div>

          <div v-for="(sub, key) in resikoJatuh.morse_fall" :key="key" v-if="key !== 'skorMorse'" class="row q-mb-xs">
            <div class="col-5 text-uppercase">{{ key }}</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ sub.label }} => ( {{ sub.skor }} )
            </div>
          </div>

          <div class="row q-mt-sm text-weight-bold">
            <div class="col-5">SKORMORSE</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ resikoJatuh.morse_fall.skorMorse?.label }}
              => ( {{ resikoJatuh.morse_fall.skorMorse?.skor }} )
            </div>
          </div>
        </div> -->

        <!-- HUMPTY -->
        <!-- <div v-if="resikoJatuh?.humpty_dumpty">
          <div class="text-weight-bold q-mt-md">HUMPTY DUMPTY</div>

          <div v-for="(sub, key) in resikoJatuh.humpty_dumpty" :key="key" class="row q-mb-xs">
            <div class="col-5 text-uppercase">{{ key }}</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ sub?.label }} => ( {{ sub?.skor }} )
            </div>
          </div>
        </div> -->

        <!-- BARTHEL -->
        <!-- <div v-if="resikoJatuh?.barthel">
          <div class="text-weight-bold q-mt-md">BARTHEL INDEX</div>

          <div v-for="(sub, key) in resikoJatuh.barthel" :key="key" class="row q-mb-xs">
            <div class="col-5 text-uppercase">{{ key }}</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ sub?.label }} => ( {{ sub?.skor }} )
            </div>
          </div>
        </div> -->

        <!-- NORTON -->
        <!-- <div v-if="resikoJatuh?.norton">
          <div class="text-weight-bold q-mt-md">NORTON</div>

          <div v-for="(sub, key) in resikoJatuh.norton" :key="key" class="row q-mb-xs">
            <div class="col-5 text-uppercase">{{ key }}</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ sub?.label }} => ( {{ sub?.skor }} )
            </div>
          </div>
        </div> -->

        <!-- ONTARIO -->
        <!-- <div v-if="resikoJatuh?.ontario">
          <div class="text-weight-bold q-mt-md">ONTARIO</div>

          <div v-for="(sub, key) in resikoJatuh.ontario" :key="key" class="row q-mb-xs">
            <div class="col-5 text-uppercase">{{ key }}</div>
            <div class="col-auto q-mx-xs">:</div>
            <div class="col">
              {{ sub?.label }} => ( {{ sub?.skor }} )
            </div>
          </div>
        </div> -->

      </div>
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
      <div>Aktifitas : {{ statusFungsional.aktifitas }}</div>
      <div>Alat BAntu : {{ statusFungsional.alatbantu }}</div>
      <div>Sebutkan Alat Bantu : {{ statusFungsional.alat_bantu_jalan }}</div>
    </div>
    <div class="row q-pl-xs q-mt-md items-start">
      <div class="text-weight-bold text-uppercase" style="width: 300px;">14. KEBUTUHAN KOMUNIKASI DAN EDUKASI</div>
      <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
      <div class="col">Bicara: {{ kebutuhanEdukasi?.bicara }}</div>
      <div class="col">Sebutkan Komunikasi Lain nya: {{ kebutuhanEdukasi?.sebutkankomunaksilainnya }}</div>
      <div class="col">Penerjemah: {{ kebutuhanEdukasi?.penerjemah }}</div>
      <div class="col">Bahasa isyarat: {{ kebutuhanEdukasi?.bahasa_isyarat }}</div>
    </div>
    <div class="row q-pl-xs q-mt-md items-start">
      <div class="text-weight-bold text-uppercase" style="width: 300px;">15. SKRINING GIZI</div>
      <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
      <div class="col">Apakah Ada Penurunan Berat badan yang tidak diinginkan selama 6 Bulan terakhir? : {{ skriningGizi
        }}</div><br>
    </div>
    <div class="row q-pl-xs q-mt-md items-start">
      <div class="text-weight-bold text-uppercase" style="width: 300px;">16. DIAGNOSA KEPERAWATAN</div>
      <div class="text-weight-bold text-uppercase" style="width: 10px;"> : </div>
      <div class="col"> {{ diagnosaKeperawatan }}</div>
    </div>
    <q-separator class="q-mt-md q-mb-sm" style="border-top: 1px solid;" />
    <div class="row q-mt-xl q-mb-xl">
      <div class="col-6">
        <div class="text-center text-weight-bold q-pt-md">
          Pasien/Keluarga
        </div>
        <div class="text-center" style="height: 120px;">
          <div class="signature-line">(......................................................................)</div>
        </div>
      </div>
      <div class="col-6">
        <div class="text-center text-weight-bold">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
        <div class="text-center text-weight-bold q-mt-xs">
          Perawat
        </div>
        <div class="col-6 text-weight-bold text-center">

          <div class="column flex-center q-mt-md">
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
            <div class="q-mt-sm text-center">
              {{ perawat?.nama || '(..........................)' }}
            </div>
          </div>
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

const nyeri = computed(() => {
  const anamnesis = props?.pasien?.anamnesis || []

  // ambil data perawat
  const data = anamnesis.find(
    i => String(i?.datasimpeg?.kdgroupnakes) === "2"
  )

  const tambahan = data?.anamnesetambahan?.[0] || {}

  const skor = data?.scorenyeri
  const ket = data?.keteranganscorenyeri

  return {
    skor: skor ?? null,
    text: skor !== undefined && skor !== null
      ? `Skor Nyeri: ${skor}`
      : 'Skor Nyeri: -',
    ket: ket || null,

    lokasi: tambahan?.lokasi_nyeri || '-',
    hilang: tambahan?.nyeri_hilang || '-',
    durasi: tambahan?.durasi_nyeri || '-',
    penyebab: tambahan?.penyebab_nyeri || '-',
    frekuensi: tambahan?.frekwensi_nyeri || '-'
  }
})

const hitungKategori = (morse) => {
  const total = Object.values(morse || {}).reduce((sum, val) => {
    return sum + (val?.skor || 0)
  }, 0)

  let kategori = 'Risiko Rendah'
  if (total >= 45) kategori = 'Risiko Tinggi'
  else if (total >= 25) kategori = 'Risiko Sedang'

  return { total, kategori }
}

const resikoJatuh = computed(() => {
  // const data = props?.pasien?.penilaiananamnesis
  const data = props?.pasien?.anamnesis

  if (!Array.isArray(data) || !data.length) return null

  return data[0]
})
const dataPsikologi = computed(() => {
  const psi = props?.pasien?.pemeriksaanfisikpsikologidll?.[0]?.pemerisaanpsikologidll
  if (!psi) return '-'
  return `Psikologis: ${psi.status_psikologis_lain ?? psi.status_psikologis ?? '-'} || Sosial: ${psi.sosial ?? '-'} || Ekonomi: ${psi.ekonomi ?? '-'} || Spiritual: ${psi.spiritual ?? '-'} || Kepercayaan: ${psi.nilai_kepercayaan ?? '-'} ${psi.ket_nilaikepercayaan ?? '-'}`
})
const statusFungsional = computed(() => {
  const anamnesis = props?.pasien?.anamnesis || []

  const data = anamnesis.find(
    i => String(i?.datasimpeg?.kdgroupnakes) === "2"
  )

  const tambahan = data?.anamnesetambahan?.[0] || {}
  console.log('anamnesis', anamnesis)
  console.log('data', data)
  console.log('tambahan', tambahan)
  return {
    aktifitas: tambahan?.aktifitas_mobilitas || '-',
    alatbantu: tambahan?.alat_bantu_jalan || '-',
    sebutkanalatbantu: tambahan?.sebutkanalatbantujalan || '-',

  }
})

const kebutuhanEdukasi = computed(() => {
  const anamnesis = props?.pasien?.anamnesis || []

  const data = anamnesis[0] || {}
  const tambahan = data?.anamnesetambahan?.[0] || {}

  return {
    bicara: tambahan?.bicara || '-',
    sebutkankomunaksilainnya: tambahan?.sebutkankomunaksilainnya || '-',
    penerjemah: tambahan?.penerjemah || '-',
    sebutkanpenerjemah: tambahan?.sebutkanpenerjemah || '-',
    bahasa_isyarat: tambahan?.bahasa_isyarat || '-',
  }
})
const skriningGizi = computed(() => {
  const anamnesis = props?.pasien?.anamnesis || []

  const data = anamnesis[0] || {}
  const tambahan = data?.anamnesetambahan?.[0] || {}

  return {
    riwayat_bb_turun: tambahan?.riwayat_bb_turun || '-',
    sebutkankomunaksilainnya: tambahan?.sebutkankomunaksilainnya || '-',
    penerjemah: tambahan?.penerjemah || '-',
  }
})
const diagnosaKeperawatan = computed(() => {
  const diagnosa = props?.pasien?.diagnosakeperawatan
  if (!diagnosa || !diagnosa.length) return '-'
  return diagnosa.map(item => `${item.kode ?? ''} - ${item.nama ?? ''}`).join(' || ')
})

// hasilnya tinggal kamu pakai
console.log('filtered', props?.pasien?.anamnesis?.find(i => i?.datasimpeg?.kdgroupnakes === "2"))
const perawat = computed(() => {
  const data = props?.pasien?.tinjauanulang || []

  return data?.map(items => items || [])?.[0]
})

const qrUrl = computed(() => {
  // console.log('props pasien', props?.pasien)
  const noreg = props?.pasien?.noreg// noreg
  const dok = 'Pengkajian Awal Keperawatan.png'
  const asal = 'RAWAT JALAN'
  const petugas = perawat.value?.user
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`
  // return `https://xenter.my.id/qr-document?noreg=${noreg}&dokumen=${dok}&asal=${asal}`
})



console.log('perawat', perawat.value)
function iconNyeri(anu) {
  const val = typeof anu === 'string' ? (isNaN(parseInt(anu)) ? 0 : parseInt(anu)) : 0
  // console.log('val nyeri', val)
  // console.log('anu nyeri', anu)
  let icon = 'icon-my-emoticon-excited-outline'
  if (val < 2) {
    icon = 'icon-my-emoticon-excited-outline'
  }
  else if (val >= 2 && val < 4) {
    icon = 'icon-my-emoticon-outline'
  }
  else if (val >= 4 && val < 6) {
    icon = 'icon-my-emoticon-neutral-outline'
  }
  else if (val >= 6 && val < 8) {
    icon = 'icon-my-emoticon-confused-outline'
  }
  else if (val >= 8 && val < 10) {
    icon = 'icon-my-emoticon-angry-outline'
  }
  else if (val === 10) {
    icon = 'icon-my-emoticon-cry-outline'
  }

  return icon
}
</script>
<style lang="scss" scoped>
.garis-bawah-dablue {
  border-bottom: 1px solid rgb(56, 150, 239);
  border-bottom-style: dashed;
}

.signature-line {
  padding-top: 130px;
}

.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}
</style>
