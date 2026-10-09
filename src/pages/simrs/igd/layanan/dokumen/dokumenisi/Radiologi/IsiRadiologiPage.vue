<template>
  <div class="b q-pa-md">
    * Pemeriksasan Radiologi
    <div>
      <div class="q-ma-sm text-bold" v-for="(item, i) in props.pasien?.radiologi" :key="i">
        {{ item?.rs4 }} <br>
      </div>
    </div>
    * Hasil Bacaan Radiologi
    <div>
      <div v-for="(item, x) in props.pasien?.hasilradiologi" :key="x">
        {{ item?.rs3 }}
      </div>
    </div>
    <div class="row justify-end q-mt-xl">
      <div v-for="(dokter, index) in dokterRadiologis" :key="`${dokter.nota}-${dokter.nama}-${index}`" class="col-6 text-center">
        <div class="q-mb-sm">Dokter Radiologi</div>
        <div class="column items-center">
          <div class="radiologi-doctor-qr">
            <vue-qrcode :value="qrUrl(dokter)" tag="svg" :options="{
              errorCorrectionLevel: 'Q',
              color: { dark: '#000000', light: '#ffffff' },
              margin: 0
            }" />
          </div>
        </div>
        <div class="q-mt-sm text-weight-bold">
          {{ dokter.nama }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const props = defineProps({
  pasien: {
    type: Object,
    default: null
  }
})

const doctors = ref([])

const dokterRadiologis = computed(() => {
  const hasilByPemeriksaan = (props.pasien?.radiologi ?? []).flatMap(permintaan =>
    (permintaan?.rincians ?? [])
      .filter(rincian => rincian?.pelaksana)
      .map(rincian => ({
        nama: rincian.pelaksana,
        nota: rincian.rs2 || permintaan.rs2
      }))
  )
  const hasil = hasilByPemeriksaan.length
    ? hasilByPemeriksaan
    : (props.pasien?.hasilradiologi ?? [])
      .filter(item => item?.rs4)
      .map(item => ({ nama: item.rs4, nota: item.rs5 }))

  const uniqueResults = new Map()
  hasil.forEach(item => {
    const nama = String(item.nama).trim()
    const normalizedName = normalizeName(nama)
    const matchingNakes = doctors.value.filter(nakes => normalizeName(nakes?.nama) === normalizedName)
    const dokter = matchingNakes.find(nakes => String(nakes?.kdgroupnakes).trim() === '1') ??
      matchingNakes.find(nakes => nakes?.kdpegsimrs)
    const key = normalizedName
    if (!uniqueResults.has(key)) {
      uniqueResults.set(key, {
        nama: dokter?.nama ?? nama,
        nota: item.nota || props.pasien?.noreg,
        kdpegsimrs: dokter?.kdpegsimrs ?? null
      })
    }
  })

  return [...uniqueResults.values()]
})

onMounted(async () => {
  try {
    const { data } = await api.get('/v1/simrs/master/pegawai/listnakes')
    const nakes = Array.isArray(data) ? data : data?.data
    if (!Array.isArray(nakes)) {
      throw new TypeError('Respons daftar petugas bukan array')
    }
    doctors.value = nakes
  } catch (error) {
    console.error('Gagal memuat daftar dokter radiologi', error)
  }
})

function normalizeName (name) {
  return String(name ?? '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\bdr\.?\s*/g, '')
    .replace(/sp\.?\s*rad\.?/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function qrUrl (dokter) {
  const encoded = btoa(`${dokter?.nota || props.pasien?.noreg}|RADIOLOGI.png|RADIOLOGI|${dokter?.kdpegsimrs ?? null}`)
  return `https://rsud.probolinggokota.go.id/dokumen-simrs/legalitas/${encoded}`
}
</script>
<style scoped>
.b {
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
  border-width: 2px;
}

.radiologi-doctor-qr {
  width: 100px;
}
</style>
