<template>
  <div class="b q-pa-md">
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">
        1.
      </div>
      <div class="col-2">
        Diagnosa (ASSESMENT)
      </div>
      <div class="col-auto">
        :
      </div>
      <div class="col-10">
        <div v-for="(diag, i) in pasien?.diagnosa" :key="i">
          {{ diag?.masterdiagnosa?.rs4 }}
        </div>
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto ">
        2.
      </div>
      <div class="col-2">
        Anamnesis (SUBYEKTIF)
      </div>
      <div class="col-auto">
        :
      </div>
      <div class="col-10" v-for="(anamnesis, i) in hasilanamnesis" :key="i">
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Keluhan Utama
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ anamnesis?.rs4 }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Riwayat Penyakit Sekarang
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ anamnesis?.riwayatpenyakitsekarang }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Riwayat Penyakit Dahulu
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ anamnesis?.riwayatpenyakit }}
          </div>
        </div>
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">
        3.
      </div>
      <div class="col-2">
        Pemeriksaan Fisik (OBYEKTIF)
      </div>
      <div class="col-auto">
        :
      </div>
      <div class="col-10" v-for="(pemeriksaanfisik, i) in hasilpemeriksaanfisik" :key="i">
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Kepala
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs5 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Leher
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs6 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Dada
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs7 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Punggung
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs8 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Perut
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs9 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Tangan
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs10 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Kaki
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs11 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Status Neurologis
          </div>
          <div class="col-auto">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs12 ?? '-' }}
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            - Genital
          </div>
          <div class="col-1">
            :
          </div>
          <div class="col-8">
            {{ pemeriksaanfisik?.rs13 ?? '-' }}
          </div>
        </div>
        <q-separator class="q-mt-sm q-mb-sm" style="width: 88%;" />
        <div class="row q-gutter-sm" v-for="(triage, x) in pasien?.triage" :key="x">
          <q-badge outline color="black">
            Sax : {{ triage?.suhu ?? '-' }}</q-badge>
          <!-- <q-badge outline color="black">
            Srec : {{ triage?.suhu ?? '-' }}</q-badge> -->
          <q-badge outline color="black">
            Napas : {{ triage?.pernapasanx ?? '-' }}</q-badge>
          <q-badge outline color="black">
            Nadi : {{ triage?.nadi ?? '-' }}</q-badge>
          <q-badge outline color="black">
            Tensi : {{ triage?.sistole ?? '-' }}/{{ triage?.diastole ?? '-' }}</q-badge>
          <q-badge outline color="black">
            Spo2 : {{ triage?.spo2 ?? '-' }}</q-badge>
          <q-badge outline color="black">
            BB : {{ triage?.bb ?? '-' }}</q-badge>
          <q-badge outline color="black">
            Tinggi : {{ triage?.tb ?? '-' }}</q-badge>
          <!-- <q-badge outline color="black">
            Alergi : {{ anamnesis?.riwayatalergi ?? '-' }}</q-badge> -->
        </div>
        <q-separator class="q-mt-sm q-mb-sm" style="width: 88%;" />
        <div v-for="(triagex, xx) in pasien?.triage" :key="xx">
          Kategori Triage : {{ triagex?.kategoritriage ?? '-' }}
        </div>
        <div>
          Skor Nyeri :
          <q-icon v-if="nyeri && nyeri.skor !== null" size="xs" color="teal" :name="iconNyeri(nyeri.skor)" />

          <span class="text-weight-medium">
            {{ nyeri?.text || '-' }}
          </span>

          <em v-if="nyeri?.ket" class="text-primary">
            ({{ nyeri.ket }})
          </em>
        </div>
      </div>
    </div>
    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">4.</div>
      <div class="col-2">
        Laboratorium
      </div>
      <div class="col-auto">:</div>
      <div class="col-8">
        <div class="row q-gutter-sm">
          <div v-for="(lab, l) in pasien?.laboratold" :key="l">
            <q-badge outline color="black">{{ lab?.pemeriksaanlab?.rs2 }} = {{ lab?.rs21 ?? '-' }}</q-badge>
          </div>
        </div>
      </div>
    </div>
    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">5.</div>
      <div class="col-2">
        Radiologi
      </div>
      <div class="col-auto">:</div>
      <div class="col-8">
        <div class="row q-gutter-sm">
          <div v-for="(haradio, r) in pasien?.hasilradiologi" :key="r">
            <span>{{ haradio?.rs3 }}</span>
          </div>
        </div>
      </div>
    </div>
    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">6.</div>
      <div class="col-2">
        Obat
      </div>
      <div class="col-auto">:</div>
      <div class="col-8">
        <div class="row q-gutter-xs">
          <div v-for="(newapotekrajalx, rx) in filterredTableobat" :key="rx">
            <q-badge color="black" outline>{{ newapotekrajalx?.nama }}</q-badge>
          </div>
        </div>
      </div>
    </div>
    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">7.</div>
      <div class="col-2">
        Tindakan
      </div>
      <div class="col-auto">:</div>
      <div class="col-8">
        <div class="row q-gutter-xs">
          <div v-for="(tindakan, t) in filterredTabletindakan" :key="t">
            <q-badge color="black" outline>{{ tindakan?.nama }}</q-badge>
          </div>
        </div>
      </div>
    </div>
    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-gutter-sm items-center no-wrap ">
      <div class="col-auto">8.</div>
      <div class="col-2">
        Cara Keluar
      </div>
      <div class="col-auto">:</div>
      <div class="col-8">
        <div class="row q-gutter-xs">
          <div v-for="(carakeluar, t) in pasien?.planheder" :key="t">
            <span v-if="carakeluar?.rs4 === 'Pulang'">{{ carakeluar?.rs4 }} Dengan Kondisi
              {{ carakeluar?.planpulang?.atas_dasar
              }}
            </span>
            <span v-else-if="carakeluar?.rs4 === 'Rawat Inap'">{{ carakeluar?.rs4 }} Ke {{
              carakeluar?.planranap?.ruangranap?.rs2 }}</span>
            <span v-else-if="carakeluar?.rs4 === 'Rujuk'">{{ carakeluar?.rs4 }} Ke {{ carakeluar?.transrujukan?.rs7
            }}</span>
            <span v-else></span>
          </div>
        </div>
      </div>
    </div>

    <q-separator class=" q-mt-sm q-mb-sm" style="border-top: 1px solid black;" />
    <div class="row q-mt-xl q-mb-xl">
      <div class="col-6">
        <div class="text-center text-weight-bold q-pt-md">
          Pasien/Keluarga
        </div>
        <div v-if="!resumeSignature" class="no-print">
          <app-input-simrs v-model="store.form.saksiPasien" label="Nama Saksi Pasien" class="col-6"
            :valid="{ required: false }" />

          <q-select v-model="store.form.hubunganPasien" :options="hubunganPasienOptions" label="Hubungan dengan Pasien"
            outlined dense emit-value map-options class="q-mt-sm" />

          <app-signature :ttd="store.form.resumekeluargapasien" :width="250" :height="150" label-ttd="TTD yg Menyatakan"
            @save-ttd="(val) => store.form.resumekeluargapasien = val" :pasien="pasien" uuid="resumekeluargapasien"
            @signature="(val) => {
              store.form.resumekeluargapasien = val
            }" />
          <div class="row justify-center q-mt-sm">
            <q-btn color="teal" icon="icon-mat-save" label="Simpan TTD" no-caps style="width: 250px;"
              :loading="store.loadingsimpanttd" @click="saveResumeSignature" />
          </div>
        </div>
        <div class="text-center signature-box" style="height: 120px;">
          <img v-if="resumeSignature" :src="resumeSignatureUrl" alt="Tanda tangan pasien/keluarga"
            class="signature-image" />
          <div v-if="resumeSignature" class="signature-line signature-line--with-image">
            ({{ resumeSignerName }})
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="text-center text-weight-bold">
          Probolinggo, {{ date.formatDate(Date.now(), 'DD MMMM YYYY') }}
        </div>
        <div class="text-center text-weight-bold q-mt-xs">
          Dokter
        </div>
        <div class="column flex-center q-mt-md">
          <div style="width: 100px;">
            <vue-qrcode :value="qrDokter" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: {
                dark: '#000000',
                light: '#ffffff',
              },
              margin: 0
            }" />
          </div>
          <div class="q-mt-sm text-weight-bold text-center">
            {{ pasien?.dokter }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <pre>{{ props?.pasien }}</pre> -->
</template>
<script setup>
import { formatRp } from 'src/modules/formatter';
import { useKasirIgdStore } from 'src/stores/simrs/kasir/igd/kasirigd';
import { pathImg } from 'src/boot/axios';
import { date } from 'quasar';
import { computed, ref, watch } from 'vue';
import AppSignature from 'src/components/~global/AppSignature.vue';

const store = useKasirIgdStore()
const props = defineProps({
  pasien: { type: Object, default: () => { } }
})

const savedResumeSignature = ref('')

watch(
  () => [props.pasien?.noreg, props.pasien?.norm],
  ([noreg, norm]) => {
    savedResumeSignature.value = ''
    store.form.kodedokumen = 'DK-RE'
    store.form.noreg = noreg ?? ''
    store.form.norm = norm ?? ''
    store.form.resumekeluargapasien = ''
    store.form.saksiPasien = ''
    store.form.hubunganPasien = ''
  },
  { immediate: true }
)

const hubunganPasienOptions = [
  { label: 'Pasien sendiri', value: 'Pasien sendiri' },
  { label: 'Orangtua', value: 'Orangtua' },
  { label: 'Anak', value: 'Anak' },
  { label: 'Saudara', value: 'Saudara' },
  { label: 'Teman', value: 'Teman' },
  { label: 'Orang lain', value: 'Orang lain' },
  { label: 'Suami', value: 'Suami' },
  { label: 'Istri', value: 'Istri' }
]

const resumeTtdDocument = computed(() => {
  const documents = props.pasien?.ttd_dokumen_igd ?? []
  if (!Array.isArray(documents)) return null

  return documents.find(item => String(item?.kodedokumen ?? '').trim().toUpperCase() === 'DK-RE') ?? null
})

const resumeSignature = computed(() => {
  const document = resumeTtdDocument.value
  return document?.ttd || document?.resumekeluargapasien || document?.signature || savedResumeSignature.value
})

const resumeSignerName = computed(() => {
  return resumeTtdDocument.value?.nama || store.form.saksiPasien || ''
})

const resumeSignatureUrl = computed(() => {
  const signature = resumeSignature.value
  if (!signature || signature.startsWith('data:image') || signature.startsWith('http')) return signature
  return pathImg + signature
})

async function saveResumeSignature() {
  const signature = store.form.resumekeluargapasien
  if (!signature) return

  const result = await store.simpanttd()
  if (result) savedResumeSignature.value = signature
}

const qrDokter = computed(() => {
  // const petugas = 'Nama : ' + dpjp?.value?.nama ?? '' + 'NIP : ' + dpjp?.value?.nip ?? ''
  // const enc = btoa(`${petugas}`)
  // return `${enc}`

  const noreg = props?.pasien?.noreg// noreg
  const dok = 'RESUME.png'
  const asal = 'RAWAT JALAN'
  const petugas = props?.pasien?.kddokter ?? props?.pasien?.kodedokter ?? null
  const enc = btoa(`${noreg}|${dok}|${asal}|${petugas}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${enc}`

})


const dataanamnesis = props?.pasien?.anamnesis
const hasilanamnesis = dataanamnesis?.filter(item => {
  if (item?.datasimpeg?.kdgroupnakes === "1") {
    // lakukan sesuatu dengan item
    console.log(item);
    return true;
  }
  return false;
});

const datapemeriksaanfisik = props?.pasien?.pemeriksaanfisikpsikologidll
const hasilpemeriksaanfisik = datapemeriksaanfisik?.filter(item => {
  if (item?.datasimpeg?.kdgroupnakes === "1") {
    // lakukan sesuatu dengan item
    console.log(item);
    return true;
  }
  return false;
});

const filterredTableobat = computed(() => {
  const dataawalobat = props?.pasien?.newapotekrajal
  // console.log('dataawalobat', dataawalobat);
  const hasilglobal = []
  dataawalobat?.forEach(x => {
    const permintaanresep = x?.permintaanresep
    // console.log('permintaanresep', permintaanresep);
    const hasil = []
    permintaanresep?.forEach(y => {
      // console.log('y', y?.mobat);
      const obat = {
        kode: y?.mobat?.kd_obat,
        nama: y?.mobat?.nama_obat,
      }
      hasil.push(obat)
    })
    const xxx = [...new Set(hasil)]
    // const sasa = xxx.filter(item => item.kode !== null)
    hasilglobal.push(xxx)
  })

  const flattenedArray = hasilglobal.flat();
  const uniqueMap = new Map()
  flattenedArray?.forEach(item => uniqueMap.set(item.kode, item));

  return [...uniqueMap.values()]
})


const filterredTabletindakan = computed(() => {
  const arr = props?.pasien?.tindakan
  console.log('arr', arr);
  const tindakan = []
  arr.forEach(x => {
    const tindakanx = {
      kode: x?.mastertindakan?.rs1,
      nama: x?.mastertindakan?.rs2,
    }
    tindakan.push(tindakanx)
  })
  const xxx = tindakan
  const uniqueMap = new Map();
  xxx.forEach(item => uniqueMap.set(item.kode, item));

  return [...uniqueMap.values()]
})

function iconNyeri(skor) {
  const nilai = Number(skor)

  if (nilai <= 0) return 'sentiment_very_satisfied'
  if (nilai <= 3) return 'sentiment_satisfied'
  if (nilai <= 6) return 'sentiment_neutral'
  if (nilai <= 9) return 'sentiment_dissatisfied'

  return 'sentiment_very_dissatisfied'
}

const nyeri = computed(() => {
  const anamnesis = props?.pasien?.anamnesis || []

  const data = anamnesis.find(
    i => String(i?.datasimpeg?.kdgroupnakes) === '2'
  )

  if (!data) {
    return {
      skor: null,
      text: '-',
      ket: null
    }
  }

  return {
    skor: data?.scorenyeri ?? null,
    text: data?.scorenyeri ?? '-',
    ket: data?.keteranganscorenyeri ?? null
  }
})
</script>

<style lang="scss" scoped>
.garis-bawah-dablue {
  border-bottom: 1px solid rgb(56, 150, 239);
  border-bottom-style: dashed;
}

.signature-line {
  padding-top: 130px;
}

.signature-line--with-image {
  padding-top: 100px;
}

.signature-box {
  position: relative;
}

.signature-image {
  position: absolute;
  bottom: 20px;
  left: 50%;
  max-width: 250px;
  max-height: 100px;
  object-fit: contain;
  transform: translateX(-50%);
}

.b {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  border-top: none;
}

.b_double {
  border-bottom: 4px double rgb(30, 30, 30);
  border-left: none;
  border-right: none;
  border-top: none;
  padding-top: 8px;
}

.b1 {
  border: 2px solid #000;
}

.b2 {
  border-right: 2px solid #000;
  border-left: none;
  border-bottom: none;
  border-top: none;
}

.b3 {
  border-bottom: 2px solid #000;
  border-left: none;
  border-right: none;
  border-top: none;
}

.b4 {
  border-right: 2px solid #000;
  border-left: 2px solid #000;
  border-bottom: none;
  border-top: none;
}

.b5 {
  border-left: 2px solid #000;
  border-right: none;
  border-bottom: none;
  border-top: none;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
